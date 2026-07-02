import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const LOGO_SRC = "/logo.png";

const SERVICES = [
  {
    idx: "01",
    title: "Sites & applications",
    desc: "Conception et programmation de sites web et d'applications mobiles, selon les standards internationaux les plus récents.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="4" width="20" height="16" rx="1" />
        <line x1="2" y1="9" x2="22" y2="9" />
        <circle cx="5.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="8" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
        <path d="M8 14l3 2-3 2M13 18h3" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    idx: "02",
    title: "Centres d'appels",
    desc: "Création et exploitation de centres d'appels, systèmes téléphoniques et gestion de la relation client.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 5a2 2 0 0 1 2-2h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5z" />
      </svg>
    ),
  },
  {
    idx: "03",
    title: "Réseaux & infrastructure",
    desc: "Conception, installation et gestion de réseaux informatiques et d'infrastructures IT fiables et performantes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="5" cy="6" r="2.2" />
        <circle cx="19" cy="6" r="2.2" />
        <circle cx="12" cy="18" r="2.2" />
        <path d="M6.8 7.3 10.5 16M17.2 7.3 13.5 16M7.2 6h9.6" />
      </svg>
    ),
  },
  {
    idx: "04",
    title: "Intelligence artificielle",
    desc: "Développement et déploiement de solutions d'IA pour automatiser les processus et éclairer la prise de décision.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        <circle cx="12" cy="12" r="4.5" />
      </svg>
    ),
  },
  {
    idx: "05",
    title: "Administration de serveurs",
    desc: "Configuration, administration et maintenance des serveurs et des systèmes back-end, avec continuité d'exploitation.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="4" y="3" width="16" height="6" rx="1" />
        <rect x="4" y="10" width="16" height="6" rx="1" />
        <rect x="4" y="17" width="16" height="4" rx="1" />
        <circle cx="7.3" cy="6" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="7.3" cy="13" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    idx: "06",
    title: "Cybersécurité",
    desc: "Protection de l'information, tests d'intrusion et sécurisation des systèmes contre les menaces cybernétiques.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const APPROACH = [
  { tag: "ÉCOUTE", title: "Comprendre le besoin réel", desc: "Chaque mission démarre par un diagnostic des objectifs métier avant toute décision technique." },
  { tag: "CONCEPTION", title: "Une architecture sur-mesure", desc: "Nous choisissons les technologies adaptées au contexte — pas les plus à la mode, les plus pertinentes." },
  { tag: "LIVRAISON", title: "Mise en production maîtrisée", desc: "Déploiement, documentation et formation des équipes pour une autonomie durable." },
  { tag: "SUIVI", title: "Maintenance & sécurité continues", desc: "Surveillance, mises à jour et audits réguliers pour garder vos systèmes fiables dans le temps." },
];

