import { useState, useEffect } from "react";
import { ethers } from "ethers";

const styles = `
  .wallet-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .wallet-modal {
    background: #18181f;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 24px;
    padding: 32px 24px 24px;
    width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    position: relative;
    animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  }
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .wallet-modal-close {
    position: absolute;
    top: 16px; right: 16px;
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: #9090a8;
    font-size: 14px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .wallet-modal-close:hover { background: rgba(255,255,255,0.1); color: white; }

  .wallet-modal-avatar {
    width: 80px; height: 80px;
    border-radius: 50%;
    margin-bottom: 16px;
    border: 3px solid rgba(99,102,241,0.4);
    box-shadow: 0 0 24px rgba(99,102,241,0.3);
    overflow: hidden;
    background: linear-gradient(135deg, #6366f1, #0052ff);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
  }

  .wallet-modal-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #f0f0f8;
    margin-bottom: 4px;
    text-align: center;
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .wallet-modal-address {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    color: #9090a8;
    margin-bottom: 6px;
    text-align: center;
  }

  .wallet-modal-balance {
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    color: #818cf8;
    font-weight: 500;
    margin-bottom: 24px;
  }

  .wallet-modal-network {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,82,255,0.1);
    border: 1px solid rgba(0,82,255,0.2);
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 0.72rem;
    color: #60A5FA;
    font-family: 'DM Mono', monospace;
    margin-bottom: 24px;
  }
  .wallet-modal-network-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 6px #22c55e;
  }

  .wallet-modal-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
  }

  .wallet-modal-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 12px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: #f0f0f8;
    font-family: 'Syne', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .wallet-modal-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }
  .wallet-modal-btn-icon { font-size: 1.3rem; }

  .wallet-modal-btn.disconnect-btn:hover {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.3);
    color: #ef4444;
  }

  .wallet-modal-copied {
    color: #22c55e !important;
  }

  .wallet-modal-divider {
    width: 100%;
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 16px 0;
  }

  .wallet-pill-clickable {
    cursor: pointer;
    transition: all 0.2s;
  }
  .wallet-pill-clickable:hover {
    border-color: rgba(255,255,255,0.2);
    background: #222230;
  }
`;

// Generate a simple avatar color from address
function getAvatarEmoji(address) {
  const emojis = ["🐋","🦁","🐯","🦊","🐺","🦝","🐸","🦄","🐲","🦅","🦋","🐬"];
  const idx = parseInt(address.slice(2, 4), 16) % emojis.length;
  return emojis[idx];
}

export default function WalletModal({ account, resolvedName, provider, onDisconnect, onClose }) {
  const [balance, setBalance] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!provider || !account) return;
    provider.getBalance(account).then((bal) => {
      setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
    }).catch(() => {});
  }, [provider, account]);

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "";
  const avatar = account ? getAvatarEmoji(account) : "🦄";

  return (
    <>
      <style>{styles}</style>
      <div className="wallet-modal-overlay" onClick={onClose}>
        <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
          <button className="wallet-modal-close" onClick={onClose}>✕</button>

          {/* Avatar */}
          <div className="wallet-modal-avatar">{avatar}</div>

          {/* Name / Address */}
          <div className="wallet-modal-name">{resolvedName || shortAddress}</div>
          {resolvedName && resolvedName !== shortAddress && (
            <div className="wallet-modal-address">{shortAddress}</div>
          )}

          {/* Balance */}
          <div className="wallet-modal-balance">
            {balance !== null ? `${balance} ETH` : "Loading..."}
          </div>

          {/* Network */}
          <div className="wallet-modal-network">
            <span className="wallet-modal-network-dot" />
            Base Mainnet
          </div>

          <div className="wallet-modal-divider" />

          {/* Actions */}
          <div className="wallet-modal-actions">
            <button
              className={`wallet-modal-btn ${copied ? "wallet-modal-copied" : ""}`}
              onClick={copyAddress}
            >
              <span className="wallet-modal-btn-icon">{copied ? "✅" : "📋"}</span>
              {copied ? "Copied!" : "Copy Address"}
            </button>

            <button
              className="wallet-modal-btn disconnect-btn"
              onClick={() => { onDisconnect(); onClose(); }}
            >
              <span className="wallet-modal-btn-icon">🚪</span>
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
