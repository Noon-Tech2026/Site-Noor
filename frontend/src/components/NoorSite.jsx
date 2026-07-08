import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const LOGO_SRC = "/logo.png";
const WHATSAPP_URL = "https://wa.me/22227420048";

const IconHome = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 9.5V20h14V9.5" />
  </svg>
);
const IconServices = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const IconProjects = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);
const IconApproach = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m14.5 9.5-2 5-5 2 2-5z" />
  </svg>
);
const IconContact = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const IconWhatsApp = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    <path d="M16.9 14.3c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.4-1.8-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.6.6-.9 1.3-.9 2.1.1.9.4 1.8 1 2.6 1.1 1.6 2.4 2.9 4 3.7.5.3.9.4 1.3.6.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3z" />
  </svg>
);
const IconMail = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="15" height="15" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const IconMoon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" {...p}>
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
  </svg>
);
const IconSun = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14" {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2v2.2M12 19.8V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.2M19.8 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
  </svg>
);

const SERVICE_ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="4" width="20" height="16" rx="1" /><line x1="2" y1="9" x2="22" y2="9" /><circle cx="5.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" /><circle cx="8" cy="6.5" r="0.6" fill="currentColor" stroke="none" /><path d="M8 14l3 2-3 2M13 18h3" strokeWidth="1.3" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 5a2 2 0 0 1 2-2h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5z" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="5" cy="6" r="2.2" /><circle cx="19" cy="6" r="2.2" /><circle cx="12" cy="18" r="2.2" /><path d="M6.8 7.3 10.5 16M17.2 7.3 13.5 16M7.2 6h9.6" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /><circle cx="12" cy="12" r="4.5" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="4" y="3" width="16" height="6" rx="1" /><rect x="4" y="10" width="16" height="6" rx="1" /><rect x="4" y="17" width="16" height="4" rx="1" /><circle cx="7.3" cy="6" r="0.6" fill="currentColor" stroke="none" /><circle cx="7.3" cy="13" r="0.6" fill="currentColor" stroke="none" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path d="M7 9h10M7 12.5h6" strokeWidth="1.3" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 12 3.5 6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.2" /><circle cx="6" cy="19" r="0.6" fill="currentColor" stroke="none" /><circle cx="9.5" cy="20.2" r="0.6" fill="currentColor" stroke="none" /><circle cx="15" cy="19.6" r="0.6" fill="currentColor" stroke="none" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="5" cy="18" r="2" /><circle cx="19" cy="6" r="2" /><path d="M6.8 16.5C10 12 9 8 13 6.5c2-.8 3.5.2 4.3 1.3" strokeDasharray="2.5 2.5" /></svg>,
];

const NAV_ITEMS = [
  { id: "home", key: "home", Icon: IconHome },
  { id: "services", key: "services", Icon: IconServices },
  { id: "projets", key: "projects", Icon: IconProjects },
  { id: "approche", key: "approach", Icon: IconApproach },
  { id: "contact", key: "contact", Icon: IconContact },
];

const SECTION_ORDER = ["home", "apropos", "services", "projets", "approche", "contact"];

