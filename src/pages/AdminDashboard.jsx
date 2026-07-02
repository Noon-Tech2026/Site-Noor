import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const LOGO_SRC = "/logo.png";

const NAV_ITEMS = [
  { key: "overview", label: "Tableau de bord" },
  { key: "clients", label: "Clients" },
  { key: "messages", label: "Messages" },
  { key: "services", label: "Services" },
  { key: "settings", label: "Paramètres" },
];

const STATS = [
  { label: "Clients actifs", value: "—" },
  { label: "Projets en cours", value: "—" },
  { label: "Messages non lus", value: "—" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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

        {active !== "overview" && (
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
  navItem: { textAlign: "left", background: "none", border: "none", padding: "12px 10px", borderRadius: 4, fontFamily: "'IBM Plex Sans'", fontSize: "0.92rem", color: "#68646F", cursor: "pointer" },
  navItemActive: { background: "#F6F4FA", color: "#993EAF", fontWeight: 500 },
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
};

const css = `
  .sidebar-link:hover { background: #F6F4FA; }
  .sidebar-logout:hover { border-color: #993EAF; color: #993EAF; }
`;
