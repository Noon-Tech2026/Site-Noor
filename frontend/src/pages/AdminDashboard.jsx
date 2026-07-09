import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { api } from "../api/client.js";
import ServiceRequestThread from "../components/ServiceRequestThread.jsx";

const LOGO_SRC = "/logo.png";

const NAV_ITEMS = [
  { key: "overview", label: "Tableau de bord" },
  { key: "clients", label: "Clients" },
  { key: "messages", label: "Messages" },
  { key: "services", label: "Services" },
  { key: "settings", label: "Paramètres" },
];

const SERVICE_LABELS = {
  sites_apps: "Sites & applications",
  centres_appels: "Centres d'appels",
  reseaux_infra: "Réseaux & infrastructure",
  ia: "Intelligence artificielle",
  admin_serveurs: "Administration de serveurs",
  cybersecurite: "Cybersécurité",
  api_sms: "API SMS",
  adressage: "Adressage",
  sixrig: "6RIG",
};

const STATUS_LABELS = {
  nouvelle: "Nouvelle",
  en_contact: "En contact",
  en_cours: "En cours",
  terminee: "Terminée",
  annulee: "Annulée",
};
const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

function formatDate(value) {
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { requests } = await api.myServiceRequests();
      setRequests(requests);
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleStatusChange = async (id, status) => {
    const previous = requests;
    setRequests((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await api.updateServiceRequestStatus(id, status);
    } catch (e) {
      setRequests(previous);
      setError(e.message || "Impossible de mettre à jour le statut");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const newCount = requests.filter((r) => r.status === "nouvelle").length;
  const uniqueClients = new Set(requests.map((r) => r.user_id)).size;

  const STATS = [
    { label: "Demandes de services", value: String(requests.length) },
    { label: "Nouvelles demandes", value: String(newCount) },
    { label: "Clients concernés", value: String(uniqueClients) },
  ];

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <aside style={styles.sidebar}>
        <Link to="/" style={styles.brand}>
          <img src={LOGO_SRC} alt="NOOR" style={styles.brandImg} />
          NOOR
        </Link>
        <nav style={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className="sidebar-link"
              style={{ ...styles.navItem, ...(active === item.key ? styles.navItemActive : {}) }}
              onClick={() => setActive(item.key)}
            >
              {item.label}
              {item.key === "services" && newCount > 0 && (
                <span style={styles.navBadge}>{newCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={styles.sidebarUser}>{user?.email}</div>
          <button className="sidebar-logout" style={styles.logoutBtn} onClick={handleLogout}>Déconnexion</button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.mainHeader}>
          <div style={styles.eyebrow}>Espace administrateur</div>
          <h1 style={styles.title}>{NAV_ITEMS.find((i) => i.key === active)?.label}</h1>
        </header>

        {error && <div style={styles.errorBox}>{error}</div>}

        {active === "overview" && (
          <div style={styles.statsGrid}>
            {STATS.map((s) => (
              <div key={s.label} style={styles.statCard}>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {active === "services" && (
          <>
            {loading ? (
              <div style={styles.placeholder}>Chargement…</div>
            ) : requests.length === 0 ? (
              <div style={styles.placeholder}>Aucune demande de service pour le moment.</div>
            ) : (
              <div style={styles.reqList}>
                {requests.map((r) => {
                  const isOpen = openId === r.id;
                  return (
                    <div key={r.id} style={styles.reqCardWrap}>
                      <div style={styles.reqCard} className="req-card">
                        <div>
                          <div style={{ fontWeight: 500 }}>{r.client_name}</div>
                          <div style={{ color: "#68646F", fontSize: "0.82rem" }}>{r.client_email}</div>
                        </div>
                        <div style={styles.reqService}>{SERVICE_LABELS[r.service_key] || r.service_key}</div>
                        <div style={{ color: "#68646F", fontSize: "0.85rem" }}>{formatDate(r.created_at)}</div>
                        <div style={styles.reqRight}>
                          <select
                            value={r.status}
                            onChange={(e) => handleStatusChange(r.id, e.target.value)}
                            style={styles.statusSelect}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="toggle-thread-btn"
                            style={styles.toggleBtn}
                            onClick={() => setOpenId(isOpen ? null : r.id)}
                          >
                            {isOpen ? "Masquer" : "Suivi & messages"}
                          </button>
                        </div>
                      </div>
                      {isOpen && <ServiceRequestThread requestId={r.id} isAdmin />}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {active !== "overview" && active !== "services" && (
          <div style={styles.placeholder}>
            Contenu de « {NAV_ITEMS.find((i) => i.key === active)?.label} » à venir.
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", background: "#FFFFFF", color: "#1B1A1F", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300 },
  sidebar: { width: 260, flexShrink: 0, borderRight: "1px solid #E3DFEA", display: "flex", flexDirection: "column", padding: "28px 20px", gap: 30 },
  brand: { display: "flex", alignItems: "center", gap: 11, fontFamily: "'Readex Pro', sans-serif", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "0.06em", color: "#1B1A1F", padding: "0 10px" },
  brandImg: { width: 28, height: 28, borderRadius: 7, display: "block" },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: { textAlign: "left", background: "none", border: "none", padding: "12px 10px", borderRadius: 4, fontFamily: "'IBM Plex Sans'", fontSize: "0.92rem", color: "#68646F", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" },
  navItemActive: { background: "#F6F4FA", color: "#993EAF", fontWeight: 500 },
  navBadge: { background: "#993EAF", color: "#fff", fontSize: "0.7rem", fontWeight: 600, borderRadius: 999, padding: "2px 8px" },
  sidebarFooter: { borderTop: "1px solid #E3DFEA", paddingTop: 18, display: "flex", flexDirection: "column", gap: 10 },
  sidebarUser: { fontSize: "0.8rem", color: "#68646F", padding: "0 10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  logoutBtn: { background: "none", border: "1px solid #E3DFEA", borderRadius: 4, padding: "10px 10px", fontSize: "0.85rem", color: "#1B1A1F", cursor: "pointer" },
  main: { flex: 1, padding: "44px 48px" },
  mainHeader: { marginBottom: 36 },
  eyebrow: { color: "#993EAF", fontSize: "0.78rem", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Readex Pro', sans-serif" },
  title: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.8rem", fontWeight: 600, letterSpacing: "-0.005em" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: "#E3DFEA", border: "1px solid #E3DFEA" },
  statCard: { background: "#FFFFFF", padding: "26px 24px" },
  statValue: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.8rem", fontWeight: 600, color: "#993EAF" },
  statLabel: { color: "#68646F", fontSize: "0.85rem", marginTop: 6 },
  placeholder: { color: "#68646F", fontSize: "0.95rem", border: "1px dashed #E3DFEA", borderRadius: 4, padding: "40px", textAlign: "center" },
  errorBox: { color: "#B3261E", background: "#FCECEA", padding: "12px 16px", borderRadius: 4, fontSize: "0.88rem", marginBottom: 24 },
  reqList: { display: "flex", flexDirection: "column", gap: 12 },
  reqCardWrap: { border: "1px solid #E3DFEA", borderRadius: 8, overflow: "hidden" },
  reqCard: { display: "grid", gridTemplateColumns: "1.3fr 1.2fr 1fr auto", gap: 16, alignItems: "center", padding: "16px 20px", fontSize: "0.9rem" },
  reqService: { fontSize: "0.88rem" },
  reqRight: { display: "flex", alignItems: "center", gap: 10, justifySelf: "end" },
  toggleBtn: { fontSize: "0.8rem", color: "#993EAF", border: "1px solid #993EAF", borderRadius: 6, padding: "8px 14px", background: "transparent", cursor: "pointer", whiteSpace: "nowrap" },
  statusSelect: { padding: "8px 12px", borderRadius: 4, border: "1px solid #E3DFEA", background: "#F6F4FA", fontFamily: "'IBM Plex Sans'", fontSize: "0.85rem", color: "#1B1A1F" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
  .sidebar-link:hover { background: #F6F4FA; }
  .sidebar-logout:hover { border-color: #993EAF; color: #993EAF; }
  .toggle-thread-btn:hover { background: #993EAF; color: #fff; }
  @media (max-width: 900px) {
    .req-card { grid-template-columns: 1fr !important; justify-items: start !important; }
  }
`;
