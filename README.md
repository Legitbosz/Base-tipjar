# 🫙 TipJar — Built on Base

A decentralized tip jar dApp on [Base](https://base.org) (Ethereum L2). Send ETH tips with a message and emoji — every tip lives on-chain forever and shows up in a real-time public feed.

![Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=flat-square)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square)

---

## ✨ Features

- **Send on-chain tips** with a custom message (up to 280 chars) and emoji
- **Real-time feed** — tips stream in live via contract events
- **Stats dashboard** — total ETH tipped, tip count, balance in jar
- **Owner withdrawal** — creator can pull accumulated ETH
- **Base Sepolia testnet** ready, one config change for mainnet
- **Wallet connect** — MetaMask / any injected Web3 wallet

---

## 🗂 Project Structure

```
tipjar/
├── contracts/
│   └── TipJar.sol          # Solidity smart contract
├── scripts/
│   └── deploy.js           # Hardhat deployment script
├── test/
│   └── TipJar.test.js      # Contract tests
├── frontend/
│   └── src/
│       ├── App.jsx          # Main app + wallet logic
│       ├── App.css          # Styles
│       ├── components/
│       │   ├── TipForm.jsx  # Tip sending form
│       │   ├── TipFeed.jsx  # Live feed of tips
│       │   └── Stats.jsx    # Stats cards
│       └── utils/
│           └── config.js    # Contract ABI + chain config
├── hardhat.config.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Fill in PRIVATE_KEY and BASESCAN_API_KEY
```

### 3. Compile & test the contract

```bash
npm run compile
npm run test
```

### 4. Deploy to Base Sepolia testnet

```bash
npm run deploy:testnet
```

Get testnet ETH from the [Base Sepolia faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet).

### 5. Update the frontend config

Open `frontend/src/utils/config.js` and replace:
```js
export const CONTRACT_ADDRESS = "0x..."; // ← paste your deployed address
```

### 6. Run the frontend

```bash
npm run frontend
```

Visit `http://localhost:5173` 🎉

---

## 📜 Contract Reference

**TipJar.sol** — deployed on Base Sepolia

| Function | Description |
|---|---|
| `tip(message, emoji)` | Send ETH tip with message & emoji (payable) |
| `withdraw()` | Owner withdraws all ETH from the jar |
| `getTips(offset, limit)` | Paginated tip history (newest first) |
| `getTipCount()` | Total number of tips |
| `getBalance()` | Current ETH balance in contract |

**Events emitted:**
- `TipReceived(sender, amount, message, emoji, timestamp)`
- `Withdrawn(owner, amount)`

---

## 🔗 Deployment

| Network | Status |
|---|---|
| Base Sepolia (testnet) | ✅ Ready |
| Base Mainnet | Change `ACTIVE_CHAIN` in `config.js` |

To verify on Basescan after deploying:
```bash
npx hardhat verify --network base-sepolia <CONTRACT_ADDRESS> "My Tip Jar" "Buy me a coffee"
```

---

## 🛣 Roadmap ideas

- [ ] Multi-creator factory contract (deploy a jar for anyone)
- [ ] Leaderboard of top tippers
- [ ] ENS / Basename display instead of raw addresses  
- [ ] IPFS avatar upload per tip
- [ ] Email/push notifications via XMTP when a tip arrives

---

## 📄 License

MIT
