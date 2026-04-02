import crypto from "node:crypto";

export function generateReviewToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function buildPublicReviewUrl(token: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}/review/${token}`;
}

export function getDefaultReviewExpiry(days = 7) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt.toISOString();
}