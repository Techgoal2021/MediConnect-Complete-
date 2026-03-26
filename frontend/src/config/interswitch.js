/**
 * INTERSWITCH WEBPAY CONFIGURATION (SANDBOX/PRODUCTION READY)
 * 
 * SECURITY ALERT: Sensitive operations like Hash generation and Passport 
 * token management are now handled by the Backend (src/utils/interswitch.js)
 * to comply with PCI-DSS and Interswitch security standards.
 */

export const INTERSWITCH_CONFIG = {
  // Publicly safe identifiers
  MERCHANT_CODE: import.meta.env.VITE_INTERSWITCH_MERCHANT_CODE || "MX26070",
  PAY_ITEM_ID: import.meta.env.VITE_INTERSWITCH_PAY_ITEM_ID || "101",
  
  // Terminal ID & Currency (NGN)
  TERMINAL_ID: "7000000001",
  CURRENCY: "566",
  
  // Redirect URLs (Handles completion and failure)
  CALLBACK_URL: window.location.origin + "/appointments",
  
  // API Endpoints
  GATEWAY_URL: "https://newwebpay.interswitchng.com/collections/w/pay",
  
  // USSD Meta (From Enyata Workshop Specs)
  USSD_PREFIX: "*723*",
  USSD_SERVICE_CODE: "492",

  /**
   * Utility to convert amount to Kobo (K)
   * Interswitch requirement: Value must be an integer.
   */
  amountToKobo: (naira) => Math.round(parseFloat(naira) * 100),

  /**
   * Fetches required payment parameters from the backend.
   * This includes the cryptographically secure SHA-512 hash.
   */
  getPaymentParams: async (appointmentId, amount, token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appointmentId, amount })
      });
      
      if (!response.ok) throw new Error("Failed to initialize payment hash from server");
      return await response.json();
    } catch (err) {
      console.error("Payment Config Error:", err);
      throw err;
    }
  }
};

export default INTERSWITCH_CONFIG;
