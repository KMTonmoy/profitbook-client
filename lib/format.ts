export const formatCurrency = (amount: number, currency = "BDT"): string => {
  const symbol = currency === "BDT" ? "৳" : currency;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  return `${amount < 0 ? "-" : ""}${symbol} ${formatted}`;
};

export const formatNumber = (n: number): string =>
  n.toLocaleString("en-IN");

export const formatPercent = (n: number, d = 1): string =>
  `${n >= 0 ? "+" : ""}${n.toFixed(d)}%`;

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateShort = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();