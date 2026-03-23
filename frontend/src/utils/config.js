// ─── Contract Config ──────────────────────────────────────────────────────────
// Update CONTRACT_ADDRESS after you deploy with:
//   npx hardhat run scripts/deploy.js --network base-sepolia

export const CONTRACT_ADDRESS = "0xAb80113976754CA972936c5674bB1B82b2a150Bd"; // ← replace after deploy

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_jarName", type: "string" },
      { internalType: "string", name: "_jarDescription", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "sender", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "string", name: "message", type: "string" },
      { indexed: false, internalType: "string", name: "emoji", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "TipReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTipCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "offset", type: "uint256" },
      { internalType: "uint256", name: "limit", type: "uint256" },
    ],
    name: "getTips",
    outputs: [
      {
        components: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "string", name: "message", type: "string" },
          { internalType: "string", name: "emoji", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct TipJar.Tip[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "jarDescription",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "jarName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "message", type: "string" },
      { internalType: "string", name: "emoji", type: "string" },
    ],
    name: "tip",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTipCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTipsReceived",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// ─── Chain Config ─────────────────────────────────────────────────────────────
export const BASE_SEPOLIA = {
  id: 84532,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.base.org"] },
    public: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: {
    default: { name: "Basescan", url: "https://sepolia.basescan.org" },
  },
  testnet: true,
};

export const BASE_MAINNET = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.base.org"] },
    public: { http: ["https://mainnet.base.org"] },
  },
  blockExplorers: {
    default: { name: "Basescan", url: "https://basescan.org" },
  },
};

export const ACTIVE_CHAIN = BASE_SEPOLIA; // switch to BASE_MAINNET for prod
