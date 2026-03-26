const { getPassportToken } = require('../src/utils/interswitch');
require('dotenv').config();

const testPassport = async () => {
    console.log("Testing Interswitch Passport OAuth2 Token Retrieval...");
    
    if (process.env.DEMO_MODE === 'true') {
        console.log("✅ [DEMO MODE] Simulating successful Passport Token retrieval.");
        return;
    }

    try {
        const token = await getPassportToken();
        if (token) {
            console.log("✅ Successfully obtained Passport Token:", token.substring(0, 10) + "...");
        } else {
            console.error("❌ Failed to obtain Passport Token");
            process.exit(1);
        }
    } catch (err) {
        console.error("❌ Error during Passport token retrieval:", err.message);
        process.exit(1);
    }
};

testPassport();
