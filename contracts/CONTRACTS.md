# TipJar Smart Contracts

A collection of 10 on-chain tipping contracts deployed on Base Mainnet.

## Contracts

| Contract | Address | Description |
|----------|---------|-------------|
| TipJar | `0x66F4fb4C8F1B1D497D34855f3c7d41934b8A11EA` | Original tip jar with messages and emojis |
| TipSplitter | `0x8C1F3054739342A540c1dfd581b5efd03D1de5c1` | Split tips between multiple wallets |
| TipLeaderboard | `0x0886c4D0364BE61DC843833B0938eDC01Ca65571` | On-chain leaderboard of top tippers |
| TipVault | `0xda30b7A46a6706262c45A9ab0129114632DCC1C6` | Time-locked tip vault (7 days) |
| TipBadge | `0xcA9B3eD9c9e31820B6cA026da6C8e94e8f954dFd` | Badge rewards for tippers |
| TipMultiJar | TBD | Multiple jars for different creators |
| TipEscrow | TBD | Tips held in escrow until task complete |
| TipDAO | TBD | Community voting on fund usage |
| TipSubscription | TBD | Recurring subscription tips |
| TipWhitelist | TBD | Exclusive whitelist-only tipping |
| TipMessage | TBD | Tips with public/private messages |

## Setup

```bash
npm install
cp .env.example .env
# Fill in PRIVATE_KEY, BASE_MAINNET_RPC_URL, BASESCAN_API_KEY
```

## Deploy

```bash
npx hardhat run scripts/deployTipJar.js --network base-mainnet
npx hardhat run scripts/deployTipSplitter.js --network base-mainnet
npx hardhat run scripts/deployTipLeaderboard.js --network base-mainnet
npx hardhat run scripts/deployTipVault.js --network base-mainnet
npx hardhat run scripts/deployTipBadge.js --network base-mainnet
npx hardhat run scripts/deployTipMultiJar.js --network base-mainnet
npx hardhat run scripts/deployTipEscrow.js --network base-mainnet
npx hardhat run scripts/deployTipDAO.js --network base-mainnet
npx hardhat run scripts/deployTipSubscription.js --network base-mainnet
npx hardhat run scripts/deployTipWhitelist.js --network base-mainnet
npx hardhat run scripts/deployTipMessage.js --network base-mainnet
```

## Test

```bash
npx hardhat test
```

## Network

All contracts deployed on **Base Mainnet** (chainId: 8453)
