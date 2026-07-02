// =====================================================
// NOOR Panel API — Node.js + Express
// Backend sécurisé pour le panneau client NOOR-SARL
// =====================================================

import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

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
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

// --- Santé ---
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`NOOR Panel API démarrée sur le port ${PORT}`);
});
