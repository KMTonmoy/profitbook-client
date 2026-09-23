const NAMED: { name: string; hex: string }[] = [
  { name: "Green", hex: "#16a34a" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Amber", hex: "#ca8a04" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Red", hex: "#dc2626" },
  { name: "Cyan", hex: "#0891b2" },
  { name: "Pink", hex: "#db2777" },
  { name: "Slate", hex: "#64748b" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Lime", hex: "#65a30d" },
  { name: "Rose", hex: "#e11d48" },
  { name: "Sky", hex: "#0284c7" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Fuchsia", hex: "#c026d3" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
];

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 6 && clean.length !== 3) return null;
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function colorName(hex?: string): string {
  if (!hex) return "—";
  const target = hexToRgb(hex);
  if (!target) return hex;

  let best = NAMED[0];
  let bestDist = Infinity;

  for (const c of NAMED) {
    const rgb = hexToRgb(c.hex);
    if (!rgb) continue;
    const d =
      (target[0] - rgb[0]) ** 2 +
      (target[1] - rgb[1]) ** 2 +
      (target[2] - rgb[2]) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best.name;
}