const translations = {
  fr: {
    nav: { home: "Accueil", services: "Services", projects: "Projets", approach: "Approche", contact: "Contact" },
    hero: {
      badge: "Solutions numériques sur-mesure",
      titleLine1: "La lumière derrière votre",
      titleAccent: "transformation numérique",
      slogan: "illuminate your digital transformation",
      sub: "NOOR conçoit et exploite des solutions technologiques sur-mesure — sites et applications, centres d'appels, réseaux, intelligence artificielle et cybersécurité — pour les entreprises mauritaniennes.",
      cta1: "Démarrer un projet",
      cta2: "Voir nos services",
      scroll: "DÉFILER",
    },
    preview: {
      title: "Panneau client NOOR",
      live: "Aperçu en direct",
      stats: [["8", "Sites actifs"], ["3", "Factures en attente"], ["12", "Documents"]],
      listTitle: "Mes sites",
      rows: [
        { name: "noor.lu", status: "online", statusLbl: "En ligne", date: "Aujourd'hui" },
        { name: "client-alpha.mr", status: "maintenance", statusLbl: "Maintenance", date: "Hier" },
        { name: "client-beta.com", status: "online", statusLbl: "En ligne", date: "Il y a 3 jours" },
      ],
    },
    about: {
      eyebrow: "Qui sommes-nous",
      title: "Une société mauritanienne, fondée sur l'exigence technique",
      desc: "NOOR-SARL est une société de services numériques basée à Nouakchott. Notre nom signifie « lumière » — celle que nous apportons aux entreprises en clarifiant leurs systèmes, en sécurisant leurs données et en automatisant leurs processus grâce aux technologies les plus récentes.",
      facts: [["2026", "Année de création"], ["9", "Domaines d'expertise"], ["3", "Associés fondateurs"], ["NKC", "Siège à Nouakchott"]],
    },
    services: {
      eyebrow: "Nos domaines",
      title: "Neuf expertises, une seule direction",
      desc: "De la conception logicielle à la sécurité des données, nous couvrons l'ensemble de la chaîne technologique dont une entreprise moderne a besoin.",
      items: [
        { title: "Sites & applications", desc: "Conception et programmation de sites web et d'applications mobiles, selon les standards internationaux les plus récents." },
        { title: "Centres d'appels", desc: "Création et exploitation de centres d'appels, systèmes téléphoniques et gestion de la relation client." },
        { title: "Réseaux & infrastructure", desc: "Conception, installation et gestion de réseaux informatiques et d'infrastructures IT fiables et performantes." },
        { title: "Intelligence artificielle", desc: "Développement et déploiement de solutions d'IA pour automatiser les processus et éclairer la prise de décision." },
        { title: "Administration de serveurs", desc: "Configuration, administration et maintenance des serveurs et des systèmes back-end, avec continuité d'exploitation." },
        { title: "Cybersécurité", desc: "Protection de l'information, tests d'intrusion et sécurisation des systèmes contre les menaces cybernétiques." },
        { title: "API SMS", desc: "Envoi de SMS transactionnels et de campagnes en masse via une API simple, intégrable à vos applications et systèmes." },
        { title: "Adressage", desc: "Attribution d'adresses géographiques et cartographie précise — plus de 6000 points déjà répertoriés à Nouakchott et dans le reste de la Mauritanie." },
        { title: "6RIG", desc: "Suivi en temps réel du trajet entre un point de départ et une destination — géolocalisation précise pour le transport et la logistique." },
      ],
    },
    projects: {
      eyebrow: "Réalisations",
      title: "Des projets concrets, pensés pour nos clients",
      desc: "Un aperçu du type de plateformes que nous concevons et exploitons pour les entreprises mauritaniennes.",
      items: [
        { title: "Portail client SARL", desc: "Tableau de bord permettant à une PME de suivre ses sites, factures et documents en un seul endroit.", tags: ["Sites & apps", "Dashboard", "Sécurité"], preview: "bars" },
        { title: "Centre d'appels virtuel", desc: "Plateforme de gestion d'appels et de relation client avec suivi des agents en temps réel.", tags: ["Centres d'appels", "Téléphonie", "CRM"], preview: "rows" },
        { title: "Supervision réseau & IA", desc: "Console de supervision d'infrastructure combinant alertes réseau et détection d'anomalies par IA.", tags: ["Réseaux", "IA", "Cybersécurité"], preview: "stats" },
      ],
    },
    approach: {
      eyebrow: "Méthode",
      title: "Comment nous travaillons",
      items: [
        { tag: "ÉCOUTE", title: "Comprendre le besoin réel", desc: "Chaque mission démarre par un diagnostic des objectifs métier avant toute décision technique." },
        { tag: "CONCEPTION", title: "Une architecture sur-mesure", desc: "Nous choisissons les technologies adaptées au contexte — pas les plus à la mode, les plus pertinentes." },
        { tag: "LIVRAISON", title: "Mise en production maîtrisée", desc: "Déploiement, documentation et formation des équipes pour une autonomie durable." },
        { tag: "SUIVI", title: "Maintenance & sécurité continues", desc: "Surveillance, mises à jour et audits réguliers pour garder vos systèmes fiables dans le temps." },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Parlons de votre projet",
      desc: "Une idée, un besoin technique ou un projet déjà en cours — notre équipe vous répond rapidement.",
      phoneLbl: "Téléphone",
      addressLbl: "Adresse",
      addressVal: "Nouakchott, Mauritanie",
      statusLbl: "Statut",
      statusVal: "NOOR — SARL, Nouakchott",
      whatsappLbl: "WhatsApp",
      whatsappVal: "Discuter directement",
      nameLbl: "Nom",
      namePh: "Votre nom",
      mailLbl: "E-mail",
      mailPh: "vous@exemple.com",
      msgLbl: "Message",
      msgPh: "Décrivez votre projet...",
      submit: "Envoyer le message",
      sent: "Merci — votre message a bien été préparé. Branchez ce formulaire à votre messagerie ou CRM pour le rendre fonctionnel.",
    },
    footer: {
      desc: "NOOR conçoit et exploite des solutions numériques sur-mesure pour les entreprises mauritaniennes.",
      navigate: "Navigation",
      expertise: "Nos domaines",
      talk: "Nous contacter",
      copyright: "© 2026 NOOR-SARL — Nouakchott, Mauritanie. Tous droits réservés.",
      login: "Connexion / Espace client",
      dashboard: "Dashboard admin",
      logout: "Déconnexion",
    },
  },
  en: {
    nav: { home: "Home", services: "Services", projects: "Projects", approach: "Approach", contact: "Contact" },
    hero: {
      badge: "Custom digital solutions",
      titleLine1: "The light behind your",
      titleAccent: "digital transformation",
      slogan: "illuminate your digital transformation",
      sub: "NOOR designs and operates tailor-made technology solutions — websites and applications, call centers, networks, artificial intelligence and cybersecurity — for Mauritanian businesses.",
      cta1: "Start a project",
      cta2: "View our services",
      scroll: "SCROLL",
    },
    preview: {
      title: "NOOR client panel",
      live: "Live preview",
      stats: [["8", "Active sites"], ["3", "Pending invoices"], ["12", "Documents"]],
      listTitle: "My sites",
      rows: [
        { name: "noor.lu", status: "online", statusLbl: "Online", date: "Today" },
        { name: "client-alpha.mr", status: "maintenance", statusLbl: "Maintenance", date: "Yesterday" },
        { name: "client-beta.com", status: "online", statusLbl: "Online", date: "3 days ago" },
      ],
    },
    about: {
      eyebrow: "Who we are",
      title: "A Mauritanian company built on technical rigor",
      desc: "NOOR-SARL is a digital services company based in Nouakchott. Our name means “light” — the light we bring to businesses by clarifying their systems, securing their data, and automating their processes with the latest technologies.",
      facts: [["2026", "Year founded"], ["9", "Areas of expertise"], ["3", "Founding partners"], ["NKC", "Based in Nouakchott"]],
    },
    services: {
      eyebrow: "Our expertise",
      title: "Nine specialties, one direction",
      desc: "From software design to data security, we cover the entire technology chain a modern business needs.",
      items: [
        { title: "Websites & Apps", desc: "Design and development of websites and mobile applications, following the latest international standards." },
        { title: "Call Centers", desc: "Setup and operation of call centers, phone systems, and customer relationship management." },
        { title: "Networks & Infrastructure", desc: "Design, installation and management of reliable, high-performance computer networks and IT infrastructure." },
        { title: "Artificial Intelligence", desc: "Development and deployment of AI solutions to automate processes and inform decision-making." },
        { title: "Server Administration", desc: "Configuration, administration and maintenance of servers and back-end systems, with continuous uptime." },
        { title: "Cybersecurity", desc: "Information protection, penetration testing, and securing systems against cyber threats." },
        { title: "SMS API", desc: "Send transactional SMS and bulk campaigns through a simple API that integrates with your apps and systems." },
        { title: "Addressing", desc: "Geographic address assignment and precise mapping — more than 6,000 points already mapped across Nouakchott and the rest of Mauritania." },
        { title: "6RIG", desc: "Real-time tracking of the route between a starting point and a destination — precise geolocation for transport and logistics." },
      ],
    },
    projects: {
      eyebrow: "Our work",
      title: "Real projects, built for our clients",
      desc: "A look at the kind of platforms we design and operate for Mauritanian businesses.",
      items: [
        { title: "SARL Client Portal", desc: "Dashboard letting an SME track its sites, invoices and documents in one place.", tags: ["Websites & Apps", "Dashboard", "Security"], preview: "bars" },
        { title: "Virtual Call Center", desc: "Call management and customer relationship platform with real-time agent monitoring.", tags: ["Call Centers", "Telephony", "CRM"], preview: "rows" },
        { title: "Network & AI Monitoring", desc: "Infrastructure supervision console combining network alerts with AI anomaly detection.", tags: ["Networks", "AI", "Cybersecurity"], preview: "stats" },
      ],
    },
    approach: {
      eyebrow: "Method",
      title: "How we work",
      items: [
        { tag: "LISTEN", title: "Understand the real need", desc: "Every engagement starts with a diagnosis of business goals before any technical decision." },
        { tag: "DESIGN", title: "A tailor-made architecture", desc: "We choose technologies suited to the context — not the trendiest, the most relevant." },
        { tag: "DELIVERY", title: "Controlled production rollout", desc: "Deployment, documentation and team training for lasting autonomy." },
        { tag: "FOLLOW-UP", title: "Continuous maintenance & security", desc: "Monitoring, updates and regular audits to keep your systems reliable over time." },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's talk about your project",
      desc: "An idea, a technical need, or a project already underway — our team responds quickly.",
      phoneLbl: "Phone",
      addressLbl: "Address",
      addressVal: "Nouakchott, Mauritania",
      statusLbl: "Status",
      statusVal: "NOOR — SARL, Nouakchott",
      whatsappLbl: "WhatsApp",
      whatsappVal: "Chat with us directly",
      nameLbl: "Name",
      namePh: "Your name",
      mailLbl: "Email",
      mailPh: "you@example.com",
      msgLbl: "Message",
      msgPh: "Describe your project...",
      submit: "Send message",
      sent: "Thank you — your message has been prepared. Connect this form to your mailbox or CRM to make it functional.",
    },
    footer: {
      desc: "NOOR designs and operates tailor-made digital solutions for Mauritanian businesses.",
      navigate: "Navigate",
      expertise: "What we build",
      talk: "Talk to us",
      copyright: "© 2026 NOOR-SARL — Nouakchott, Mauritania. All rights reserved.",
      login: "Login / Client area",
      dashboard: "Admin dashboard",
      logout: "Logout",
    },
  },
};

const palettes = {
  light: {
    bg: "#FFFFFF", bgAlt: "#F6F4FA", fg: "#1B1A1F", muted: "#68646F", mutedSoft: "#8B8792",
    border: "#E3DFEA", accent: "#993EAF", accentHover: "#7A2F8C", accentSoft: "rgba(153,62,175,0.12)",
    accentSoft2: "rgba(153,62,175,0.07)", navBg: "rgba(255,255,255,0.75)", navBgScrolled: "rgba(255,255,255,0.92)",
    shadow: "0 14px 34px -12px rgba(153,62,175,0.25)", gridLine: "rgba(19,15,26,0.035)", pillBg: "#F0EDF5",
    statusOkBg: "rgba(34,197,94,0.12)", statusOkFg: "#15803D", statusWarnBg: "rgba(245,158,11,0.14)", statusWarnFg: "#B45F06",
  },
  dark: {
    bg: "#121016", bgAlt: "#1C1922", fg: "#F3F1F6", muted: "#A9A4B1", mutedSoft: "#8B8792",
    border: "#2E2A38", accent: "#C061DB", accentHover: "#D687E8", accentSoft: "rgba(192,97,219,0.18)",
    accentSoft2: "rgba(192,97,219,0.1)", navBg: "rgba(18,16,22,0.75)", navBgScrolled: "rgba(18,16,22,0.92)",
    shadow: "0 14px 34px -12px rgba(192,97,219,0.35)", gridLine: "rgba(255,255,255,0.045)", pillBg: "#221F2A",
    statusOkBg: "rgba(74,222,128,0.16)", statusOkFg: "#4ADE80", statusWarnBg: "rgba(251,191,99,0.18)", statusWarnFg: "#FBBF63",
  },
};

export default function NoorSite() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState("light");
  const [lang, setLang] = useState("fr");
  const [active, setActive] = useState("home");

  const c = palettes[mode];
  const t = translations[lang];
  const styles = useMemo(() => getStyles(c), [c]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let current = "home";
      for (const id of SECTION_ORDER) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current === "apropos" ? "home" : current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMode = useCallback(() => setMode((m) => (m === "light" ? "dark" : "light")), []);

  return (
    <div style={styles.body}>
      <style>{css(c)}</style>
      <div style={styles.gridBg} />

      <header style={{ ...styles.header, ...(scrolled ? styles.headerScrolled : {}) }}>
        <div style={styles.logo}>
          <img src={LOGO_SRC} alt="NOOR" style={styles.logoImg} />
          NOOR
        </div>

        <nav style={styles.pillNav} className="pill-nav nav-links-desktop">
          {NAV_ITEMS.map(({ id, key, Icon }) => (
            <a key={id} href={`#${id}`} className={"pill-nav-item" + (active === id ? " active" : "")} style={active === id ? styles.pillNavItemActive : styles.pillNavItem}>
              <Icon />
              {t.nav[key]}
            </a>
          ))}
        </nav>

        <div style={styles.navRight}>
          <div style={styles.langToggle} className="nav-links-desktop">
            <button className={"lang-btn" + (lang === "fr" ? " active" : "")} style={lang === "fr" ? styles.langBtnActive : styles.langBtn} onClick={() => setLang("fr")}>FR</button>
            <button className={"lang-btn" + (lang === "en" ? " active" : "")} style={lang === "en" ? styles.langBtnActive : styles.langBtn} onClick={() => setLang("en")}>EN</button>
          </div>

          <button className="theme-toggle" style={styles.themeToggle} onClick={toggleMode} aria-label="Basculer le thème">
            <IconMoon style={{ opacity: mode === "dark" ? 1 : 0.35 }} />
            <span style={styles.switchTrack}>
              <span style={{ ...styles.switchThumb, ...(mode === "dark" ? styles.switchThumbOn : {}) }} />
            </span>
            <IconSun style={{ opacity: mode === "light" ? 1 : 0.35 }} />
          </button>

          <a href="tel:+22227420048" className="nav-phone" style={styles.navPhone}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            27 42 00 48
          </a>
        </div>
      </header>

      <section id="home" style={styles.hero}>
        <div style={styles.heroGlow} />

        <div className="fade-in hero-badge" style={{ ...styles.heroBadge, animationDelay: "0.15s" }}>
          <span className="badge-pulse" style={styles.badgeDot} />
          {t.hero.badge}
        </div>

        <h1 className="fade-in" style={{ ...styles.heroTitle, animationDelay: "0.3s" }}>
          {t.hero.titleLine1}
          <br />
          <span style={{ color: c.accent }}>{t.hero.titleAccent}</span>
        </h1>
        <p className="fade-in" style={{ ...styles.heroSlogan, animationDelay: "0.45s" }}>{t.hero.slogan}</p>
        <p className="fade-in" style={{ ...styles.heroSub, animationDelay: "0.6s" }}>{t.hero.sub}</p>
        <div className="fade-in" style={{ ...styles.heroCta, animationDelay: "0.75s" }}>
          <a href="#contact" className="btn btn-primary">{t.hero.cta1}</a>
          <a href="#services" className="btn btn-ghost">{t.hero.cta2}</a>
        </div>

        <div className="fade-in" style={{ ...styles.heroPreview, animationDelay: "0.9s" }}>
          <div style={styles.previewWindow}>
            <div style={styles.previewBar}>
              <span style={{ ...styles.previewDot, background: "#FF5F57" }} />
              <span style={{ ...styles.previewDot, background: "#FEBC2E" }} />
              <span style={{ ...styles.previewDot, background: "#28C840" }} />
              <div style={styles.previewUrl}>panel.noor.lu</div>
            </div>
            <div style={styles.previewBody}>
              <div style={styles.previewHead}>
                <div style={styles.previewHeadTitle}>{t.preview.title}</div>
                <span style={styles.previewLive}>
                  <span className="badge-pulse" style={styles.badgeDotSmall} />
                  {t.preview.live}
                </span>
              </div>
              <div style={styles.previewStatsRow} className="preview-stats-row">
                {t.preview.stats.map(([num, label]) => (
                  <div key={label} style={styles.previewStat}>
                    <div style={styles.previewStatNum}>{num}</div>
                    <div style={styles.previewStatLabel}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={styles.previewListTitle}>{t.preview.listTitle}</div>
              <div style={styles.previewList}>
                {t.preview.rows.map((r) => (
                  <div key={r.name} style={styles.previewRow}>
                    <span style={styles.previewSiteName}>{r.name}</span>
                    <span style={{ ...styles.statusPill, ...(r.status === "online" ? styles.statusOnline : styles.statusMaintenance) }}>{r.statusLbl}</span>
                    <span style={styles.previewDate} className="preview-date">{r.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.scrollCue}>
          <div style={styles.scrollLine} />
          {t.hero.scroll}
        </div>
      </section>

      <section id="apropos" style={styles.sectionBordered}>
        <div style={styles.aboutWrap} className="about-wrap">
          <div>
            <div style={styles.sectionEyebrow}>{t.about.eyebrow}</div>
            <h2 style={styles.sectionTitle}>{t.about.title}</h2>
            <p style={styles.sectionDesc}>{t.about.desc}</p>
            <div style={styles.aboutFacts} className="about-facts">
              {t.about.facts.map(([num, label]) => (
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
                  <stop offset="0%" stopColor={c.accent} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={c.accent} stopOpacity="0" />
                </radialGradient>
              </defs>
              <g stroke={c.mutedSoft} strokeWidth="0.6" opacity="0.3">
                <line x1="200" y1="200" x2="200" y2="10" />
                <line x1="200" y1="200" x2="200" y2="390" />
                <line x1="200" y1="200" x2="10" y2="200" />
                <line x1="200" y1="200" x2="390" y2="200" />
                <line x1="200" y1="200" x2="60" y2="60" />
                <line x1="200" y1="200" x2="340" y2="60" />
                <line x1="200" y1="200" x2="60" y2="340" />
                <line x1="200" y1="200" x2="340" y2="340" />
              </g>
              <circle cx="200" cy="200" r="150" fill="none" stroke={c.border} strokeWidth="1" />
              <circle cx="200" cy="200" r="100" fill="none" stroke={c.border} strokeWidth="1" />
              <circle cx="200" cy="200" r="55" fill="url(#glow)" />
            </svg>
          </div>
        </div>
      </section>

      <section id="services" style={styles.servicesSection}>
        <div style={styles.sectionHead}>
          <div style={styles.sectionEyebrow}>{t.services.eyebrow}</div>
          <h2 style={styles.sectionTitle}>{t.services.title}</h2>
          <p style={styles.sectionDesc}>{t.services.desc}</p>
        </div>
        <div style={styles.servicesGrid} className="services-grid">
          {t.services.items.map((s, i) => (
            <div key={s.title} className="service-card" style={styles.serviceCard}>
              <span style={styles.serviceIdx}>{String(i + 1).padStart(2, "0")}</span>
              <div style={styles.serviceIcon}>{SERVICE_ICONS[i]}</div>
              <h3 style={styles.serviceTitle}>{s.title}</h3>
              <p style={styles.serviceDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="projets" style={styles.sectionBordered}>
        <div style={styles.sectionHead}>
          <div style={styles.sectionEyebrow}>{t.projects.eyebrow}</div>
          <h2 style={styles.sectionTitle}>{t.projects.title}</h2>
          <p style={styles.sectionDesc}>{t.projects.desc}</p>
        </div>
        <div style={styles.projectsGrid} className="projects-grid">
          {t.projects.items.map((p) => (
            <div key={p.title} className="project-card" style={styles.projectCard}>
              <div className="project-preview-window" style={styles.projectPreviewWindow}>
                <div style={styles.previewBar}>
                  <span style={{ ...styles.previewDot, background: "#FF5F57" }} />
                  <span style={{ ...styles.previewDot, background: "#FEBC2E" }} />
                  <span style={{ ...styles.previewDot, background: "#28C840" }} />
                  <div style={styles.projectPreviewLabel}>{lang === "fr" ? "APERÇU" : "PREVIEW"}</div>
                </div>
                <div style={styles.projectPreviewBody}>
                  {p.preview === "bars" && (
                    <div style={styles.artBars}>
                      {[0.4, 0.7, 1, 0.55].map((h, i) => (
                        <span key={i} style={{ ...styles.artBar, height: `${h * 100}%`, opacity: 0.5 + i * 0.15 }} />
                      ))}
                    </div>
                  )}
                  {p.preview === "rows" && (
                    <div style={styles.artRows}>
                      {[0.9, 0.65, 0.8].map((w, i) => (
                        <div key={i} style={styles.artRow}>
                          <span style={styles.artRowDot} />
                          <span style={{ ...styles.artRowLine, width: `${w * 100}%` }} />
                        </div>
                      ))}
                    </div>
                  )}
                  {p.preview === "stats" && (
                    <div style={styles.artStats}>
                      {["24", "6", "98%", "12"].map((n, i) => (
                        <div key={i} style={styles.artStatTile}>
                          <div style={styles.artStatNum}>{n}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <h3 style={styles.projectTitle}>{p.title}</h3>
              <p style={styles.projectDesc}>{p.desc}</p>
              <div style={styles.projectTags}>
                {p.tags.map((tag) => (
                  <span key={tag} style={styles.projectTag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="approche" style={styles.sectionBordered}>
        <div style={styles.sectionHead}>
          <div style={styles.sectionEyebrow}>{t.approach.eyebrow}</div>
          <h2 style={styles.sectionTitle}>{t.approach.title}</h2>
        </div>
        <div>
          {t.approach.items.map((a, i) => (
            <div
              key={a.tag}
              style={{ ...styles.approcheItem, borderBottom: i === t.approach.items.length - 1 ? `1px solid ${c.border}` : "none" }}
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
            <div style={styles.sectionEyebrow}>{t.contact.eyebrow}</div>
            <h2 style={styles.sectionTitle}>{t.contact.title}</h2>
            <p style={{ ...styles.sectionDesc, marginBottom: 44 }}>{t.contact.desc}</p>
            <div style={styles.contactInfo}>
              <div style={styles.contactRow}>
                <svg style={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <div><div style={styles.lbl}>{t.contact.phoneLbl}</div><div style={styles.val}>27 42 00 48</div></div>
              </div>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="contact-row-link" style={styles.contactRow}>
                <IconWhatsApp style={styles.ic} />
                <div><div style={styles.lbl}>{t.contact.whatsappLbl}</div><div style={styles.val}>{t.contact.whatsappVal}</div></div>
              </a>
              <div style={styles.contactRow}>
                <svg style={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div><div style={styles.lbl}>{t.contact.addressLbl}</div><div style={styles.val}>{t.contact.addressVal}</div></div>
              </div>
              <div style={styles.contactRow}>
                <svg style={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                <div><div style={styles.lbl}>{t.contact.statusLbl}</div><div style={styles.val}>{t.contact.statusVal}</div></div>
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
              <label htmlFor="nom" style={styles.fieldLabel}>{t.contact.nameLbl}</label>
              <input id="nom" type="text" required placeholder={t.contact.namePh} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label htmlFor="mail" style={styles.fieldLabel}>{t.contact.mailLbl}</label>
              <input id="mail" type="email" required placeholder={t.contact.mailPh} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label htmlFor="msg" style={styles.fieldLabel}>{t.contact.msgLbl}</label>
              <textarea id="msg" required placeholder={t.contact.msgPh} style={{ ...styles.input, minHeight: 100, resize: "vertical" }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: "center" }}>{t.contact.submit}</button>
            {sent && <p style={{ color: c.mutedSoft, fontSize: "0.88rem" }}>{t.contact.sent}</p>}
          </form>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerGrid} className="footer-grid">
          <div>
            <div style={styles.footMark}>
              <img src={LOGO_SRC} alt="NOOR" style={styles.footLogoImg} />
              NOOR
            </div>
            <div style={styles.footSlogan}>illuminate your digital transformation</div>
            <p style={styles.footDesc}>{t.footer.desc}</p>
          </div>

          <div>
            <div style={styles.footColTitle}>{t.footer.navigate}</div>
            <div style={styles.footLinks}>
              {NAV_ITEMS.map(({ id, key }) => (
                <a key={id} href={`#${id}`} className="footer-col-link">{t.nav[key]}</a>
              ))}
            </div>
          </div>

          <div>
            <div style={styles.footColTitle}>{t.footer.expertise}</div>
            <div style={styles.footLinks}>
              {t.services.items.map((s) => (
                <a key={s.title} href="#services" className="footer-col-link">{s.title}</a>
              ))}
            </div>
          </div>

          <div>
            <div style={styles.footColTitle}>{t.footer.talk}</div>
            <div style={styles.footLinks}>
              <a href="tel:+22227420048" className="footer-col-link footer-col-link-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                27 42 00 48
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="footer-col-link footer-col-link-icon">
                <IconWhatsApp />
                WhatsApp
              </a>
              <span className="footer-col-link footer-col-link-icon" style={{ cursor: "default" }}>
                <IconMail />
                contact@noor.lu
              </span>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <div>{t.footer.copyright}</div>
          <div style={styles.footAuth}>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link to="/admin" className="footer-link">{t.footer.dashboard}</Link>
                )}
                <button className="footer-link-btn" onClick={logout}>{t.footer.logout} ({user.email})</button>
              </>
            ) : (
              <Link to="/login" className="footer-link">{t.footer.login}</Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

function getStyles(c) {
  return {
    body: { position: "relative", background: c.bg, color: c.fg, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, lineHeight: 1.6, overflowX: "hidden", transition: "background .3s, color .3s", minHeight: "100vh" },
    gridBg: {
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `linear-gradient(to right, ${c.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${c.gridLine} 1px, transparent 1px)`,
      backgroundSize: "64px 64px",
      maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
      WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
    },
    header: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 6vw", background: c.navBg, backdropFilter: "blur(10px)", borderBottom: "1px solid transparent", transition: "border-color .3s, background .3s" },
    headerScrolled: { borderBottomColor: c.border, background: c.navBgScrolled },
    logo: { display: "flex", alignItems: "center", gap: 11, fontFamily: "'Readex Pro', sans-serif", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "0.06em" },
    logoImg: { width: 30, height: 30, borderRadius: 8, display: "block" },
    pillNav: { display: "flex", alignItems: "center", gap: 4, background: c.pillBg, borderRadius: 999, padding: 5, border: `1px solid ${c.border}` },
    pillNavItem: { display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 999, fontSize: "0.86rem", color: c.muted },
    pillNavItemActive: { display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 999, fontSize: "0.86rem", background: c.accent, color: "#fff" },
    navRight: { display: "flex", alignItems: "center", gap: 14 },
    langToggle: { display: "flex", alignItems: "center", gap: 2, background: c.pillBg, borderRadius: 999, padding: 4, border: `1px solid ${c.border}` },
    langBtn: { padding: "6px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 600, color: c.muted, background: "transparent", border: "none", cursor: "pointer" },
    langBtnActive: { padding: "6px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 600, color: "#fff", background: c.accent, border: "none", cursor: "pointer" },
    themeToggle: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: c.fg, padding: 4 },
    switchTrack: { width: 36, height: 20, borderRadius: 999, background: c.border, position: "relative", transition: "background .3s", display: "inline-block" },
    switchThumb: { position: "absolute", top: 2, left: 2, width: 16, height: 16, borderRadius: "50%", background: c.accent, transition: "transform .25s" },
    switchThumbOn: { transform: "translateX(16px)" },
    navPhone: { display: "flex", alignItems: "center", gap: 8, fontSize: "0.86rem", border: `1px solid ${c.border}`, padding: "9px 16px", borderRadius: 999, transition: "border-color .3s, background .3s" },

    hero: { position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 6vw 0", zIndex: 1 },
    heroGlow: { position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 640, height: 640, background: `radial-gradient(circle, ${c.accentSoft}, transparent 70%)`, pointerEvents: "none", zIndex: -1 },
    heroBadge: { display: "inline-flex", alignItems: "center", gap: 10, color: c.accent, fontSize: "0.85rem", fontWeight: 500, background: c.accentSoft2, border: `1px solid ${c.accentSoft}`, padding: "9px 20px", borderRadius: 999, marginBottom: 30, fontFamily: "'Readex Pro', sans-serif" },
    badgeDot: { width: 7, height: 7, borderRadius: "50%", background: c.accent, display: "inline-block" },
    heroTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "clamp(2.4rem,6.4vw,4.6rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.12, paddingBottom: 8, maxWidth: "18ch" },
    heroSlogan: { marginTop: 22, fontFamily: "'Readex Pro', sans-serif", fontWeight: 300, fontSize: "1.15rem", letterSpacing: "0.02em", color: c.mutedSoft, textTransform: "lowercase" },
    heroSub: { marginTop: 18, maxWidth: "56ch", color: c.muted, fontSize: "1.02rem", fontWeight: 300 },
    heroCta: { marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" },
    scrollCue: { position: "relative", marginTop: 56, marginBottom: 38, fontSize: "0.72rem", color: c.muted, letterSpacing: "0.15em", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
    scrollLine: { width: 1, height: 34, background: `linear-gradient(to bottom, ${c.accent}, transparent)` },

    heroPreview: { marginTop: 56, width: "100%", maxWidth: 760, textAlign: "left" },
    previewWindow: { background: c.bgAlt, border: `1px solid ${c.border}`, borderRadius: 18, overflow: "hidden", boxShadow: c.shadow },
    previewBar: { display: "flex", alignItems: "center", gap: 7, padding: "12px 16px", borderBottom: `1px solid ${c.border}`, background: c.bg },
    previewDot: { width: 10, height: 10, borderRadius: "50%", display: "inline-block" },
    previewUrl: { marginLeft: 12, fontSize: "0.78rem", color: c.muted, background: c.pillBg, padding: "3px 14px", borderRadius: 999 },
    previewBody: { padding: "22px 26px 26px" },
    previewHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 },
    previewHeadTitle: { fontFamily: "'Readex Pro', sans-serif", fontWeight: 600, fontSize: "1rem" },
    previewLive: { display: "flex", alignItems: "center", gap: 7, fontSize: "0.75rem", color: c.accent, background: c.accentSoft2, padding: "5px 12px", borderRadius: 999 },
    badgeDotSmall: { width: 6, height: 6, borderRadius: "50%", background: c.accent, display: "inline-block" },
    previewStatsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 },
    previewStat: { background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "14px 16px" },
    previewStatNum: { fontFamily: "'Readex Pro', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: c.accent },
    previewStatLabel: { fontSize: "0.74rem", color: c.muted, marginTop: 4 },
    previewListTitle: { fontSize: "0.76rem", color: c.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 },
    previewList: { display: "flex", flexDirection: "column" },
    previewRow: { display: "flex", alignItems: "center", gap: 14, padding: "11px 4px", borderTop: `1px solid ${c.border}` },
    previewSiteName: { flex: 1, fontSize: "0.92rem", fontWeight: 500 },
    previewDate: { fontSize: "0.78rem", color: c.muted, width: 110, textAlign: "right" },
    statusPill: { fontSize: "0.72rem", padding: "4px 11px", borderRadius: 999, fontWeight: 500, whiteSpace: "nowrap" },
    statusOnline: { background: c.statusOkBg, color: c.statusOkFg },
    statusMaintenance: { background: c.statusWarnBg, color: c.statusWarnFg },

    sectionBordered: { position: "relative", zIndex: 1, padding: "130px 6vw", borderTop: `1px solid ${c.border}` },
    servicesSection: { position: "relative", zIndex: 1, padding: "130px 6vw", borderTop: `1px solid ${c.border}`, background: `linear-gradient(180deg, transparent, ${c.accentSoft2}, transparent)` },
    sectionHead: { maxWidth: 640, marginBottom: 64 },
    sectionEyebrow: { color: c.accent, fontSize: "0.78rem", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Readex Pro', sans-serif" },
    sectionTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "clamp(1.7rem,3.2vw,2.4rem)", fontWeight: 600, letterSpacing: "-0.005em" },
    sectionDesc: { color: c.muted, marginTop: 18, fontSize: "1.02rem", maxWidth: "56ch" },
    aboutWrap: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" },
    aboutVisual: { position: "relative", aspectRatio: "1/1", border: `1px solid ${c.border}`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", background: c.bgAlt, overflow: "hidden" },
    aboutFacts: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 40 },
    fact: { background: c.bgAlt, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22 },
    factNum: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.5rem", color: c.accent, fontWeight: 600 },
    factLabel: { color: c.muted, fontSize: "0.8rem", marginTop: 6 },
    servicesGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 },
    serviceCard: { background: c.bgAlt, border: `1px solid ${c.border}`, borderRadius: 18, padding: "38px 30px", position: "relative", overflow: "hidden" },
    serviceIdx: { position: "absolute", top: 24, right: 26, fontFamily: "'Readex Pro', sans-serif", fontSize: "0.75rem", color: c.muted, opacity: 0.5 },
    serviceIcon: { width: 42, height: 42, marginBottom: 24, color: c.accent },
    serviceTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.06rem", fontWeight: 600, marginBottom: 12 },
    serviceDesc: { color: c.muted, fontSize: "0.92rem" },

    projectsGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 },
    projectCard: { display: "flex", flexDirection: "column" },
    projectPreviewWindow: { background: c.bgAlt, border: `1px solid ${c.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 22 },
    projectPreviewLabel: { marginLeft: 10, fontSize: "0.66rem", letterSpacing: "0.15em", color: c.muted },
    projectPreviewBody: { padding: "22px 20px", minHeight: 150, display: "flex", alignItems: "center", justifyContent: "center" },
    artBars: { display: "flex", alignItems: "flex-end", gap: 12, height: 100, width: "100%" },
    artBar: { flex: 1, background: c.accent, borderRadius: "6px 6px 0 0" },
    artRows: { display: "flex", flexDirection: "column", gap: 14, width: "100%" },
    artRow: { display: "flex", alignItems: "center", gap: 10 },
    artRowDot: { width: 8, height: 8, borderRadius: "50%", background: c.accent, flexShrink: 0 },
    artRowLine: { height: 8, borderRadius: 999, background: c.border },
    artStats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%" },
    artStatTile: { background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "14px 0", textAlign: "center" },
    artStatNum: { fontFamily: "'Readex Pro', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: c.accent },
    projectTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.05rem", fontWeight: 600, marginBottom: 10 },
    projectDesc: { color: c.muted, fontSize: "0.92rem", marginBottom: 16 },
    projectTags: { display: "flex", flexWrap: "wrap", gap: 8 },
    projectTag: { fontSize: "0.74rem", color: c.muted, background: c.pillBg, border: `1px solid ${c.border}`, padding: "5px 12px", borderRadius: 999 },

    approcheItem: { display: "grid", gridTemplateColumns: "120px 1fr", gap: 32, padding: "30px 0", borderTop: `1px solid ${c.border}`, alignItems: "baseline" },
    approcheTag: { color: c.accent, background: c.accentSoft2, display: "inline-block", padding: "5px 12px", borderRadius: 999, fontFamily: "'Readex Pro', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em" },
    approcheTitle: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.1rem", fontWeight: 500, marginBottom: 8 },
    approcheDesc: { color: c.muted, fontSize: "0.94rem", maxWidth: "60ch" },
    contactWrap: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 },
    contactInfo: { display: "flex", flexDirection: "column", gap: 28 },
    contactRow: { display: "flex", gap: 18, alignItems: "flex-start" },
    ic: { width: 20, height: 20, color: c.accent, flexShrink: 0, marginTop: 3 },
    lbl: { color: c.muted, fontSize: "0.76rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 },
    val: { fontSize: "1.03rem" },
    form: { display: "flex", flexDirection: "column", gap: 18 },
    field: { display: "flex", flexDirection: "column", gap: 8 },
    fieldLabel: { fontSize: "0.76rem", color: c.muted, letterSpacing: "0.08em", textTransform: "uppercase" },
    input: { background: c.bgAlt, border: `1px solid ${c.border}`, color: c.fg, padding: "14px 16px", fontFamily: "'IBM Plex Sans'", fontSize: "0.95rem", borderRadius: 12, outline: "none" },
    footer: { borderTop: `1px solid ${c.border}`, padding: "70px 6vw 30px", color: c.muted, fontSize: "0.85rem", position: "relative", zIndex: 1, background: c.bgAlt },
    footerGrid: { display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40, paddingBottom: 44 },
    footMark: { display: "flex", alignItems: "center", gap: 9, fontFamily: "'Readex Pro', sans-serif", fontWeight: 600, color: c.fg, fontSize: "1rem" },
    footLogoImg: { width: 22, height: 22, borderRadius: 6, display: "block" },
    footSlogan: { fontFamily: "'Readex Pro', sans-serif", fontWeight: 300, color: c.mutedSoft, letterSpacing: "0.02em", marginTop: 4 },
    footDesc: { marginTop: 16, fontSize: "0.88rem", color: c.muted, maxWidth: "32ch" },
    footColTitle: { fontFamily: "'Readex Pro', sans-serif", fontWeight: 600, color: c.fg, fontSize: "0.92rem", marginBottom: 18 },
    footLinks: { display: "flex", flexDirection: "column", gap: 12, fontSize: "0.88rem" },
    footerBottom: { borderTop: `1px solid ${c.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 },
    footAuth: { display: "flex", alignItems: "center", gap: 18 },
  };
}

const css = (c) => `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  ::selection { background: ${c.accent}; color: #fff; }
  a { color: inherit; text-decoration: none; }

  .footer-link, .footer-link-btn { font: inherit; color: ${c.muted}; background: none; border: none; cursor: pointer; padding: 0; transition: color .25s; }
  .footer-link:hover, .footer-link-btn:hover { color: ${c.accent}; }

  .fade-in { opacity: 0; animation: fadeUp 0.9s ease forwards; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .hero-badge .badge-pulse { animation: pulse 1.8s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }

  .pill-nav-item svg { flex-shrink: 0; }
  .pill-nav-item:not(.active):hover { color: ${c.fg} !important; }
  .lang-btn:not(.active):hover { color: ${c.fg} !important; }
  .theme-toggle:hover { opacity: 0.85; }

  .nav-phone:hover { border-color: ${c.accent} !important; background: ${c.accentSoft}; }

  .contact-row-link { transition: opacity .25s; }
  .contact-row-link:hover { opacity: 0.72; }

  .footer-col-link { color: ${c.muted}; transition: color .25s; }
  .footer-col-link:hover { color: ${c.accent}; }
  .footer-col-link-icon { display: flex; align-items: center; gap: 9px; }

  .btn { font-family: 'Readex Pro'; font-size: 0.9rem; font-weight: 500; padding: 15px 30px; border-radius: 999px; display: inline-flex; align-items: center; gap: 10px; transition: transform .25s, box-shadow .25s, background .25s, border-color .25s; cursor: pointer; border: none; }
  .btn-primary { background: ${c.accent}; color: #fff; border: 1px solid ${c.accent}; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: ${c.shadow}; background: ${c.accentHover}; border-color: ${c.accentHover}; }
  .btn-ghost { border: 1px solid ${c.border}; color: ${c.fg}; }
  .btn-ghost:hover { border-color: ${c.mutedSoft}; transform: translateY(-2px); }

  .service-card { transition: transform .3s, border-color .3s; }
  .service-card:hover { transform: translateY(-4px); border-color: ${c.accent} !important; }

  .project-card { transition: transform .3s; }
  .project-card:hover { transform: translateY(-4px); }
  .project-card:hover .project-preview-window { border-color: ${c.accent} !important; }

  @media (max-width: 860px) {
    .nav-links-desktop { display: none !important; }
    .about-wrap, .contact-wrap { grid-template-columns: 1fr !important; gap: 50px !important; }
    .services-grid { grid-template-columns: 1fr !important; }
    .projects-grid { grid-template-columns: 1fr !important; }
    .preview-stats-row { grid-template-columns: 1fr 1fr !important; }
    .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
  }

  @media (max-width: 560px) {
    .footer-grid { grid-template-columns: 1fr !important; }
  }

  @media (max-width: 480px) {
    .preview-stats-row { grid-template-columns: 1fr !important; }
    .preview-date { display: none !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
`;
