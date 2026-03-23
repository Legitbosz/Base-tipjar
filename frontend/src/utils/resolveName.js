import { createPublicClient, http, encodePacked, keccak256, namehash } from "viem";
import { base } from "viem/chains";

const baseClient = createPublicClient({ chain: base, transport: http("https://base-mainnet.g.alchemy.com/v2/WITyB0gzEsiE2NOmbmD6J") });

const BASENAME_L2_RESOLVER = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";

const ABI = [{ inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" }];

function convertReverseNodeToBytes(address) {
  const addressFormatted = address.toLowerCase().replace("0x", "");
  const addressNode = keccak256(encodePacked(["string"],[addressFormatted]));
  const chainName = "8453.reverse";
  const domainNode = namehash(chainName);
  return keccak256(encodePacked(["bytes32","bytes32"],[domainNode, addressNode]));
}

const cache = new Map();

export async function resolveName(address) {
  if (!address) return ""; console.log("resolving:", address);
  if (cache.has(address)) return cache.get(address);
  const short = address.slice(0,6) + "..." + address.slice(-4);
  try {
    const node = convertReverseNodeToBytes(address);
    const name = await baseClient.readContract({ address: BASENAME_L2_RESOLVER, abi: ABI, functionName: "name", args: [node] });
    if (name && name.length > 0) { cache.set(address, name); return name; }
  } catch(e) { console.log("basename lookup failed:", e.message); }
  cache.set(address, short);
  return short;
}
