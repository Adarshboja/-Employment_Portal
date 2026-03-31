export const API_BASE = import.meta.env.VITE_API_BASE || '';

export const assetUrl = (path = '') => {
  if (!path) return '';
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${clean}`;
};
