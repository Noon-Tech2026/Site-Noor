// =====================================================
// NOOR Panel API — Node.js + Express
// Backend sécurisé pour le panneau client NOOR-SARL
// =====================================================

import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

// --- Configuration (via variables d'environnement) ---
const {
  DB_HOST = "mariadb",
  DB_NAME = "noor_panel",
  DB_USER = "noor_panel_user",
  DB_PASS = "",
  CORS_ORIGIN = "https://panel.noor.lu",
  PORT = 8082,
} = process.env;

const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 heures

// --- Pool de connexions MariaDB ---
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
});

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Doit rester synchronisé avec SERVICE_KEYS dans frontend/src/components/NoorSite.jsx
const SERVICE_KEYS = [
  "sites_apps",
  "centres_appels",
  "reseaux_infra",
  "ia",
  "admin_serveurs",
  "cybersecurite",
  "api_sms",
  "adressage",
  "sixrig",
];
const SERVICE_STATUSES = ["nouvelle", "en_contact", "en_cours", "terminee", "annulee"];

// --- Stockage des documents envoyés par les clients ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${crypto.randomBytes(16).toString("hex")}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
});

function uploadSingle(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || "Échec de l'envoi du fichier" });
    next();
  });
}

// Charge une demande de service et vérifie que l'utilisateur peut y accéder (propriétaire ou admin)
async function loadAccessibleServiceRequest(req, res, id) {
  const [rows] = await pool.query("SELECT * FROM service_requests WHERE id = ?", [id]);
  const sr = rows[0];
  if (!sr) {
    res.status(404).json({ error: "Demande introuvable" });
    return null;
  }
  if (req.user.role !== "admin" && sr.user_id !== req.user.id) {
    res.status(403).json({ error: "Accès refusé" });
    return null;
  }
  return sr;
}

// --- Utilitaires ---
function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function bearerToken(req) {
  const auth = req.headers.authorization || "";
  const m = auth.match(/Bearer\s+(.+)/i);
  return m ? m[1].trim() : null;
}

