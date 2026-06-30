export const getApiUrl = () => {
  // Se siamo in locale (localhost o IP della LAN), usiamo il percorso relativo o localhost
  if (
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1" || 
    window.location.hostname.startsWith("192.168.")
  ) {
    return "/api"; 
  }

  // IN PRODUZIONE: Forza l'URL reale del tuo backend su Railway
  return "https://svapo-production.up.railway.app/api";
};