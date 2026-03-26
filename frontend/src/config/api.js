/**
 * API CONFIGURATION
 * 
 * To switch to production, change ENVIRONMENT to "production" 
 * and set your Render/Railway backend URL.
 */

const ENVIRONMENT = "local"; // "local" or "production"

const CONFIG = {
  local: {
    API_BASE_URL: "http://localhost:8080/api"
  },
  production: {
    // Replace with your actual Render/Railway backend URL
    API_BASE_URL: "https://your-mediconnect-api.onrender.com/api"
  }
};

export const API_BASE_URL = CONFIG[ENVIRONMENT].API_BASE_URL;
export default API_BASE_URL;
