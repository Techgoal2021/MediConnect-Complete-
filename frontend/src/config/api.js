const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`,
  AI_URL: import.meta.env.VITE_AI_URL || `${window.location.origin}/api/ai`
};

export default API_CONFIG.BASE_URL;
