/* 
    This function takes a number and converts it to a string with a dollar sign and the appropriate suffix (k, M, B, T)
    Example: 1000 -> $1k
    Example: 1000000 -> $1M
    Example: 1000000000 -> $1B
    Example: 1000000000000 -> $1T
    Example: 1000000000000000 -> $1000T
    Example: 1000000000000000000 -> $1000000T
    Example: 1000000000000000000000 -> $1000000000T
    Example: 1000000000000000000000000 -> $1000000000000T
    Example: 1000000000000000000000000000 -> $1000000000000000T
    Example: 1000000000000000000000000000000 -> $1000000000000000000
*/
export default function formatNumber(num: number): string {
  // Always round the number to two decimal places
  num = Math.round(num * 100) / 100;

  if (num >= 1e3 && num < 1e6) return "$" + (num / 1e3).toFixed(1) + "k"; // thousands
  if (num >= 1e6 && num < 1e9) return "$" + (num / 1e6).toFixed(1) + " Million"; // millions
  if (num >= 1e9 && num < 1e12)
    return "$" + (num / 1e9).toFixed(1) + " Billion"; // billions
  if (num >= 1e12) return "$" + (num / 1e12).toFixed(1) + " Trillion"; // trillions

  return "$" + num.toString();
}
