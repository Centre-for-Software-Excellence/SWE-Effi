import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { tokens } from '@/styles/tokens';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTitleFromFilename(filename: string): string {
  return filename
    .replace(/\.(md|mdx|tsx)$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// helpers -------------------------------------------------------------------
type HSL = { h: number; s: number; l: number };

function hexToHsl(hex: string): HSL {
  // Strip leading # and parse
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex({ h, s, l }: HSL): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))),
    );
  return `#${[f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

export function createColorGenerator(baseHex?: string[]) {
  if (!baseHex) {
    baseHex = Object.values(tokens).flat();
  }
  const baseHsl = baseHex.map(hexToHsl);
  const φ = 137.508;
  let index = 0;

  return function nextColor(): string {
    const cycle = Math.floor(index / baseHsl.length);
    const pos = index % baseHsl.length;
    index += 1;

    if (cycle === 0) return baseHex[pos];

    const { h, s, l } = baseHsl[pos];
    const newHue = (h + cycle * φ) % 360;
    return hslToHex({ h: newHue, s, l });
  };
}

export function formatScore(score: string | undefined): string {
  const res = !score
    ? 'N/A'
    : parseFloat(score).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
  return res;
}
