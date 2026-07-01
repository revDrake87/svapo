export const getApiUrl = () => {
  // Se siamo in locale (sviluppo o test LAN), usiamo il percorso relativo standard
  if (
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1" || 
    window.location.hostname.startsWith("192.168.")
  ) {
    return "/api"; 
  }

  // IN PRODUZIONE: Punta direttamente all'URL di Railway, senza aggiungere un secondo "/api" alla fine
  return "https://svapo-production.up.railway.app";
};