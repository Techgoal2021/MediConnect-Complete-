const { generateSHA512Hash, INTERSWITCH_CONFIG } = require('../src/utils/interswitch');

const testHash = () => {
    const txnRef = "MED-TEST-12345";
    const amountInKobo = 500000;
    const callbackUrl = "http://localhost:5173/appointments";

    console.log("Testing Interswitch SHA-512 Hash Generation...");
    const hash = generateSHA512Hash(txnRef, amountInKobo, callbackUrl);
    
    console.log("Generated Hash:", hash);
    if (hash && hash.length === 128) {
        console.log("✅ Hash length is correct (128 chars for SHA-512 hex)");
    } else {
        console.error("❌ Hash generation failed or length is incorrect");
        process.exit(1);
    }
};

testHash();
