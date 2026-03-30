import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, ACTIVE_CHAIN } from "./utils/config";
import { useResolvedName } from "./hooks/useResolvedName";
import "./App.css";

// Always load these immediately — they're above the fold
import Mascot from "./components/Mascot";
import TipForm from "./components/TipForm";

// Lazy load these — they're below the fold or conditional
const TipFeed = lazy(() => import("./components/TipFeed"));
const Stats = lazy(() => import("./components/Stats"));
const WithdrawButton = lazy(() => import("./components/WithdrawButton"));

// Simple inline fallback spinner
function Skeleton() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      borderRadius: 16,
      height: 120,
      animation: "shimmer 1.2s infinite",
    }} />
  );
}

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [tips, setTips] = useState([]);
  const [stats, setStats] = useState({ total: "0", count: 0, balance: "0" });
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [newTip, setNewTip] = useState(null);
  const [contractOwner, setContractOwner] = useState(null);

  const isCorrectChain = chainId === ACTIVE_CHAIN.id;

  useEffect(() => {
    const readProvider = new ethers.JsonRpcProvider(ACTIVE_CHAIN.rpcUrls.default.http[0]);
    const readContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider);
    setContract(readContract);
    fetchData(readContract);
    const interval = setInterval(() => fetchData(readContract), 15000);
    return () => { clearInterval(interval); readContract.removeAllListeners(); };
  }, []);

  const fetchData = useCallback(async (c) => {
    try {
      // Fetch all contract data in parallel for performance
      const [rawTips, totalReceived, tipCount, balance] = await Promise.all([
        c.getTips(0, 50), c.totalTipsReceived(), c.totalTipCount(), c.getBalance(),
      ]);
      setTips(rawTips.map((t) => ({
        sender: t.sender,
        amount: ethers.formatEther(t.amount),
        message: t.message,
        emoji: t.emoji,
        timestamp: Number(t.timestamp),
      })));
      setStats({
        total: ethers.formatEther(totalReceived),
        count: Number(tipCount),
        balance: ethers.formatEther(balance),
      });
      const owner = await c.owner();
      setContractOwner(owner.toLowerCase());
      setAppReady(true);
    } catch (err) { console.error("Failed to fetch data:", err); setAppReady(true); }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) { alert("Please install a Web3 wallet like Rabby!"); return; }
    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await web3Provider.send("eth_requestAccounts", []);
      const network = await web3Provider.getNetwork();
      const web3Signer = await web3Provider.getSigner();
      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      document.title = "TipJar — Connected";
      const rw = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Signer);
      setContract(rw);
      toast("Wallet connected! 🎉", accounts[0].slice(0,6) + "..." + accounts[0].slice(-4), "success");
      window.ethereum.on("accountsChanged", (accs) => {
        setAccount(accs[0] || null);
        if (!accs[0]) disconnect();
      });
      window.ethereum.on("chainChanged", () => window.location.reload());
    } catch (err) { console.error(err); }
  };

  const disconnect = () => {
    setProvider(null); setSigner(null); setAccount(null); setChainId(null);
    document.title = "TipJar — Base";
    toast("Wallet disconnected", "", "info");
  };

  const switchToBase = async () => {
    toast("Switching to Base...", "Please confirm in your wallet", "pending", 5000);
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x" + ACTIVE_CHAIN.id.toString(16),
          chainName: ACTIVE_CHAIN.name,
          nativeCurrency: ACTIVE_CHAIN.nativeCurrency,
          rpcUrls: ACTIVE_CHAIN.rpcUrls.default.http,
          blockExplorerUrls: [ACTIVE_CHAIN.blockExplorers.default.url],
        }],
      });
    } catch (err) { console.error(err); }
  };

  const sendTip = async ({ amount, message, emoji }) => {
    if (!signer || !isCorrectChain) return;
    setLoading(true); setTxStatus("pending");
    toast("Transaction pending...", "Waiting for confirmation.", "pending", 10000);
    try {
      const rwContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await rwContract.tip(message, emoji, { value: ethers.parseEther(amount) });
      await tx.wait();
      setTxStatus("success");
      toast("Tip sent! 🎉", "Your tip is now on-chain forever.", "success");
      setTimeout(() => setTxStatus(null), 4000);
    } catch (err) {
      console.error(err);
      setTxStatus("error");
      toast("Transaction failed", "Please try again.", "error");
      setTimeout(() => setTxStatus(null), 4000);
    } finally { setLoading(false); }
  };

  const { name: resolvedAccount } = useResolvedName(account);

  if (!appReady) return <AppSkeleton />;

  return (
    <div className="app">
      <div className="noise" />
      <header className="header">
        <div className="header-left">
          <div className="logo" style={{cursor:"pointer"}} onClick={() => window.scrollTo({top:0, behavior:"smooth"})}>
            <span className="logo-icon">🫙</span>
            <span className="logo-text">TipJar</span>
            <span className="logo-badge">Base</span>
          </div>
        </div>
        <div className="header-right">
          {account ? (
            <div className="wallet-connected">
              {!isCorrectChain && (
                <button className="btn-switch" onClick={switchToBase}>Switch to {ACTIVE_CHAIN.name}</button>
              )}
              <div className="wallet-pill">
                <span className="wallet-dot" />
                <span title={account}>{resolvedAccount}</span>
              </div>
              <button className="btn-disconnect" onClick={disconnect}>✕</button>
            </div>
          ) : (
            <button className="btn-connect" onClick={connectWallet} aria-label="Connect Web3 wallet">Connect Wallet</button>
          )}
        </div>
      </header>

      <section className="hero hero-with-mascot">
        <div className="hero-content">
          <div className="hero-tag">Built on Base ⚡ · 10 Contracts Deployed</div>
          <h1 className="hero-title">Drop a tip.<br />Leave a mark.</h1>
          <p className="hero-sub">Send on-chain tips with a message and emoji. Every tip lives forever on Base — permanent, transparent, unstoppable.</p>
        </div>
        <div className="hero-mascot-wrap">
          <Mascot tipCount={stats.count} txStatus={txStatus} />
        </div>
      </section>

      <main className="main-grid">
        <div className="left-col">
          <Suspense fallback={<Skeleton />}>
            <Stats stats={stats} />
          </Suspense>
          <TipForm
            onSend={sendTip}
            loading={loading}
            txStatus={txStatus}
            account={account}
            isCorrectChain={isCorrectChain}
            onConnect={connectWallet}
            onSwitch={switchToBase}
            chainName={ACTIVE_CHAIN.name}
            signer={signer}
          />
          {account && contractOwner && account.toLowerCase() === contractOwner && (
            <Suspense fallback={<Skeleton />}>
              <WithdrawButton account={account} signer={signer} balance={stats.balance} />
            </Suspense>
          )}
        </div>
        <div className="right-col">
          <Suspense fallback={<Skeleton />}>
            <TipFeed tips={tips} newTip={newTip} />
          </Suspense>
        </div>
      </main>

      <footer className="footer">
        <span>TipJar v1.0 · Built on {ACTIVE_CHAIN.name} · Open source</span>
        <a href={ACTIVE_CHAIN.blockExplorers.default.url + "/address/" + CONTRACT_ADDRESS} target="_blank" rel="noopener noreferrer" title="View TipJar contract on Basescan">
          View Contract ↗
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
      </footer>
    </div>
  );
}
