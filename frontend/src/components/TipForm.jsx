import { useState } from "react";

const EMOJIS = ["🔥", "💜", "🚀", "💯", "⚡", "🎯", "💎", "🙏", "🤝", "👑"];
const PRESET_AMOUNTS = ["0.001", "0.005", "0.01", "0.05"];

export default function TipForm({
  onSend,
  loading,
  txStatus,
  account,
  isCorrectChain,
  onConnect,
  onSwitch,
  chainName,
}) {
  const [amount, setAmount] = useState("0.001");
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🔥");
  const [useCustom, setUseCustom] = useState(false);

  const finalAmount = useCustom ? customAmount : amount;
  const charCount = message.length;
  const isValid = parseFloat(finalAmount) >= 0.0001 && finalAmount !== "";

  const handleSubmit = () => {
    if (!isValid || loading) return;
    onSend({ amount: finalAmount, message, emoji: selectedEmoji });
  };

  const statusMap = {
    pending: { text: "⏳ Transaction pending...", cls: "status-pending" },
    success: { text: "✅ Tip sent! It's on-chain forever.", cls: "status-success" },
    error: { text: "❌ Transaction failed. Try again.", cls: "status-error" },
  };

  return (
    <div className="tip-form card">
      <h2 className="card-title">Send a Tip</h2>

      {/* Emoji picker */}
      <div className="form-group">
        <label className="form-label">Pick a vibe</label>
        <div className="emoji-grid">
          {EMOJIS.map((e) => (
            <button
              key={e}
              className={`emoji-btn ${selectedEmoji === e ? "emoji-selected" : ""}`}
              onClick={() => setSelectedEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="form-group">
        <label className="form-label">Amount (ETH)</label>
        <div className="amount-presets">
          {PRESET_AMOUNTS.map((a) => (
            <button
              key={a}
              className={`preset-btn ${!useCustom && amount === a ? "preset-selected" : ""}`}
              onClick={() => { setAmount(a); setUseCustom(false); }}
            >
              {a}
            </button>
          ))}
          <button
            className={`preset-btn ${useCustom ? "preset-selected" : ""}`}
            onClick={() => setUseCustom(true)}
          >
            Custom
          </button>
        </div>
        {useCustom && (
          <input
            className="form-input"
            type="number"
            placeholder="0.001"
            step="0.001"
            min="0.0001"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
        )}
      </div>

      {/* Message */}
      <div className="form-group">
        <label className="form-label">
          Message <span className="label-optional">(optional)</span>
        </label>
        <textarea
          className="form-textarea"
          placeholder="Say something nice... or don't. It's permanent either way."
          maxLength={280}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        <div className={`char-count ${charCount > 250 ? "char-warning" : ""}`}>
          {charCount}/280
        </div>
      </div>

      {/* Action */}
      {!account ? (
        <button className="btn-primary" onClick={onConnect}>
          Connect Wallet to Tip
        </button>
      ) : !isCorrectChain ? (
        <button className="btn-primary btn-switch-chain" onClick={onSwitch}>
          Switch to {chainName}
        </button>
      ) : (
        <button
          className={`btn-primary ${!isValid || loading ? "btn-disabled" : ""}`}
          onClick={handleSubmit}
          disabled={!isValid || loading}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="spinner" /> Sending...
            </span>
          ) : (
            `${selectedEmoji} Send ${finalAmount || "?"} ETH`
          )}
        </button>
      )}

      {txStatus && (
        <div className={`tx-status ${statusMap[txStatus].cls}`}>
          {statusMap[txStatus].text}
        </div>
      )}
    </div>
  );
}
