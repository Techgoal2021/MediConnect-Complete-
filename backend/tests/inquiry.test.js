const { queryTransactionStatus } = require('../src/utils/interswitch');
require('dotenv').config();

const testInquiry = async () => {
    console.log("Testing Interswitch Inquiry API Logic...");
    const mockTxnRef = "MED-TEST-" + Date.now();
    const amountInKobo = 500000;

    try {
        const result = await queryTransactionStatus(mockTxnRef, amountInKobo);
        console.log("Inquiry Result:", result);
        
        if (result.status === "FAILED" && result.responseCode === "70067") {
            console.log("✅ Successfully communicated with Interswitch. (Status 70067 means Transaction Not Found, which is expected for a mock reference)");
        } else if (result.mock) {
            console.log("ℹ️ Running in Mock/Demo Mode.");
        } else {
            console.log("Interswitch Response:", result);
        }
    } catch (err) {
        console.error("❌ Inquiry Failed:", err.message);
        // If we get an unauthorized error, it might be due to credentials
        if (err.message.includes("401")) {
            console.error("Critical: Unauthorized! Check CLIENT_ID and CLIENT_SECRET.");
        }
    }
};

testInquiry();
