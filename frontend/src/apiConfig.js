export const getApiUrl = () => {
  // In production (Firebase), VITE_API_URL points to the Railway backend.
  // In local dev (Vite dev server or Docker), falls back to relative /api,
  // which is proxied by vite.config.js (dev) or nginx.conf (Docker).
  return import.meta.env.VITE_API_URL || `/api`;
};
