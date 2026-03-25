/**
 * INTERSWITCH WEBPAY CONFIGURATION (PRODUCTION TEMPLATE)
 * 
 * In a live environment, these values would be provided by the
 * Interswitch Merchant Dashboard and stored securely in environment variables.
 */

export const INTERSWITCH_CONFIG = {
  // Found in Interswitch Developer Console
  MERCHANT_CODE: import.meta.env.VITE_INTERSWITCH_MERCHANT_CODE || "MX123456",
  PAY_ITEM_ID: import.meta.env.VITE_INTERSWITCH_PAY_ITEM_ID || "101",
  
  // Terminal ID & Currency
  TERMINAL_ID: "7000000001",
  CURRENCY: "566", // NGN (Nigerian Naira)
  
  // Redirect URLs
  CALLBACK_URL: "http://localhost:5173/appointments",
  
  // API Endpoints (Sandbox/Live)
  GATEWAY_URL: "https://newwebpay.interswitchng.com/collections/w/pay",
  
  // USSD Meta (For our unique MediConnect Offline mode)
  USSD_PREFIX: "*723*",
  USSD_SERVICE_CODE: "492",

  // SIMULATED SECURITY (For Buildathon Demo)
  // This function demonstrates our ability to implement Interswitch's SHA-512 hashing requirements
  generateDemoHash: (txnRef, amount) => {
    const raw = `${txnRef}${INTERSWITCH_CONFIG.MERCHANT_CODE}${INTERSWITCH_CONFIG.PAY_ITEM_ID}${amount}${INTERSWITCH_CONFIG.CALLBACK_URL}`;
    // In production, we would use crypto-js or window.crypto to generate a real SHA-512
    return "HASH_SIM_" + btoa(raw).substr(0, 32).toUpperCase();
  }
};

export default INTERSWITCH_CONFIG;
