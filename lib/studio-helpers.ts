export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

export function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function deepClone<T>(value: T): T {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatDate(value: string | number | Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export const FONT_OPTIONS = [
  "Inter",
  "Arial",
  "Montserrat",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Playfair Display"
];

export const BLANK_PRESETS = [
  {
    id: "blank-square",
    name: "Square Post",
    description: "1080 × 1080",
    width: 1080,
    height: 1080
  },
  {
    id: "blank-story",
    name: "Story",
    description: "1080 × 1920",
    width: 1080,
    height: 1920
  },
  {
    id: "blank-landscape",
    name: "Landscape",
    description: "1600 × 900",
    width: 1600,
    height: 900
  }
];

export const BUILTIN_TEMPLATES = [
  {
    id: "promo-launch",
    name: "Launch Promo",
    width: 1080,
    height: 1080,
    background: "#0f172a",
    accent: "#6d5efc",
    headline: "New launch",
    body: "Announce your next campaign with a strong headline and CTA."
  },
  {
    id: "quote-card",
    name: "Quote Card",
    width: 1080,
    height: 1080,
    background: "#111827",
    accent: "#19c29b",
    headline: "Customer love",
    body: "Turn testimonials into on-brand shareable content."
  },
  {
    id: "story-sale",
    name: "Story Sale",
    width: 1080,
    height: 1920,
    background: "#1e1b4b",
    accent: "#f6b64b",
    headline: "Limited offer",
    body: "Build fast vertical assets for stories and ads."
  }
];