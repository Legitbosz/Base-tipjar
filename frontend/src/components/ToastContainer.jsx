import { useEffect, useState } from "react";

const styles = `
  .toast-container {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #18181f;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px;
    padding: 14px 18px;
    min-width: 280px;
    max-width: 360px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    pointer-events: all;
    animation: toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .toast.toast-exit {
    animation: toastOut 0.3s ease-in forwards;
  }
  @keyframes toastIn {
    from { transform: translateX(120%); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }
  @keyframes toastOut {
    from { transform: translateX(0); opacity: 1; }
    to   { transform: translateX(120%); opacity: 0; }
  }

  .toast-success { border-color: rgba(34,197,94,0.3); }
  .toast-error   { border-color: rgba(239,68,68,0.3); }
  .toast-pending { border-color: rgba(99,102,241,0.3); }
  .toast-info    { border-color: rgba(129,140,248,0.3); }

  .toast-icon { font-size: 1.4rem; flex-shrink: 0; }

  .toast-body { flex: 1; }
  .toast-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.88rem;
    font-weight: 700;
    color: #f0f0f8;
    margin-bottom: 2px;
  }
  .toast-msg {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: #9090a8;
  }

  .toast-close {
    background: none;
    border: none;
    color: #5a5a72;
    font-size: 0.85rem;
    cursor: pointer;
    padding: 2px 4px;
    flex-shrink: 0;
    transition: color 0.2s;
  }
  .toast-close:hover { color: #f0f0f8; }

  @media (max-width: 480px) {
    .toast-container { bottom: 16px; right: 16px; left: 16px; }
    .toast { min-width: unset; width: 100%; }
  }
`;

const ICONS = {
  success: "✅",
  error: "❌",
  pending: "⏳",
  info: "💙",
};

let toastId = 0;
let addToastFn = null;

export function toast(title, msg, type = "info", duration = 4000) {
  if (addToastFn) addToastFn({ id: ++toastId, title, msg, type, duration });
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const [exiting, setExiting] = useState({});

  useEffect(() => {
    addToastFn = (t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => removeToast(t.id), t.duration);
    };
    return () => { addToastFn = null; };
  }, []);

  const removeToast = (id) => {
    setExiting((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      setExiting((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }, 300);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast-${t.type} ${exiting[t.id] ? "toast-exit" : ""}`}
          >
            <span className="toast-icon">{ICONS[t.type] || "💙"}</span>
            <div className="toast-body">
              <div className="toast-title">{t.title}</div>
              {t.msg && <div className="toast-msg">{t.msg}</div>}
            </div>
            <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
          </div>
        ))}
      </div>
    </>
  );
}
