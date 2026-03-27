const mongoose = require('mongoose');
const User = require('../models/User');
const Specialist = require('../models/Specialist');
const Appointment = require('../models/Appointment');

const models = {
  users: User,
  specialists: Specialist,
  appointments: Appointment
};

const mongoDbAdapter = {
  findAll: async (collection) => {
    return await models[collection].find({});
  },
  findById: async (collection, id) => {
    return await models[collection].findOne({ id });
  },
  findOne: async (collection, predicate) => {
    const data = await models[collection].find({});
    return data.find(predicate);
  },
  create: async (collection, item) => {
    try {
      const Model = models[collection];
      const id = require('crypto').randomBytes(16).toString('hex');
      const newItem = new Model({ id, ...item });
      await newItem.save();
      console.log(`MongoDB: Created new item in ${collection} with ID ${id}`);
      return newItem;
    } catch (err) {
      console.error(`MongoDB Error creating item in ${collection}:`, err);
      throw err;
    }
  },
  update: async (collection, id, updates) => {
    try {
      const item = await models[collection].findOneAndUpdate(
        { id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      return item;
    } catch (err) {
      console.error(`MongoDB Error updating item in ${collection}:`, err);
      throw err;
    }
  },
  delete: async (collection, id) => {
    try {
      await models[collection].deleteOne({ id });
      return true;
    } catch (err) {
      console.error(`MongoDB Error deleting item from ${collection}:`, err);
      throw err;
    }
  },
  // Custom method for batch writing if needed
  writeData: async (collection, data) => {
    try {
      await models[collection].deleteMany({});
      await models[collection].insertMany(data);
      return true;
    } catch (err) {
      console.error(`MongoDB Error batch writing to ${collection}:`, err);
      throw err;
    }
  }
};

module.exports = mongoDbAdapter;
