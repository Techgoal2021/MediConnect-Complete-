const User = require('../models/User');
const Specialist = require('../models/Specialist');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const Slot = require('../models/Slot');
const crypto = require('crypto');

const models = {
  users: User,
  specialists: Specialist,
  appointments: Appointment,
  reviews: Review,
  slots: Slot
};

const mongoDbAdapter = {
  // Get all records in a collection
  findAll: async (collection) => {
    return await models[collection].find({}).lean().exec();
  },

  // Find by the custom 'id' field (NOT MongoDB _id)
  findById: async (collection, id) => {
    if (!id) return null;
    return await models[collection].findOne({ id: String(id) }).lean().exec();
  },

  // Find one by a query function (old pattern) or a Mongoose query object
  findOne: async (collection, query) => {
    if (typeof query === 'function') {
      const data = await models[collection].find({}).lean().exec();
      return data.find(query) || null;
    }
    return await models[collection].findOne(query).lean().exec();
  },

  // Create a new record with a generated custom id
  create: async (collection, item) => {
    const Model = models[collection];
    const id = crypto.randomBytes(16).toString('hex');
    const newItem = new Model({ id, ...item });
    await newItem.save();
    // Return a plain object like the others
    return { id, ...item, _id: newItem._id };
  },

  // Update using the custom 'id' field
  update: async (collection, id, updates) => {
    if (!id) return null;
    return await models[collection].findOneAndUpdate(
      { id: String(id) },
      { $set: updates },
      { new: true }
    ).lean().exec();
  },

  // Delete using the custom 'id' field
  delete: async (collection, id) => {
    if (!id) return null;
    return await models[collection].findOneAndDelete({ id: String(id) }).lean().exec();
  }
};

module.exports = mongoDbAdapter;