export default function NoorSite() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={styles.body}>
      <style>{css}</style>
      <div style={styles.gridBg} />

      <header style={{ ...styles.header, ...(scrolled ? styles.headerScrolled : {}) }}>
        <div style={styles.logo}>
          <img src={LOGO_SRC} alt="NOOR" style={styles.logoImg} />
          NOOR
        </div>
        <nav style={styles.navLinks} className="nav-links-desktop">
          <a href="#apropos" className="nav-link">À propos</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#approche" className="nav-link">Approche</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
        <a href="tel:+22227420048" className="nav-phone">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          27 42 00 48
        </a>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <svg className="hero-symbol" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={styles.heroSymbol}>
          <rect x="60" y="60" width="90" height="280" rx="26" fill="#E7E4ED" />
          <rect x="250" y="60" width="90" height="280" rx="26" fill="#E7E4ED" />
          <polygon points="150,60 340,340 250,340 60,60" fill="#993EAF" opacity="0.9" />
        </svg>

        <div className="fade-in" style={{ ...styles.eyebrow, animationDelay: "0.2s" }}>
          <span style={styles.eyebrowLine} />
          Nouakchott · Mauritanie · SARL
        </div>
        <h1 className="fade-in" style={{ ...styles.heroTitle, animationDelay: "0.4s" }}>
          La lumière derrière votre <em style={{ fontStyle: "normal", color: "#993EAF" }}>transformation numérique</em>
        </h1>
        <p className="fade-in" style={{ ...styles.heroSlogan, animationDelay: "0.55s" }}>illuminate your digital transformation</p>
        <p className="fade-in" style={{ ...styles.heroSub, animationDelay: "0.7s" }}>
          NOOR conçoit et exploite des solutions technologiques sur-mesure — sites et applications, centres d'appels, réseaux, intelligence artificielle et cybersécurité — pour les entreprises mauritaniennes.
        </p>
        <div className="fade-in" style={{ ...styles.heroCta, animationDelay: "0.85s" }}>
          <a href="#contact" className="btn btn-primary">Démarrer un projet</a>
          <a href="#services" className="btn btn-ghost">Voir nos services</a>
        </div>
        <div style={styles.scrollCue}>
          <div style={styles.scrollLine} />
          DÉFILER
        </div>
      </section>

      <section id="apropos" style={styles.sectionBordered}>
        <div style={styles.aboutWrap} className="about-wrap">
          <div>
            <div style={styles.sectionEyebrow}>Qui sommes-nous</div>
            <h2 style={styles.sectionTitle}>Une société mauritanienne, fondée sur l'exigence technique</h2>
            <p style={styles.sectionDesc}>
              NOOR-SARL est une société de services numériques basée à Nouakchott. Notre nom signifie « lumière » — celle que nous apportons aux entreprises en clarifiant leurs systèmes, en sécurisant leurs données et en automatisant leurs processus grâce aux technologies les plus récentes.
            </p>
            <div style={styles.aboutFacts} className="about-facts">
              {[["2026", "Année de création"], ["6", "Domaines d'expertise"], ["3", "Associés fondateurs"], ["NKC", "Siège à Nouakchott"]].map(([num, label]) => (
                <div key={label} style={styles.fact}>
                  <div style={styles.factNum}>{num}</div>
                  <div style={styles.factLabel}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.aboutVisual}>
            <svg viewBox="0 0 400 400" width="86%" height="86%">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#993EAF" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#993EAF" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g stroke="#8B8792" strokeWidth="0.6" opacity="0.3">
                <line x1="200" y1="200" x2="200" y2="10" />
                <line x1="200" y1="200" x2="200" y2="390" />
                <line x1="200" y1="200" x2="10" y2="200" />
                <line x1="200" y1="200" x2="390" y2="200" />
                <line x1="200" y1="200" x2="60" y2="60" />
                <line x1="200" y1="200" x2="340" y2="60" />
                <line x1="200" y1="200" x2="60" y2="340" />
                <line x1="200" y1="200" x2="340" y2="340" />
              </g>
              <circle cx="200" cy="200" r="150" fill="none" stroke="#E3DFEA" strokeWidth="1" />
              <circle cx="200" cy="200" r="100" fill="none" stroke="#E3DFEA" strokeWidth="1" />
              <circle cx="200" cy="200" r="55" fill="url(#glow)" />
            </svg>
          </div>
        </div>
      </section>

      <section id="services" style={styles.servicesSection}>
        <div style={styles.sectionHead}>
          <div style={styles.sectionEyebrow}>Nos domaines</div>
          <h2 style={styles.sectionTitle}>Six expertises, une seule direction</h2>
          <p style={styles.sectionDesc}>De la conception logicielle à la sécurité des données, nous couvrons l'ensemble de la chaîne technologique dont une entreprise moderne a besoin.</p>
        </div>
        <div style={styles.servicesGrid} className="services-grid">
          {SERVICES.map((s) => (
            <div key={s.idx} className="service-card" style={styles.serviceCard}>
              <span style={styles.serviceIdx}>{s.idx}</span>
              <div style={styles.serviceIcon}>{s.icon}</div>
              <h3 style={styles.serviceTitle}>{s.title}</h3>
              <p style={styles.serviceDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="approche" style={styles.sectionBordered}>
        <div style={styles.sectionHead}>
          <div style={styles.sectionEyebrow}>Méthode</div>
          <h2 style={styles.sectionTitle}>Comment nous travaillons</h2>
        </div>
        <div>
          {APPROACH.map((a, i) => (
            <div
              key={a.tag}
              style={{ ...styles.approcheItem, borderBottom: i === APPROACH.length - 1 ? "1px solid #E3DFEA" : "none" }}
              className="approche-item"
            >
              <div style={styles.approcheTag}>{a.tag}</div>
              <div>
                <h4 style={styles.approcheTitle}>{a.title}</h4>
                <p style={styles.approcheDesc}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" style={styles.sectionBordered}>
        <div style={styles.contactWrap} className="contact-wrap">
          <div>
            <div style={styles.sectionEyebrow}>Contact</div>
            <h2 style={styles.sectionTitle}>Parlons de votre projet</h2>
            <p style={{ ...styles.sectionDesc, marginBottom: 44 }}>Une idée, un besoin technique ou un projet déjà en cours — notre équipe vous répond rapidement.</p>
            <div style={styles.contactInfo}>
              <div style={styles.contactRow}>
                <svg style={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <div><div style={styles.lbl}>Téléphone</div><div style={styles.val}>27 42 00 48</div></div>
              </div>
              <div style={styles.contactRow}>
                <svg style={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div><div style={styles.lbl}>Adresse</div><div style={styles.val}>Nouakchott, Mauritanie</div></div>
              </div>
              <div style={styles.contactRow}>
                <svg style={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                <div><div style={styles.lbl}>Statut</div><div style={styles.val}>NOOR — SARL, Nouakchott</div></div>
              </div>
            </div>
          </div>
          <form
            style={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div style={styles.field}>
              <label htmlFor="nom" style={styles.fieldLabel}>Nom</label>
              <input id="nom" type="text" required placeholder="Votre nom" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label htmlFor="mail" style={styles.fieldLabel}>E-mail</label>
              <input id="mail" type="email" required placeholder="vous@exemple.com" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label htmlFor="msg" style={styles.fieldLabel}>Message</label>
              <textarea id="msg" required placeholder="Décrivez votre projet..." style={{ ...styles.input, minHeight: 100, resize: "vertical" }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: "center" }}>Envoyer le message</button>
            {sent && (
              <p style={{ color: "#8B8792", fontSize: "0.88rem" }}>
                Merci — votre message a bien été préparé. Branchez ce formulaire à votre messagerie ou CRM pour le rendre fonctionnel.
              </p>
            )}
          </form>
        </div>
      </section>

      <footer style={styles.footer}>
        <div>
          <div style={styles.footMark}>
            <img src={LOGO_SRC} alt="NOOR" style={styles.footLogoImg} />
            NOOR
          </div>
          <div style={styles.footSlogan}>illuminate your digital transformation</div>
        </div>
        <div>© 2026 NOOR-SARL — Nouakchott, Mauritanie. Tous droits réservés.</div>
        <div style={styles.footAuth}>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="footer-link">Dashboard admin</Link>
              )}
              <button className="footer-link-btn" onClick={logout}>Déconnexion ({user.email})</button>
            </>
          ) : (
            <Link to="/login" className="footer-link">Connexion / Espace client</Link>
          )}
        </div>
      </footer>
    </div>
  );
}

const styles = {
  body: { position: "relative", background: "#FFFFFF", color: "#1B1A1F", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, lineHeight: 1.6, overflowX: "hidden" },
  gridBg: {
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: "linear-gradient(to right, rgba(19,15,26,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(19,15,26,0.035) 1px, transparent 1px)",
    backgroundSize: "64px 64px",
    maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
    WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
  },
  header: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 6vw", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(10px)", borderBottom: "1px solid transparent", transition: "border-color .3s, background .3s" },
  headerScrolled: { borderBottomColor: "#E3DFEA", background: "rgba(255,255,255,0.92)" },
  logo: { display: "flex", alignItems: "center", gap: 11, fontFamily: "'Readex Pro', sans-serif", fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.06em" },
  logoImg: { width: 32, height: 32, borderRadius: 8, display: "block" },
  navLinks: { display: "flex", gap: 38, fontSize: "0.92rem", color: "#68646F" },
  hero: { position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "110px 6vw 0", zIndex: 1 },
  heroGlow: { position: "absolute", top: "6%", right: "4%", width: 480, height: 480, background: "radial-gradient(circle, rgba(153,62,175,0.28), transparent 70%)", pointerEvents: "none", zIndex: -1 },
  heroSymbol: { position: "absolute", right: "2vw", top: "50%", transform: "translateY(-50%)", width: "min(46vw,560px)", height: "min(46vw,560px)", opacity: 0.9, pointerEvents: "none" },
  eyebrow: { color: "#993EAF", fontSize: "0.82rem", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 22, display: "flex", alignItems: "center", gap: 12, fontFamily: "'Readex Pro', sans-serif" },
  eyebrowLine: { width: 34, height: 1, background: "#993EAF" },
  heroTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "clamp(2.6rem,6vw,5rem)", fontWeight: 600, letterSpacing: "-0.01em", maxWidth: "14ch", lineHeight: 1.08, textTransform: "uppercase", paddingBottom: 24 },
  heroSlogan: { marginTop: 24, fontFamily: "'Readex Pro', sans-serif", fontWeight: 160, fontSize: "1.3rem", letterSpacing: "0.02em", color: "#8B8792", textTransform: "lowercase" },
  heroSub: { marginTop: 20, maxWidth: "46ch", color: "#68646F", fontSize: "1.02rem", fontWeight: 300 },
  heroCta: { marginTop: 40, display: "flex", gap: 18, flexWrap: "wrap" },
  scrollCue: { position: "absolute", bottom: 38, left: "6vw", fontSize: "0.75rem", color: "#68646F", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: 10 },
  scrollLine: { width: 1, height: 34, background: "linear-gradient(to bottom, #993EAF, transparent)" },
  sectionBordered: { position: "relative", zIndex: 1, padding: "130px 6vw", borderTop: "1px solid #E3DFEA" },
  servicesSection: { position: "relative", zIndex: 1, padding: "130px 6vw", borderTop: "1px solid #E3DFEA", background: "linear-gradient(180deg, transparent, rgba(153,62,175,0.025), transparent)" },
  sectionHead: { maxWidth: 640, marginBottom: 64 },
  sectionEyebrow: { color: "#993EAF", fontSize: "0.78rem", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Readex Pro', sans-serif" },
  sectionTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "clamp(1.7rem,3.2vw,2.4rem)", fontWeight: 600, letterSpacing: "-0.005em" },
  sectionDesc: { color: "#68646F", marginTop: 18, fontSize: "1.02rem", maxWidth: "56ch" },
  aboutWrap: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" },
  aboutVisual: { position: "relative", aspectRatio: "1/1", border: "1px solid #E3DFEA", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", background: "#F6F4FA", overflow: "hidden" },
  aboutFacts: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#E3DFEA", border: "1px solid #E3DFEA", marginTop: 40 },
  fact: { background: "#FFFFFF", padding: 22 },
  factNum: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.5rem", color: "#993EAF", fontWeight: 600 },
  factLabel: { color: "#68646F", fontSize: "0.8rem", marginTop: 6 },
  servicesGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E3DFEA", border: "1px solid #E3DFEA" },
  serviceCard: { background: "#FFFFFF", padding: "42px 32px", position: "relative", overflow: "hidden" },
  serviceIdx: { position: "absolute", top: 24, right: 28, fontFamily: "'Readex Pro', sans-serif", fontSize: "0.75rem", color: "#E3DFEA" },
  serviceIcon: { width: 44, height: 44, marginBottom: 26, color: "#993EAF" },
  serviceTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.06rem", fontWeight: 600, marginBottom: 12 },
  serviceDesc: { color: "#68646F", fontSize: "0.92rem" },
  approcheItem: { display: "grid", gridTemplateColumns: "100px 1fr", gap: 32, padding: "30px 0", borderTop: "1px solid #E3DFEA", alignItems: "baseline" },
  approcheTag: { color: "#993EAF", fontFamily: "'Readex Pro', sans-serif", fontSize: "0.85rem", letterSpacing: "0.08em" },
  approcheTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.1rem", fontWeight: 500, marginBottom: 8 },
  approcheDesc: { color: "#68646F", fontSize: "0.94rem", maxWidth: "60ch" },
  contactWrap: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 },
  contactInfo: { display: "flex", flexDirection: "column", gap: 28 },
  contactRow: { display: "flex", gap: 18, alignItems: "flex-start" },
  ic: { width: 20, height: 20, color: "#993EAF", flexShrink: 0, marginTop: 3 },
  lbl: { color: "#68646F", fontSize: "0.76rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 },
  val: { fontSize: "1.03rem" },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  fieldLabel: { fontSize: "0.76rem", color: "#68646F", letterSpacing: "0.08em", textTransform: "uppercase" },
  input: { background: "#F6F4FA", border: "1px solid #E3DFEA", color: "#1B1A1F", padding: "14px 16px", fontFamily: "'IBM Plex Sans'", fontSize: "0.95rem", borderRadius: 2, outline: "none" },
  footer: { borderTop: "1px solid #E3DFEA", padding: "44px 6vw", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 18, color: "#68646F", fontSize: "0.85rem", position: "relative", zIndex: 1 },
  footMark: { display: "flex", alignItems: "center", gap: 9, fontFamily: "'Readex Pro', sans-serif", fontWeight: 600, color: "#1B1A1F", fontSize: "1rem" },
  footLogoImg: { width: 22, height: 22, borderRadius: 6, display: "block" },
  footSlogan: { fontFamily: "'Readex Pro', sans-serif", fontWeight: 160, color: "#8B8792", letterSpacing: "0.02em", marginTop: 4 },
  footAuth: { display: "flex", alignItems: "center", gap: 18 },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@160;300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  ::selection { background: #993EAF; color: #fff; }
  a { color: inherit; text-decoration: none; }

  .footer-link, .footer-link-btn { font: inherit; color: #68646F; background: none; border: none; cursor: pointer; padding: 0; transition: color .25s; }
  .footer-link:hover, .footer-link-btn:hover { color: #993EAF; }

  .fade-in { opacity: 0; animation: fadeUp 0.9s ease forwards; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .nav-link { position: relative; padding-bottom: 4px; transition: color .25s; color: #68646F; }
  .nav-link:hover { color: #1B1A1F; }
  .nav-link::after { content: ''; position: absolute; left: 0; bottom: 0; width: 0; height: 1px; background: #993EAF; transition: width .3s; }
  .nav-link:hover::after { width: 100%; }

  .nav-phone { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; border: 1px solid #E3DFEA; padding: 9px 18px; border-radius: 2px; transition: border-color .3s, background .3s; }
  .nav-phone:hover { border-color: #993EAF; background: rgba(153,62,175,0.12); }

  .btn { font-family: 'Readex Pro'; font-size: 0.9rem; font-weight: 500; padding: 15px 30px; border-radius: 2px; display: inline-flex; align-items: center; gap: 10px; transition: transform .25s, box-shadow .25s, background .25s, border-color .25s; cursor: pointer; border: none; }
  .btn-primary { background: #993EAF; color: #fff; border: 1px solid #993EAF; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px -10px rgba(153,62,175,0.28); background: #5C2569; border-color: #5C2569; }
  .btn-ghost { border: 1px solid #E3DFEA; color: #1B1A1F; }
  .btn-ghost:hover { border-color: #8B8792; color: #8B8792; transform: translateY(-2px); }

  .service-card { transition: background .3s; }
  .service-card:hover { background: #F6F4FA !important; }

  @media (max-width: 860px) {
    .nav-links-desktop { display: none !important; }
    .about-wrap, .contact-wrap { grid-template-columns: 1fr !important; gap: 50px !important; }
    .services-grid { grid-template-columns: 1fr !important; }
    .hero-symbol { width: 70vw !important; height: 70vw !important; opacity: 0.5 !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
`;
