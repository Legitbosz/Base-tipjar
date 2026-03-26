/**
 * Formats an ETH amount for display
 * e.g. "0.001000000000000000" → "0.001 ETH"
 *
 * @param {string|number} amount - ETH amount as string or number
 * @param {number} decimals - Decimal places to show (default 4)
 * @param {boolean} showSymbol - Whether to append "ETH" (default true)
 * @returns {string}
 */
export function formatEther(amount, decimals = 4, showSymbol = true) {
  if (!amount && amount !== 0) return showSymbol ? "0 ETH" : "0";
  const num = parseFloat(amount);
  if (isNaN(num)) return showSymbol ? "0 ETH" : "0";

  // Remove trailing zeros
  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });

  return showSymbol ? `${formatted} ETH` : formatted;
}

/**
 * Formats a large ETH total with K/M suffix
 * e.g. 1500 → "1.5K ETH"
 *
 * @param {string|number} amount
 * @returns {string}
 */
export function formatEtherCompact(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return "0 ETH";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M ETH`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K ETH`;
  return `${num.toFixed(4)} ETH`;
}

/**
 * Returns a USD estimate given ETH amount and price
 * @param {string|number} ethAmount
 * @param {number} ethPrice - Current ETH price in USD
 * @returns {string}
 */
export function ethToUsd(ethAmount, ethPrice) {
  if (!ethPrice) return "";
  const usd = parseFloat(ethAmount) * ethPrice;
  if (isNaN(usd)) return "";
  return `≈ $${usd.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}
