// =====================================================
// Client API — communication avec le backend NOOR
// =====================================================
// L'URL de l'API est configurable via une variable Vite.
// En production (panel.noor.lu), l'API est servie sous /api.

const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const TOKEN_KEY = "noor_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Erreur ${res.status}`);
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request("/login", { method: "POST", body: { email, password }, auth: false }),
  logout: () => request("/logout", { method: "POST" }),
  me: () => request("/me"),
  dashboard: () => request("/dashboard"),
};
