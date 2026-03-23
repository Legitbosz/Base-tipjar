import { useEffect, useState } from "react";

function timeAgo(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function shortAddr(addr) {
  if (!addr) return "???";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function TipCard({ tip, isNew }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div className={`tip-card ${visible ? "tip-card-visible" : ""} ${isNew ? "tip-card-new" : ""}`}>
      <div className="tip-card-top">
        <div className="tip-emoji-bubble">{tip.emoji || "💜"}</div>
        <div className="tip-meta">
          <div className="tip-sender">
            <a
              href={`https://sepolia.basescan.org/address/${tip.sender}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tip-address"
            >
              {shortAddr(tip.sender)}
            </a>
            {isNew && <span className="live-badge">LIVE</span>}
          </div>
          <div className="tip-time">{timeAgo(tip.timestamp)}</div>
        </div>
        <div className="tip-amount">{parseFloat(tip.amount).toFixed(4)} ETH</div>
      </div>
      {tip.message && (
        <div className="tip-message">"{tip.message}"</div>
      )}
    </div>
  );
}

export default function TipFeed({ tips, newTip }) {
  return (
    <div className="tip-feed card">
      <div className="feed-header">
        <h2 className="card-title">Live Feed</h2>
        {tips.length > 0 && (
          <div className="live-indicator">
            <span className="live-dot" />
            <span>Live</span>
          </div>
        )}
      </div>

      {tips.length === 0 ? (
        <div className="feed-empty">
          <div className="feed-empty-icon">🫙</div>
          <p>No tips yet. Be the first!</p>
          <p className="feed-empty-sub">Tips appear here in real-time as they hit the chain.</p>
        </div>
      ) : (
        <div className="feed-list">
          {tips.map((tip, i) => (
            <TipCard
              key={`${tip.sender}-${tip.timestamp}-${i}`}
              tip={tip}
              isNew={newTip && tip.timestamp === newTip.timestamp && tip.sender === newTip.sender}
            />
          ))}
        </div>
      )}
    </div>
  );
}
