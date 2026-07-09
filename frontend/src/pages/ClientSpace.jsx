import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { api } from "../api/client.js";
import ServiceRequestThread from "../components/ServiceRequestThread.jsx";

const LOGO_SRC = "/logo.png";

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

const STEP_ORDER = ["nouvelle", "en_contact", "en_cours", "terminee"];
const STEP_LABELS = ["Nouvelle demande", "En contact", "En cours de réalisation", "Terminée"];

function formatDate(value) {
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function IconChevron(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconSpark(p) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" {...p}>
      <path d="M12 2c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" />
    </svg>
  );
}

function StatusTrack({ status }) {
  if (status === "annulee") {
    return <div style={styles.cancelledBadge}>Demande annulée</div>;
  }
  const idx = STEP_ORDER.indexOf(status);
  return (
    <div style={styles.track}>
      <div style={styles.trackBar}>
        {STEP_ORDER.map((s, i) => (
          <span key={s} style={{ ...styles.trackSeg, background: i <= idx ? "#993EAF" : "#E3DFEA" }} />
        ))}
      </div>
      <div style={styles.trackLabel}>{STEP_LABELS[idx] ?? STEP_LABELS[0]}</div>
    </div>
  );
}

export default function ClientSpace() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState(false);
  const [openId, setOpenId] = useState(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { requests } = await api.myServiceRequests();
      setRequests(requests);
    } catch (e) {
      setError(e.message || "Erreur lors du chargement de vos demandes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("requested") === "1") {
      setBanner(true);
      navigate("/espace", { replace: true });
    }
  }, [location.search, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const activeCount = requests.filter((r) => r.status !== "terminee" && r.status !== "annulee").length;
  const doneCount = requests.filter((r) => r.status === "terminee").length;
  const firstName = (user?.full_name || "").split(" ")[0];

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <div style={styles.gridBg} />
      <div style={styles.glow} />

      <header style={styles.header}>
        <Link to="/" style={styles.brand}>
          <img src={LOGO_SRC} alt="NOOR" style={styles.brandImg} />
          NOOR
        </Link>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{user?.email}</span>
          <button className="logout-btn" style={styles.logoutBtn} onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      <main style={styles.main}>
        <div className="fade-in" style={{ animationDelay: "0.05s" }}>
          <div style={styles.eyebrow}><IconSpark style={styles.eyebrowIcon} /> Espace client</div>
          <h1 style={styles.title}>{firstName ? `Bonjour, ${firstName}` : "Mon espace"}</h1>
          <p style={styles.sub}>Suivez ici l'état d'avancement de vos demandes, échangez avec notre équipe et envoyez vos documents.</p>
        </div>

        {!loading && requests.length > 0 && (
          <div className="fade-in stats-row" style={{ ...styles.statsRow, animationDelay: "0.15s" }}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{requests.length}</div>
              <div style={styles.statLabel}>Demande{requests.length > 1 ? "s" : ""} au total</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{activeCount}</div>
              <div style={styles.statLabel}>En cours de suivi</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{doneCount}</div>
              <div style={styles.statLabel}>Terminée{doneCount > 1 ? "s" : ""}</div>
            </div>
          </div>
        )}

        {banner && (
          <div className="fade-in" style={styles.successBanner}>
            <span>✓ Merci — votre demande a bien été transmise. Notre équipe vous contactera très prochainement.</span>
            <button type="button" style={styles.bannerClose} onClick={() => setBanner(false)} aria-label="Fermer">✕</button>
          </div>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        <section style={styles.section} className="fade-in" >
          <div style={styles.sectionHead}>
            <h2 style={styles.sectionTitle}>Mes demandes de services</h2>
            <Link to="/#services" className="new-request-link" style={styles.newRequestLink}>+ Demander un autre service</Link>
          </div>

          {loading ? (
            <div style={styles.placeholder}>Chargement…</div>
          ) : requests.length === 0 ? (
            <div style={styles.placeholder}>
              <div style={styles.emptyIcon}><IconSpark /></div>
              Vous n'avez encore demandé aucun service.
              <br />
              <Link to="/#services" className="cta-link" style={styles.ctaLink}>Découvrir nos services →</Link>
            </div>
          ) : (
            <div style={styles.list}>
              {requests.map((r) => {
                const isOpen = openId === r.id;
                return (
                  <div key={r.id} className="req-card-wrap" style={styles.cardWrap}>
                    <div style={styles.card}>
                      <div style={styles.cardIcon}><IconSpark /></div>
                      <div style={styles.cardMain}>
                        <div style={styles.cardTitle}>{SERVICE_LABELS[r.service_key] || r.service_key}</div>
                        <div style={styles.cardDate}>Demandé le {formatDate(r.created_at)}</div>
                        <StatusTrack status={r.status} />
                      </div>
                      <button
                        type="button"
                        className="toggle-thread-btn"
                        style={styles.toggleBtn}
                        onClick={() => setOpenId(isOpen ? null : r.id)}
                      >
                        {isOpen ? "Masquer" : "Suivi & messages"}
                        <IconChevron style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                      </button>
                    </div>
                    {isOpen && <ServiceRequestThread requestId={r.id} isAdmin={false} />}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: { position: "relative", minHeight: "100vh", background: "#FFFFFF", color: "#1B1A1F", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, overflowX: "hidden" },
  gridBg: {
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: "linear-gradient(to right, rgba(19,15,26,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(19,15,26,0.035) 1px, transparent 1px)",
    backgroundSize: "64px 64px",
    maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
    WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
  },
  glow: { position: "fixed", top: "-10%", left: "50%", transform: "translateX(-50%)", width: 640, height: 640, background: "radial-gradient(circle, rgba(153,62,175,0.12), transparent 70%)", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 6vw", borderBottom: "1px solid #E3DFEA", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)" },
  brand: { display: "flex", alignItems: "center", gap: 10, fontFamily: "'Readex Pro', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.06em", color: "#1B1A1F" },
  brandImg: { width: 30, height: 30, borderRadius: 8, display: "block" },
  headerRight: { display: "flex", alignItems: "center", gap: 16 },
  userEmail: { fontSize: "0.85rem", color: "#68646F" },
  logoutBtn: { background: "none", border: "1px solid #E3DFEA", borderRadius: 999, padding: "9px 16px", fontSize: "0.84rem", color: "#1B1A1F", cursor: "pointer", transition: "border-color .2s, color .2s" },
  main: { position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "64px 6vw 100px" },
  eyebrow: { display: "inline-flex", alignItems: "center", gap: 8, color: "#993EAF", fontSize: "0.78rem", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Readex Pro', sans-serif" },
  eyebrowIcon: { color: "#993EAF" },
  title: { fontFamily: "'Readex Pro', sans-serif", fontSize: "clamp(1.9rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.01em" },
  sub: { color: "#68646F", marginTop: 14, fontSize: "1.02rem", maxWidth: "56ch", lineHeight: 1.6 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 40 },
  statCard: { background: "#F6F4FA", border: "1px solid #E3DFEA", borderRadius: 14, padding: "20px 22px" },
  statValue: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.7rem", fontWeight: 700, color: "#993EAF" },
  statLabel: { color: "#68646F", fontSize: "0.82rem", marginTop: 4 },
  successBanner: { marginTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "rgba(34,197,94,0.12)", color: "#15803D", padding: "16px 22px", borderRadius: 14, fontSize: "0.9rem" },
  bannerClose: { background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "0.9rem", flexShrink: 0 },
  errorBox: { marginTop: 28, color: "#B3261E", background: "#FCECEA", padding: "12px 16px", borderRadius: 8, fontSize: "0.88rem" },
  section: { marginTop: 52 },
  sectionHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  sectionTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.25rem", fontWeight: 600 },
  newRequestLink: { fontSize: "0.86rem", color: "#993EAF", fontWeight: 500 },
  placeholder: { color: "#68646F", fontSize: "0.95rem", border: "1px dashed #E3DFEA", borderRadius: 14, padding: "56px 40px", textAlign: "center", lineHeight: 1.9, background: "#F6F4FA" },
  emptyIcon: { width: 44, height: 44, margin: "0 auto 16px", borderRadius: "50%", background: "rgba(153,62,175,0.12)", color: "#993EAF", display: "flex", alignItems: "center", justifyContent: "center" },
  ctaLink: { color: "#993EAF", fontWeight: 500 },
  list: { display: "flex", flexDirection: "column", gap: 16 },
  cardWrap: { border: "1px solid #E3DFEA", borderRadius: 16, overflow: "hidden", background: "#FFFFFF" },
  card: { display: "flex", alignItems: "center", gap: 20, padding: "22px 24px", flexWrap: "wrap" },
  cardIcon: { width: 46, height: 46, flexShrink: 0, borderRadius: 14, background: "rgba(153,62,175,0.12)", color: "#993EAF", display: "flex", alignItems: "center", justifyContent: "center" },
  cardMain: { flex: 1, minWidth: 220 },
  cardTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.05rem", fontWeight: 600 },
  cardDate: { color: "#68646F", fontSize: "0.8rem", marginTop: 3, marginBottom: 14 },
  toggleBtn: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.82rem", fontFamily: "'Readex Pro', sans-serif", fontWeight: 500, color: "#993EAF", border: "1px solid #993EAF", borderRadius: 999, padding: "10px 18px", background: "transparent", cursor: "pointer", whiteSpace: "nowrap", transition: "background .2s, color .2s" },
  track: { marginTop: 4 },
  trackBar: { display: "flex", gap: 4, marginBottom: 8 },
  trackSeg: { flex: 1, height: 5, borderRadius: 999, transition: "background .3s" },
  trackLabel: { fontSize: "0.78rem", color: "#993EAF", fontWeight: 500 },
  cancelledBadge: { display: "inline-block", marginTop: 6, fontSize: "0.78rem", color: "#68646F", background: "#F0EDF5", padding: "5px 12px", borderRadius: 999 },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
  .logout-btn:hover { border-color: #993EAF; color: #993EAF; }
  .new-request-link:hover, .cta-link:hover { text-decoration: underline; }
  .toggle-thread-btn:hover { background: #993EAF; color: #fff; }
  .req-card-wrap { transition: box-shadow .25s, transform .25s; }
  .req-card-wrap:hover { box-shadow: 0 14px 34px -16px rgba(153,62,175,0.28); transform: translateY(-2px); }

  .fade-in { opacity: 0; animation: fadeUp 0.7s ease forwards; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 640px) {
    .stats-row { grid-template-columns: 1fr !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;
