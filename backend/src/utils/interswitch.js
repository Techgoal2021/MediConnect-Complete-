const crypto = require('crypto');
const https = require('https');

// Interswitch Configuration (Sandbox/Production Ready)
const INTERSWITCH_ENV = process.env.INTERSWITCH_ENV || 'sandbox';

const ENDPOINTS = {
    sandbox: {
        PASSPORT_URL: "https://sandbox.interswitchng.com/passport/oauth/token",
        INQUIRY_URL: "https://sandbox.interswitchng.com/collections/api/v1/gettransaction.json",
        WEBPAY_URL: "https://newwebpay.interswitchng.com/collections/w/pay"
    },
    production: {
        PASSPORT_URL: "https://passport.interswitchng.com/passport/oauth/token",
        INQUIRY_URL: "https://webpay.interswitchng.com/collections/api/v1/gettransaction.json",
        WEBPAY_URL: "https://webpay.interswitchng.com/collections/w/pay"
    }
};

const INTERSWITCH_CONFIG = {
    MERCHANT_CODE: process.env.INTERSWITCH_MERCHANT_CODE || "MX26070",
    PAY_ITEM_ID: process.env.INTERSWITCH_PAY_ITEM_ID || "101",
    CLIENT_ID: process.env.INTERSWITCH_CLIENT_ID || "IKIA65707722479269AD6A62FC800929FF8E69308644",
    CLIENT_SECRET: process.env.INTERSWITCH_CLIENT_SECRET || "6B6E910609D9B7F1388D37F20D2389379CD2C646672304892",
    // Standard Sandbox MAC Key/Secret Key
    SECRET_KEY: process.env.INTERSWITCH_SECRET_KEY || "D3D1D05AFE42AD508181A42974315A8AF500B5383084687C5824C6534433D48B39B607B0B669866FDB1F0E463177726590F845063D2EC8428800B8DE03CA7EEF", 
    
    // Environment specific endpoints
    ...ENDPOINTS[INTERSWITCH_ENV]
};

/**
 * Native Helper to handle HTTPS requests without Axios
 */
const makeRequest = (url, method, headers, data = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: method,
            headers: headers
        };
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = body ? JSON.parse(body) : {};
                    if (res.statusCode >= 400) {
                        return reject({ response: { data: parsed, status: res.statusCode }, message: `HTTP Error ${res.statusCode}` });
                    }
                    resolve({ data: parsed });
                } catch (e) {
                    resolve({ data: body }); // Return raw body if not JSON
                }
            });
        });
        req.on('error', (err) => reject({ message: err.message }));
        if (data) req.write(data);
        req.end();
    });
};

/**
 * Generates SHA-512 Hash for WebPay Integration
 */
const generateSHA512Hash = (txnRef, amountInKobo, callbackUrl) => {
    const raw = `${txnRef}${INTERSWITCH_CONFIG.MERCHANT_CODE}${INTERSWITCH_CONFIG.PAY_ITEM_ID}${amountInKobo}${callbackUrl}${INTERSWITCH_CONFIG.SECRET_KEY}`;
    return crypto.createHash('sha512').update(raw).digest('hex');
};

/**
 * Obtains OAuth2 Bearer Token from Interswitch Passport
 */
const getPassportToken = async () => {
    try {
        const authHeader = Buffer.from(`${INTERSWITCH_CONFIG.CLIENT_ID}:${INTERSWITCH_CONFIG.CLIENT_SECRET}`).toString('base64');
        const body = 'grant_type=client_credentials&scope=profile';
        
        const response = await makeRequest(INTERSWITCH_CONFIG.PASSPORT_URL, 'POST', {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(body)
        }, body);

        return response.data.access_token;
    } catch (error) {
        console.error("Interswitch Passport Error:", error.response?.data || error.message);
        throw new Error("Failed to obtain Interswitch Passport token");
    }
};

/**
 * Queries Interswitch Inquiry API to verify transaction status
 */
const queryTransactionStatus = async (txnRef, amountInKobo) => {
    try {
        // If DEMO_MODE is true, we simulate a successful response for the presentation
        if (process.env.DEMO_MODE === 'true') {
            console.log(`[DEMO MODE] Simulating successful verification for txnRef: ${txnRef}`);
            return { 
                status: "SUCCESS", 
                mock: true, 
                responseCode: "00", 
                message: "Simulated Success (Demo Mode Active)" 
            };
        }

        const token = await getPassportToken();
        const url = `${INTERSWITCH_CONFIG.INQUIRY_URL}?merchantcode=${INTERSWITCH_CONFIG.MERCHANT_CODE}&transactionreference=${txnRef}&amount=${amountInKobo}`;
        
        console.log(`Calling Interswitch Inquiry API: ${url}`);
        const response = await makeRequest(url, 'GET', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        const data = response.data;
        // Interswitch Success Code is "00"
        const isSuccess = data.ResponseCode === "00" || data.ResponseCode === "0" || data.status === "SUCCESS";

        return {
            status: isSuccess ? "SUCCESS" : "FAILED",
            responseCode: data.ResponseCode,
            rawData: data
        };
    } catch (error) {
        console.error("Interswitch Inquiry Error:", error.response?.data || error.message);
        throw new Error(`Transaction verification failed: ${error.message}`);
    }
};

module.exports = {
    INTERSWITCH_CONFIG,
    generateSHA512Hash,
    getPassportToken,
    queryTransactionStatus
};