// Récupère l'utilisateur courant à partir du token, ou null
async function currentUser(req) {
  const token = bearerToken(req);
  if (!token) return null;
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.full_name, u.role, u.is_active
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > NOW()`,
    [sha256(token)]
  );
  return rows[0] || null;
}

// Middleware : exige une session valide
async function requireUser(req, res, next) {
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: "Non authentifié" });
    if (user.is_active !== 1)
      return res.status(403).json({ error: "Compte désactivé" });
    req.user = user;
    next();
  } catch (e) {
    console.error("auth error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// --- Route : connexion ---
app.post("/api/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password)
      return res.status(400).json({ error: "Email et mot de passe requis" });

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND is_active = 1",
      [email]
    );
    const user = rows[0];

    // Vérification bcrypt (temps constant). Toujours comparer même si user absent.
    const hash = user ? user.password_hash : "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinva";
    const ok = await bcrypt.compare(password, hash);
    if (!user || !ok)
      return res.status(401).json({ error: "Identifiants invalides" });

    // Générer un token de session
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
    await pool.query(
      "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [user.id, sha256(token), expires]
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("login error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- Route : inscription (création de compte client) ---
app.post("/api/register", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const fullName = String(req.body.full_name || "").trim();

    if (!email || !password || !fullName)
      return res.status(400).json({ error: "Nom, e-mail et mot de passe requis" });
    if (password.length < 6)
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères" });

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(409).json({ error: "Un compte existe déjà avec cet e-mail" });

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, 'client', 1)",
      [email, passwordHash, fullName]
    );

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
    await pool.query(
      "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [result.insertId, sha256(token), expires]
    );

    res.status(201).json({
      token,
      user: { id: result.insertId, email, full_name: fullName, role: "client" },
    });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Un compte existe déjà avec cet e-mail" });
    console.error("register error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- Route : déconnexion ---
app.post("/api/logout", requireUser, async (req, res) => {
  try {
    const token = bearerToken(req);
    if (token)
      await pool.query("DELETE FROM sessions WHERE token_hash = ?", [
        sha256(token),
      ]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- Route : utilisateur courant ---
app.get("/api/me", requireUser, (req, res) => {
  const u = req.user;
  res.json({
    user: { id: u.id, email: u.email, full_name: u.full_name, role: u.role },
  });
});

// --- Route : données du tableau de bord ---
// Le client voit SES données. L'admin voit tout.
app.get("/api/dashboard", requireUser, async (req, res) => {
  try {
    const user = req.user;
    if (user.role === "admin") {
      const [sites] = await pool.query(
        `SELECT s.*, u.full_name AS client_name FROM sites s
         JOIN users u ON u.id = s.user_id ORDER BY s.updated_at DESC`
      );
      const [invoices] = await pool.query(
        `SELECT i.*, u.full_name AS client_name FROM invoices i
         JOIN users u ON u.id = i.user_id ORDER BY i.issued_date DESC`
      );
      const [documents] = await pool.query(
        `SELECT d.*, u.full_name AS client_name FROM documents d
         JOIN users u ON u.id = d.user_id ORDER BY d.created_at DESC`
      );
      const [clients] = await pool.query(
        `SELECT id, email, full_name, is_active, created_at
         FROM users WHERE role = 'client' ORDER BY created_at DESC`
      );
      return res.json({ role: "admin", sites, invoices, documents, clients });
    }

    // Client : uniquement ses propres données
    const uid = user.id;
    const [sites] = await pool.query(
      "SELECT * FROM sites WHERE user_id = ? ORDER BY updated_at DESC",
      [uid]
    );
    const [invoices] = await pool.query(
      "SELECT * FROM invoices WHERE user_id = ? ORDER BY issued_date DESC",
      [uid]
    );
    const [documents] = await pool.query(
      "SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC",
      [uid]
    );
    res.json({ role: "client", sites, invoices, documents });
  } catch (e) {
    console.error("dashboard error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- Route : créer une ou plusieurs demandes de service ---
app.post("/api/service-requests", requireUser, async (req, res) => {
  try {
    const services = Array.isArray(req.body.services) ? req.body.services : [];
    const keys = [...new Set(services.filter((s) => SERVICE_KEYS.includes(s)))];
    if (keys.length === 0)
      return res.status(400).json({ error: "Aucun service valide fourni" });

    await Promise.all(
      keys.map((key) =>
        pool.query(
          "INSERT IGNORE INTO service_requests (user_id, service_key) VALUES (?, ?)",
          [req.user.id, key]
        )
      )
    );

    const [rows] = await pool.query(
      "SELECT id, service_key, status, created_at FROM service_requests WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.status(201).json({ requests: rows });
  } catch (e) {
    console.error("service-requests create error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- Route : lister les demandes de service (le client voit les siennes, l'admin voit tout) ---
app.get("/api/service-requests", requireUser, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const [rows] = await pool.query(
        `SELECT sr.id, sr.service_key, sr.status, sr.created_at, sr.updated_at,
                u.id AS user_id, u.full_name AS client_name, u.email AS client_email
         FROM service_requests sr
         JOIN users u ON u.id = sr.user_id
         ORDER BY sr.created_at DESC`
      );
      return res.json({ requests: rows });
    }
    const [rows] = await pool.query(
      "SELECT id, service_key, status, created_at, updated_at FROM service_requests WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ requests: rows });
  } catch (e) {
    console.error("service-requests list error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- Route : mettre à jour le statut d'une demande (admin uniquement) ---
app.patch("/api/service-requests/:id", requireUser, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Réservé à l'administrateur" });

    const status = String(req.body.status || "");
    if (!SERVICE_STATUSES.includes(status))
      return res.status(400).json({ error: "Statut invalide" });

    const [result] = await pool.query(
      "UPDATE service_requests SET status = ? WHERE id = ?",
      [status, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Demande introuvable" });

    res.json({ ok: true });
  } catch (e) {
    console.error("service-requests update error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- Route : messages liés à une demande de service (chat client <-> administration) ---
app.get("/api/service-requests/:id/messages", requireUser, async (req, res) => {
  try {
    const sr = await loadAccessibleServiceRequest(req, res, req.params.id);
    if (!sr) return;
    const [rows] = await pool.query(
      `SELECT sm.id, sm.body, sm.created_at, sm.user_id, u.full_name, u.role
       FROM service_messages sm
       JOIN users u ON u.id = sm.user_id
       WHERE sm.service_request_id = ?
       ORDER BY sm.created_at ASC`,
      [sr.id]
    );
    res.json({ messages: rows });
  } catch (e) {
    console.error("messages list error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/service-requests/:id/messages", requireUser, async (req, res) => {
  try {
    const sr = await loadAccessibleServiceRequest(req, res, req.params.id);
    if (!sr) return;
    const body = String(req.body.body || "").trim();
    if (!body) return res.status(400).json({ error: "Le message ne peut pas être vide" });
    if (body.length > 4000) return res.status(400).json({ error: "Message trop long" });

    const [result] = await pool.query(
      "INSERT INTO service_messages (service_request_id, user_id, body) VALUES (?, ?, ?)",
      [sr.id, req.user.id, body]
    );
    res.status(201).json({
      message: {
        id: result.insertId,
        body,
        created_at: new Date().toISOString(),
        user_id: req.user.id,
        full_name: req.user.full_name,
        role: req.user.role,
      },
    });
  } catch (e) {
    console.error("messages create error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- Route : documents liés à une demande de service ---
app.get("/api/service-requests/:id/documents", requireUser, async (req, res) => {
  try {
    const sr = await loadAccessibleServiceRequest(req, res, req.params.id);
    if (!sr) return;
    const [rows] = await pool.query(
      "SELECT id, label, status, file_name, file_size, requested_at, uploaded_at FROM service_documents WHERE service_request_id = ? ORDER BY requested_at DESC",
      [sr.id]
    );
    res.json({ documents: rows });
  } catch (e) {
    console.error("documents list error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// L'administration demande un document au client, pour une demande de service précise
app.post("/api/service-requests/:id/documents", requireUser, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Réservé à l'administrateur" });
    const sr = await loadAccessibleServiceRequest(req, res, req.params.id);
    if (!sr) return;
    const label = String(req.body.label || "").trim();
    if (!label) return res.status(400).json({ error: "Le libellé du document est requis" });

    const [result] = await pool.query(
      "INSERT INTO service_documents (service_request_id, label) VALUES (?, ?)",
      [sr.id, label]
    );
    res.status(201).json({
      document: { id: result.insertId, label, status: "demande", file_name: null, file_size: null, requested_at: new Date().toISOString(), uploaded_at: null },
    });
  } catch (e) {
    console.error("documents create error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Le client envoie le fichier demandé par l'administration
app.post("/api/service-requests/:id/documents/:docId/upload", requireUser, uploadSingle, async (req, res) => {
  try {
    const sr = await loadAccessibleServiceRequest(req, res, req.params.id);
    if (!sr) return;
    if (sr.user_id !== req.user.id)
      return res.status(403).json({ error: "Seul le client concerné peut envoyer ce document" });
    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });

    const [rows] = await pool.query(
      "SELECT * FROM service_documents WHERE id = ? AND service_request_id = ?",
      [req.params.docId, sr.id]
    );
    const doc = rows[0];
    if (!doc) return res.status(404).json({ error: "Document introuvable" });

    await pool.query(
      "UPDATE service_documents SET status = 'envoye', file_name = ?, file_path = ?, file_size = ?, uploaded_at = NOW() WHERE id = ?",
      [req.file.originalname, req.file.filename, req.file.size, doc.id]
    );
    res.json({
      document: {
        id: doc.id,
        label: doc.label,
        status: "envoye",
        file_name: req.file.originalname,
        file_size: req.file.size,
        requested_at: doc.requested_at,
        uploaded_at: new Date().toISOString(),
      },
    });
  } catch (e) {
    console.error("document upload error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Téléchargement d'un document envoyé (client propriétaire ou admin)
app.get("/api/documents/:docId/file", requireUser, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT sd.*, sr.user_id AS owner_id FROM service_documents sd
       JOIN service_requests sr ON sr.id = sd.service_request_id
       WHERE sd.id = ?`,
      [req.params.docId]
    );
    const doc = rows[0];
    if (!doc || doc.status !== "envoye" || !doc.file_path)
      return res.status(404).json({ error: "Document introuvable" });
    if (req.user.role !== "admin" && doc.owner_id !== req.user.id)
      return res.status(403).json({ error: "Accès refusé" });

    res.download(path.join(UPLOAD_DIR, doc.file_path), doc.file_name);
  } catch (e) {
    console.error("document download error:", e.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// --- Santé ---
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`NOOR Panel API démarrée sur le port ${PORT}`);
});
