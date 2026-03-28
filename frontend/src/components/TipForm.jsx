import { useState } from "react";
import { ethers } from "ethers";

const EMOJIS = ["🔥", "💜", "🚀", "💯", "⚡", "🎯", "💎", "🙏", "🤝", "👑"];
const PRESET_AMOUNTS = ["0.001", "0.005", "0.01", "0.05"];

// ─── Tip the Jar ─────────────────────────────────────────────────────────────
function TipJarForm({ onSend, loading, txStatus, account, isCorrectChain, onConnect, onSwitch, chainName }) {
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
    <>
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
        <button className="btn-primary" onClick={onConnect}>Connect Wallet to Tip</button>
      ) : !isCorrectChain ? (
        <button className="btn-primary btn-switch-chain" onClick={onSwitch}>Switch to {chainName}</button>
      ) : (
        <button
          className={`btn-primary ${!isValid || loading ? "btn-disabled" : ""}`}
          onClick={handleSubmit}
          disabled={!isValid || loading}
        >
          {loading ? (
            <span className="btn-loading"><span className="spinner" /> Sending...</span>
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
    </>
  );
}

// ─── Send to Friend ───────────────────────────────────────────────────────────
function SendToFriendForm({ signer, account, isCorrectChain, onConnect, onSwitch, chainName }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.001");
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const finalAmount = useCustom ? customAmount : amount;
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(recipient) || recipient.endsWith(".eth") || recipient.endsWith(".base.eth");
  const isValidAmount = parseFloat(finalAmount) >= 0.0001 && finalAmount !== "";
  const isValid = isValidAddress && isValidAmount;

  const statusMap = {
    pending: { text: "⏳ Sending ETH...", cls: "status-pending" },
    success: { text: "✅ ETH sent successfully!", cls: "status-success" },
    error: { text: "❌ Transaction failed. Try again.", cls: "status-error" },
  };

  const handleSend = async () => {
    if (!isValid || loading || !signer) return;
    setLoading(true);
    setTxStatus("pending");
    setTxHash(null);
    try {
      let to = recipient;
      // Resolve ENS/basename if needed
      if (!recipient.startsWith("0x")) {
        const provider = signer.provider;
        to = await provider.resolveName(recipient);
        if (!to) throw new Error("Could not resolve name");
      }

      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(finalAmount),
      });
      setTxHash(tx.hash);
      await tx.wait();
      setTxStatus("success");
      setRecipient("");
      setNote("");
      setTimeout(() => { setTxStatus(null); setTxHash(null); }, 6000);
    } catch (err) {
      console.error(err);
      setTxStatus("error");
      setTimeout(() => setTxStatus(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Recipient */}
      <div className="form-group">
        <label className="form-label">Recipient Address</label>
        <input
          className={`form-input ${recipient && !isValidAddress ? "input-error" : ""}`}
          type="text"
          placeholder="0x... or name.base.eth"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value.trim())}
        />
        {recipient && !isValidAddress && (
          <div className="input-error-msg">Enter a valid address or basename</div>
        )}
        {recipient && isValidAddress && (
          <div className="input-valid-msg">✅ Valid address</div>
        )}
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

      {/* Note */}
      <div className="form-group">
        <label className="form-label">
          Note <span className="label-optional">(optional, not on-chain)</span>
        </label>
        <input
          className="form-input"
          type="text"
          placeholder="For your coffee ☕"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Warning */}
      <div className="send-warning">
        ⚠️ This sends ETH directly — double check the address before sending!
      </div>

      {/* Action */}
      {!account ? (
        <button className="btn-primary" onClick={onConnect}>Connect Wallet to Send</button>
      ) : !isCorrectChain ? (
        <button className="btn-primary btn-switch-chain" onClick={onSwitch}>Switch to {chainName}</button>
      ) : (
        <button
          className={`btn-primary ${!isValid || loading ? "btn-disabled" : ""}`}
          onClick={handleSend}
          disabled={!isValid || loading}
        >
          {loading ? (
            <span className="btn-loading"><span className="spinner" /> Sending...</span>
          ) : (
            `💸 Send ${finalAmount || "?"} ETH`
          )}
        </button>
      )}

      {txStatus && (
        <div className={`tx-status ${statusMap[txStatus].cls}`}>
          {statusMap[txStatus].text}
          {txStatus === "success" && txHash && (
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              View on Basescan ↗
            </a>
          )}
        </div>
      )}
    </>
  );
}

// ─── Main TipForm ─────────────────────────────────────────────────────────────
export default function TipForm({
  onSend, loading, txStatus, account, isCorrectChain,
  onConnect, onSwitch, chainName, signer,
}) {
  const [tab, setTab] = useState("jar");

  return (
    <div className="tip-form card">
      {/* Tabs */}
      <div className="tip-tabs">
        <button
          className={`tip-tab ${tab === "jar" ? "tip-tab-active" : ""}`}
          onClick={() => setTab("jar")}
        >
          🫙 Tip the Jar
        </button>
        <button
          className={`tip-tab ${tab === "friend" ? "tip-tab-active" : ""}`}
          onClick={() => setTab("friend")}
        >
          💸 Send to Friend
        </button>
      </div>

      {tab === "jar" ? (
        <TipJarForm
          onSend={onSend}
          loading={loading}
          txStatus={txStatus}
          account={account}
          isCorrectChain={isCorrectChain}
          onConnect={onConnect}
          onSwitch={onSwitch}
          chainName={chainName}
        />
      ) : (
        <SendToFriendForm
          signer={signer}
          account={account}
          isCorrectChain={isCorrectChain}
          onConnect={onConnect}
          onSwitch={onSwitch}
          chainName={chainName}
        />
      )}
    </div>
  );
}
