const HANDLE_PATTERN = /^[a-z0-9_]{3,24}$/;
const ALLOWED_THEMES = new Set(["light", "bloom", "paper", "sea"]);

export function normalizeHandle(value: unknown) {
  if (typeof value !== "string") return null;
  const handle = value.trim().toLowerCase().replace(/^@/, "");
  return HANDLE_PATTERN.test(handle) ? handle : null;
}

export function normalizeMessage(value: unknown) {
  if (typeof value !== "string") return null;
  const message = value.trim().replace(/\s+/g, " ");
  return message.length >= 1 && message.length <= 420 ? message : null;
}

export function normalizeTheme(value: unknown) {
  return typeof value === "string" && ALLOWED_THEMES.has(value) ? value : "light";
}

export function generateInboxKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashInboxKey(inboxKey: unknown) {
  if (typeof inboxKey !== "string" || inboxKey.length < 24 || inboxKey.length > 128) {
    return null;
  }
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(inboxKey)
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}
