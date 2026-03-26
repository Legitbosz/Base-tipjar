# 🫙 TipJar — On-Chain Tipping on Base

TipJar is a decentralized tipping platform built on [Base](https://base.org). Send on-chain tips with a message and emoji — every tip lives forever on Base.

![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge)
![Ethers](https://img.shields.io/badge/Ethers.js-6-3C3C3D?style=for-the-badge)

---

## ✨ Features

- 💸 Send ETH tips with a custom message and emoji
- 🔵 Resolves Base names (Basenames) automatically
- 🕺 Animated mascot that reacts to every tip
- 📜 Live on-chain tip feed
- 📊 Real-time stats (total tips, count, balance)
- 🔐 Owner withdrawal button
- ⚡ Built on Base for fast, cheap transactions

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Web3 wallet (Rabby, MetaMask, etc.)
- ETH on Base network

### Installation

```bash
git clone https://github.com/yourusername/Base-Repo.git
cd Base-Repo/frontend
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Fill in your values in `.env`.

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for production

```bash
npm run build
```

---

## 🏗 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite 5 |
| Styling | CSS Variables + Custom Animations |
| Web3 | Ethers.js v6 + Viem |
| Network | Base Mainnet |
| Name Resolution | Basenames (Base ENS) |
| Wallet | Rabby / MetaMask via window.ethereum |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Mascot.jsx        # Dancing mascot
│   │   ├── TipForm.jsx       # Send tip form
│   │   ├── TipFeed.jsx       # Live tip feed
│   │   ├── Stats.jsx         # Stats display
│   │   └── WithdrawButton.jsx
│   ├── hooks/
│   │   └── useResolvedName.js # Basename resolution hook
│   ├── utils/
│   │   ├── config.js         # Contract config
│   │   ├── resolveName.js    # Basename resolver
│   │   ├── formatAddress.js  # Address formatting
│   │   └── formatEther.js    # ETH formatting
│   ├── App.jsx
│   └── App.css
└── vite.config.js
```

---

## 🔗 Contract

Deployed on Base Mainnet. View on [Basescan](https://basescan.org).

---

## 📄 License

MIT
