export const getApiUrl = () => {
  // Se siamo in locale (sviluppo sul PC o test su LAN), usiamo il percorso relativo
  if (
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1" || 
    window.location.hostname.startsWith("192.168.")
  ) {
    return "/api"; 
  }

  // IN PRODUZIONE: Punta direttamente all'URL del tuo backend su Railway
  return "https://svapo-production.up.railway.app/api";
};