// =====================================================
// Client API — communication avec le backend NOOR
// =====================================================
// L'URL de l'API est configurable via une variable Vite.
// En production (panel.noor.lu), l'API est servie sous /api.

const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const TOKEN_KEY = "noor_token";
export const PENDING_SERVICES_KEY = "noor_pending_services";

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
  register: (email, password, fullName) =>
    request("/register", { method: "POST", body: { email, password, full_name: fullName }, auth: false }),
  logout: () => request("/logout", { method: "POST" }),
  me: () => request("/me"),
  dashboard: () => request("/dashboard"),
  myServiceRequests: () => request("/service-requests"),
  requestServices: (services) => request("/service-requests", { method: "POST", body: { services } }),
  updateServiceRequestStatus: (id, status) =>
    request(`/service-requests/${id}`, { method: "PATCH", body: { status } }),
  getMessages: (requestId) => request(`/service-requests/${requestId}/messages`),
  sendMessage: (requestId, body) =>
    request(`/service-requests/${requestId}/messages`, { method: "POST", body: { body } }),
  getDocuments: (requestId) => request(`/service-requests/${requestId}/documents`),
  requestDocument: (requestId, label) =>
    request(`/service-requests/${requestId}/documents`, { method: "POST", body: { label } }),
  uploadDocument: async (requestId, docId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const headers = {};
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/service-requests/${requestId}/documents/${docId}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
    return data;
  },
  downloadDocument: async (docId, fileName) => {
    const headers = {};
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/documents/${docId}/file`, { headers });
    if (!res.ok) throw new Error("Téléchargement impossible");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "document";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
  // Ouvre le document dans un nouvel onglet pour un aperçu, sans forcer le téléchargement.
  // La fenêtre est ouverte avant le fetch (synchrone) pour éviter le blocage de pop-up.
  previewDocument: async (docId) => {
    const win = window.open("", "_blank");
    try {
      const headers = {};
      const token = getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/documents/${docId}/file`, { headers });
      if (!res.ok) throw new Error("Aperçu impossible");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (win) win.location.href = url;
      else window.open(url, "_blank");
    } catch (e) {
      if (win) win.close();
      throw e;
    }
  },
};

// Après connexion/inscription : envoie les services choisis avant authentification, s'il y en a.
// Retourne true si des demandes ont bien été soumises (pour afficher une confirmation).
export async function submitPendingServiceRequests() {
  const raw = localStorage.getItem(PENDING_SERVICES_KEY);
  if (!raw) return false;
  localStorage.removeItem(PENDING_SERVICES_KEY);
  try {
    const services = JSON.parse(raw);
    if (!Array.isArray(services) || services.length === 0) return false;
    await api.requestServices(services);
    return true;
  } catch {
    return false;
  }
}
