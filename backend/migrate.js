const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Specialist = require('./src/models/Specialist');
const Appointment = require('./src/models/Appointment');
const Review = require('./src/models/Review');
const Slot = require('./src/models/Slot');

const DATA_DIR = path.join(__dirname, 'data');

const models = {
  users: User,
  specialists: Specialist,
  appointments: Appointment,
  reviews: Review,
  slots: Slot
};

const migrate = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected. Starting migration...");

        const collections = ['users', 'specialists', 'appointments', 'reviews', 'slots'];

        for (const collection of collections) {
            const filePath = path.join(DATA_DIR, `${collection}.json`);
            if (fs.existsSync(filePath)) {
                console.log(`Migrating collection: ${collection}...`);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                
                if (data.length > 0) {
                    await models[collection].deleteMany({});
                    await models[collection].insertMany(data);
                    console.log(`Successfully migrated ${data.length} items to ${collection}.`);
                } else {
                    console.log(`Collection ${collection} is empty.`);
                }
            } else {
                console.log(`File not found: ${filePath}`);
            }
        }

        console.log("Migration completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

migrate();
