export const getApiUrl = () => {
  return `${window.location.protocol}//${window.location.hostname}:8080/api`;
};

export const getStoreCode = () => {
  return import.meta.env.VITE_STORE_CODE || 'PROFESSIONAL_VAPE';
};
