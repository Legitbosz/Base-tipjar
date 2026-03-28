import { useEffect, useState, useMemo } from "react";
import { useResolvedName } from "../hooks/useResolvedName";

function timeAgo(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  if (diff < 604800) return Math.floor(diff / 86400) + "d ago";
  return Math.floor(diff / 604800) + "w ago";
}

function TipSender({ address, isNew }) {
  const { name, loading } = useResolvedName(address);
  const cls = loading ? "tip-address tip-address-loading" : "tip-address";
  return (
    <div className="tip-sender">
      <a
        href={"https://basescan.org/address/" + address}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        title={address}
      >
        {name}
      </a>
      {isNew && <span className="live-badge">LIVE</span>}
    </div>
  );
}

function TipCard({ tip, isNew }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const cardClass =
    "tip-card" +
    (visible ? " tip-card-visible" : "") +
    (isNew ? " tip-card-new" : "");

  const ethAmount = parseFloat(tip.amount);
  const isWhale = ethAmount >= 0.005;

  return (
    <div className={cardClass}>
      <div className="tip-card-top">
        <div className={`tip-emoji-bubble ${isWhale ? "tip-emoji-whale" : ""}`}>
          {tip.emoji || "💜"}
        </div>
        <div className="tip-meta">
          <TipSender address={tip.sender} isNew={isNew} />
          <div className="tip-time">{timeAgo(tip.timestamp)}</div>
        </div>
        <div className={`tip-amount ${isWhale ? "tip-amount-whale" : ""}`}>
          {isWhale && <span title="Whale tip">🐋 </span>}{ethAmount.toFixed(4)} ETH
        </div>
      </div>
      {tip.message && (
        <div className="tip-message">
          <span className="tip-message-quote">"</span>
          {tip.message}
          <span className="tip-message-quote">"</span>
        </div>
      )}
    </div>
  );
}

const FILTERS = ["All", "Top Tips", "With Message", "Recent"];

export default function TipFeed({ tips, newTip }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = [...tips];

    if (filter === "Top Tips") {
      result.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    } else if (filter === "With Message") {
      result = result.filter((t) => t.message && t.message.trim().length > 0);
    } else if (filter === "Recent") {
      result.sort((a, b) => b.timestamp - a.timestamp);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.sender.toLowerCase().includes(q) ||
          (t.message && t.message.toLowerCase().includes(q))
      );
    }

    return result;
  }, [tips, filter, search]);

  const totalEth = tips.reduce((acc, t) => acc + parseFloat(t.amount), 0);

  return (
    <div className="tip-feed card">
      {/* Header */}
      <div className="feed-header">
        <div className="feed-header-left">
          <h2 className="card-title" style={{ marginBottom: 0 }}>Live Feed</h2>
          {tips.length > 0 && (
            <div className="feed-summary">
              {tips.length} tips · {totalEth.toFixed(4)} ETH total
            </div>
          )}
        </div>
        {tips.length > 0 && (
          <div className="live-indicator">
            <span className="live-dot" />
            <span>Live</span>
          </div>
        )}
      </div>

      {/* Search */}
      {tips.length > 0 && (
        <div className="feed-search-wrap">
          <input
            className="feed-search"
            type="text"
            placeholder="🔍  Search by address or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Filters */}
      {tips.length > 0 && (
        <div className="feed-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`feed-filter-btn ${filter === f ? "feed-filter-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {tips.length === 0 ? (
        <div className="feed-empty">
          <div className="feed-empty-icon">🫙</div>
          <p>No tips yet. Be the first!</p>
          <p className="feed-empty-sub">Tips appear here in real-time.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="feed-empty">
          <div className="feed-empty-icon">🔍</div>
          <p>No tips match your search.</p>
          <p className="feed-empty-sub">Try a different filter or keyword.</p>
        </div>
      ) : (
        <div className="feed-list">
          {filtered.map((tip, i) => (
            <TipCard
              key={tip.sender + "-" + tip.timestamp + "-" + i}
              tip={tip}
              isNew={
                newTip &&
                tip.timestamp === newTip.timestamp &&
                tip.sender === newTip.sender
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
