/**
 * Shortens an Ethereum address to a readable format
 * e.g. 0x1234567890abcdef → 0x1234...cdef
 *
 * @param {string} address - Full Ethereum address
 * @param {number} start - Characters to show at start (default 6)
 * @param {number} end - Characters to show at end (default 4)
 * @returns {string} Shortened address
 */
export function formatAddress(address, start = 6, end = 4) {
  if (!address) return "";
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Checks if a string is a valid Ethereum address
 * @param {string} address
 * @returns {boolean}
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Checks if two addresses are the same (case-insensitive)
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function isSameAddress(a, b) {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}
