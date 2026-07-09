import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { api } from "../api/client.js";

const IconEye = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16" {...p}>
    <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);
const IconDownload = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16" {...p}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);
const IconUpload = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16" {...p}>
    <path d="M12 21V9m0 0-4 4m4-4 4 4" />
    <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
  </svg>
);

export default function ServiceRequestThread({ requestId, isAdmin }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [docLabel, setDocLabel] = useState("");
  const [requestingDoc, setRequestingDoc] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [previewingId, setPreviewingId] = useState(null);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const [{ messages }, { documents }] = await Promise.all([
        api.getMessages(requestId),
        api.getDocuments(requestId),
      ]);
      setMessages(messages);
      setDocuments(documents);
    } catch (e) {
      setError(e.message || "Erreur lors du chargement");
    }
  }, [requestId]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const body = newMessage.trim();
    if (!body) return;
    setSending(true);
    setError("");
    try {
      const { message } = await api.sendMessage(requestId, body);
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (e) {
      setError(e.message || "Échec de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const handleRequestDoc = async (e) => {
    e.preventDefault();
    const label = docLabel.trim();
    if (!label) return;
    setRequestingDoc(true);
    setError("");
    try {
      const { document } = await api.requestDocument(requestId, label);
      setDocuments((prev) => [document, ...prev]);
      setDocLabel("");
    } catch (e) {
      setError(e.message || "Échec de la demande de document");
    } finally {
      setRequestingDoc(false);
    }
  };

  const handleUpload = async (docId, file) => {
    setUploadingId(docId);
    setError("");
    try {
      const { document } = await api.uploadDocument(requestId, docId, file);
      setDocuments((prev) => prev.map((d) => (d.id === docId ? document : d)));
    } catch (e) {
      setError(e.message || "Échec de l'envoi du fichier");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDownload = async (doc) => {
    try {
      await api.downloadDocument(doc.id, doc.file_name);
    } catch (e) {
      setError(e.message || "Téléchargement impossible");
    }
  };

  const handlePreview = async (doc) => {
    setPreviewingId(doc.id);
    setError("");
    try {
      await api.previewDocument(doc.id);
    } catch (e) {
      setError(e.message || "Aperçu impossible");
    } finally {
      setPreviewingId(null);
    }
  };

  return (
    <div style={styles.wrap}>
      <style>{css}</style>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.columns} className="service-thread-columns">
        <div style={styles.col}>
          <div style={styles.colTitle}>Messages</div>
          <div ref={scrollRef} style={styles.chatBody}>
            {messages.length === 0 && <div style={styles.empty}>Aucun message pour l'instant.</div>}
            {messages.map((m) => {
              const isOwn = m.user_id === user.id;
              return (
                <div key={m.id} style={{ ...styles.bubbleRow, justifyContent: isOwn ? "flex-end" : "flex-start" }}>
                  <div style={{ ...styles.bubble, ...(isOwn ? styles.bubbleOwn : styles.bubbleOther) }}>
                    <div style={styles.bubbleMeta}>
                      {m.full_name} · {new Date(m.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div>{m.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <form style={styles.chatForm} onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Écrire un message…"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={styles.chatInput}
            />
            <button type="submit" disabled={sending || !newMessage.trim()} className="thread-btn" style={styles.sendBtn}>
              Envoyer
            </button>
          </form>
        </div>

        <div style={styles.col}>
          <div style={styles.colTitle}>Documents</div>

          {isAdmin && (
            <form style={styles.docRequestForm} onSubmit={handleRequestDoc}>
              <input
                type="text"
                placeholder="Document à demander (ex: pièce d'identité)"
                value={docLabel}
                onChange={(e) => setDocLabel(e.target.value)}
                style={styles.docInput}
              />
              <button type="submit" disabled={requestingDoc || !docLabel.trim()} className="thread-btn" style={styles.docRequestBtn}>
                Demander
              </button>
            </form>
          )}

          {documents.length === 0 ? (
            <div style={styles.empty}>Aucun document demandé.</div>
          ) : (
            <div style={styles.docList}>
              {documents.map((d) => (
                <div key={d.id} style={styles.docRow}>
                  <div style={styles.docInfo}>
                    <div style={styles.docLabelTxt}>{d.label}</div>
                    <div style={styles.docStatus}>
                      {d.status === "envoye" ? `Envoyé — ${d.file_name}` : "En attente d'envoi"}
                    </div>
                  </div>
                  {d.status === "envoye" ? (
                    <div style={styles.docIconActions}>
                      <button
                        type="button"
                        className="thread-icon-btn"
                        style={styles.docIconBtn}
                        title="Aperçu"
                        aria-label="Aperçu du document"
                        disabled={previewingId === d.id}
                        onClick={() => handlePreview(d)}
                      >
                        <IconEye />
                      </button>
                      <button
                        type="button"
                        className="thread-icon-btn"
                        style={styles.docIconBtn}
                        title="Télécharger"
                        aria-label="Télécharger le document"
                        onClick={() => handleDownload(d)}
                      >
                        <IconDownload />
                      </button>
                    </div>
                  ) : !isAdmin ? (
                    <label className="thread-btn" style={styles.docAction}>
                      <IconUpload />
                      {uploadingId === d.id ? "Envoi…" : "Envoyer le fichier"}
                      <input
                        type="file"
                        style={{ display: "none" }}
                        disabled={uploadingId === d.id}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleUpload(d.id, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  ) : (
                    <span style={styles.docWaiting}>En attente du client</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { borderTop: "1px solid #E3DFEA", padding: "22px 24px", background: "#F6F4FA" },
  error: { color: "#B3261E", background: "#FCECEA", padding: "10px 14px", borderRadius: 8, fontSize: "0.85rem", marginBottom: 16 },
  columns: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "start" },
  col: { display: "flex", flexDirection: "column", minWidth: 0 },
  colTitle: { fontFamily: "'Readex Pro', sans-serif", fontWeight: 600, fontSize: "0.88rem", marginBottom: 10, color: "#1B1A1F" },
  empty: { color: "#68646F", fontSize: "0.85rem", padding: "14px 0" },
  chatBody: { maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 },
  bubbleRow: { display: "flex" },
  bubble: { maxWidth: "82%", borderRadius: 14, padding: "9px 13px", fontSize: "0.86rem", lineHeight: 1.5 },
  bubbleOwn: { background: "#993EAF", color: "#fff", borderBottomRightRadius: 4 },
  bubbleOther: { background: "#FFFFFF", color: "#1B1A1F", border: "1px solid #E3DFEA", borderBottomLeftRadius: 4 },
  bubbleMeta: { fontSize: "0.7rem", opacity: 0.75, marginBottom: 3 },
  chatForm: { display: "flex", gap: 8, marginTop: 12 },
  chatInput: { flex: 1, background: "#FFFFFF", border: "1px solid #E3DFEA", borderRadius: 999, padding: "10px 16px", fontFamily: "'IBM Plex Sans'", fontSize: "0.86rem", outline: "none" },
  sendBtn: { background: "#993EAF", color: "#fff", border: "none", borderRadius: 999, padding: "10px 18px", fontSize: "0.84rem", fontWeight: 500, cursor: "pointer" },
  docRequestForm: { display: "flex", gap: 8, marginBottom: 14 },
  docInput: { flex: 1, background: "#FFFFFF", border: "1px solid #E3DFEA", borderRadius: 999, padding: "9px 14px", fontFamily: "'IBM Plex Sans'", fontSize: "0.84rem", outline: "none" },
  docRequestBtn: { background: "#1B1A1F", color: "#fff", border: "none", borderRadius: 999, padding: "9px 16px", fontSize: "0.82rem", cursor: "pointer" },
  docList: { display: "flex", flexDirection: "column", gap: 10 },
  docRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#FFFFFF", border: "1px solid #E3DFEA", borderRadius: 10, padding: "12px 16px", flexWrap: "wrap" },
  docInfo: { minWidth: 0 },
  docLabelTxt: { fontSize: "0.86rem", fontWeight: 500 },
  docStatus: { fontSize: "0.76rem", color: "#68646F", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  docIconActions: { display: "flex", gap: 8, flexShrink: 0 },
  docIconBtn: { width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "1px solid #E3DFEA", background: "#F6F4FA", color: "#993EAF", cursor: "pointer", flexShrink: 0 },
  docAction: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.78rem", color: "#993EAF", border: "1px solid #993EAF", borderRadius: 999, padding: "7px 14px", cursor: "pointer", background: "transparent", whiteSpace: "nowrap" },
  docWaiting: { fontSize: "0.76rem", color: "#68646F", whiteSpace: "nowrap" },
};

const css = `
  .thread-btn:hover { opacity: 0.85; }
  .thread-btn:disabled { opacity: 0.6; cursor: default; }
  .thread-icon-btn:hover:not(:disabled) { background: #993EAF !important; color: #fff !important; border-color: #993EAF !important; }
  .thread-icon-btn:disabled { opacity: 0.55; cursor: default; }
  @media (max-width: 720px) {
    .service-thread-columns { grid-template-columns: 1fr !important; }
  }
`;
