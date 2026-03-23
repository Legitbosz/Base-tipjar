import { useState } from "react";

export default function WithdrawButton({ account, signer, balance }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasBalance = parseFloat(balance) > 0;

  const handleWithdraw = async () => {
    if (!signer || loading || !hasBalance) return;
    setLoading(true); setStatus("pending");
    try {
      const { ethers } = await import("ethers");
      const { CONTRACT_ADDRESS, CONTRACT_ABI } = await import("../utils/config");
      const rw = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await rw.withdraw();
      await tx.wait();
      setStatus("success");
      setTimeout(() => setStatus(null), 5000);
    } catch(e) { console.error(e); setStatus("error"); setTimeout(() => setStatus(null), 4000); }
    finally { setLoading(false); }
  };

  const statusMap = {
    pending: { text: "⏳ Withdrawing...", cls: "status-pending" },
    success: { text: "✅ Withdrawn to your wallet!", cls: "status-success" },
    error:   { text: "❌ Withdraw failed.", cls: "status-error" },
  };

  return (
    <div className="withdraw-card card">
      <div className="withdraw-header">
        <h2 className="card-title">Owner Withdraw</h2>
        <span className="owner-badge">👑 Owner</span>
      </div>
      <p className="withdraw-desc">Pull all accumulated ETH from the jar to your wallet.</p>
      <div className="withdraw-balance">
        <span className="withdraw-balance-label">Available to withdraw</span>
        <span className="withdraw-balance-value">{parseFloat(balance).toFixed(6)} ETH</span>
      </div>
      <button className={"btn-primary btn-withdraw" + (!hasBalance || loading ? " btn-disabled" : "")} onClick={handleWithdraw} disabled={!hasBalance || loading}>
        {loading ? <span className="btn-loading"><span className="spinner" /> Withdrawing...</span> : "Withdraw ETH"}
      </button>
      {!hasBalance && <p className="withdraw-empty">No ETH in the jar yet.</p>}
      {status && <div className={"tx-status " + statusMap[status].cls}>{statusMap[status].text}</div>}
    </div>
  );
}
