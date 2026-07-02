import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const LOGO_SRC = "/logo.png";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login({ email, password });
      const from = location.state?.from;
      if (user.role === "admin") navigate(from ?? "/admin", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Échec de la connexion");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <Link to="/" style={styles.logoBlock}>
        <img src={LOGO_SRC} alt="NOOR" style={styles.logoImg} />
        <span style={styles.logoText}>NOOR</span>
      </Link>

      <div style={styles.card}>
        <div style={styles.eyebrow}>Espace connexion</div>
        <h1 style={styles.title}>Accédez à votre espace</h1>
        <p style={styles.sub}>Connectez-vous pour bénéficier des services NOOR, ou avec votre compte administrateur pour gérer la plateforme.</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>E-mail</label>
            <input id="email" type="email" required placeholder="vous@exemple.com" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Mot de passe</label>
            <input id="password" type="password" required placeholder="••••••••" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div style={{ color: "#B3261E", fontSize: "0.85rem", background: "#FCECEA", padding: "10px 14px", borderRadius: 2 }}>{error}</div>}
          <button type="submit" disabled={busy} className="btn btn-primary" style={{ justifyContent: "center", opacity: busy ? 0.7 : 1 }}>{busy ? "Connexion…" : "Se connecter"}</button>
        </form>

        <Link to="/" style={styles.back}>← Retour au site</Link>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#FFFFFF", color: "#1B1A1F", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 6vw", gap: 40 },
  logoBlock: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  logoImg: { width: 56, height: 56, borderRadius: 14, display: "block" },
  logoText: { fontFamily: "'Readex Pro', sans-serif", fontWeight: 700, fontSize: "1.35rem", letterSpacing: "0.06em", color: "#1B1A1F" },
  card: { width: "100%", maxWidth: 420, border: "1px solid #E3DFEA", borderRadius: 4, padding: "44px 38px", background: "#FFFFFF" },
  eyebrow: { color: "#993EAF", fontSize: "0.78rem", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 14, fontFamily: "'Readex Pro', sans-serif" },
  title: { fontFamily: "'Readex Pro', sans-serif", fontSize: "1.7rem", fontWeight: 600, letterSpacing: "-0.005em" },
  sub: { color: "#68646F", marginTop: 14, fontSize: "0.95rem", lineHeight: 1.6 },
  form: { display: "flex", flexDirection: "column", gap: 18, marginTop: 30 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: "0.76rem", color: "#68646F", letterSpacing: "0.08em", textTransform: "uppercase" },
  input: { background: "#F6F4FA", border: "1px solid #E3DFEA", color: "#1B1A1F", padding: "14px 16px", fontFamily: "'IBM Plex Sans'", fontSize: "0.95rem", borderRadius: 2, outline: "none" },
  back: { display: "inline-block", marginTop: 26, fontSize: "0.85rem", color: "#68646F" },
};

const css = `
  .btn { font-family: 'Readex Pro'; font-size: 0.9rem; font-weight: 500; padding: 15px 30px; border-radius: 2px; display: inline-flex; align-items: center; gap: 10px; transition: transform .25s, box-shadow .25s, background .25s, border-color .25s; cursor: pointer; border: none; }
  .btn-primary { background: #993EAF; color: #fff; border: 1px solid #993EAF; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px -10px rgba(153,62,175,0.28); background: #5C2569; border-color: #5C2569; }
`;
