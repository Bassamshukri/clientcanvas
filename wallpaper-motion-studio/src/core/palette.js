import { clamp } from "./math.js";

export function lighten(hex, amount = 0.1) {
  const rgb = hexToRgb(hex);
  rgb.r = clamp(rgb.r + 255 * amount, 0, 255);
  rgb.g = clamp(rgb.g + 255 * amount, 0, 255);
  rgb.b = clamp(rgb.b + 255 * amount, 0, 255);
  return rgbToHex(rgb);
}

export function darken(hex, amount = 0.1) {
  return lighten(hex, -amount);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function componentToHex(c) {
  const hex = Math.round(c).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex({ r, g, b }) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export const PALETTES = {
  solar: {
    bg: "#0D0D0D",
    shape1: "#FFD700",
    shape2: "#FFA500",
    shape3: "#FF4500",
  },
  candy: {
    bg: "#1A0033",
    shape1: "#FF00FF",
    shape2: "#00FFFF",
    shape3: "#FFFF00",
  },
  sunset: {
    bg: "#2B0F1C",
    shape1: "#F25C54",
    shape2: "#F7B267",
    shape3: "#F4845F",
  },
  sky: {
    bg: "#0B1D26",
    shape1: "#8ECAE6",
    shape2: "#219EBC",
    shape3: "#FFB703",
  },
  ukraine: {
    bg: "#000000",
    shape1: "#0057B7",
    shape2: "#FFD700",
    shape3: "#FFFFFF",
  },
  forest: {
    bg: "#0D1B1E",
    shape1: "#606C38",
    shape2: "#283618",
    shape3: "#DDA15E",
  },
  obsidian: {
    bg: "#050505",
    shape1: "#222222",
    shape2: "#444444",
    shape3: "#666666",
  },
  earth: {
    bg: "#2A2420",
    shape1: "#704214",
    shape2: "#A0522D",
    shape3: "#BC8F8F",
  },
  neon: {
    bg: "#000000",
    shape1: "#39FF14",
    shape2: "#FF1493",
    shape3: "#00FFFF",
  },
};

export function getPalette(mode = "solar", rng) {
  if (mode === "random" && rng) {
    return {
      bg: "#0d1117",
      shape1: `hsl(${rng.int(0, 360)}, 70%, 50%)`,
      shape2: `hsl(${rng.int(0, 360)}, 70%, 50%)`,
      shape3: `hsl(${rng.int(0, 360)}, 70%, 50%)`,
    };
  }
  return PALETTES[mode] || PALETTES.solar;
}
