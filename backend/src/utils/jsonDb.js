const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeData = (collection, data) => {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const jsonDb = {
  findAll: (collection) => readData(collection),
  findById: (collection, id) => readData(collection).find(item => item.id === id),
  findOne: (collection, predicate) => readData(collection).find(predicate),
  create: (collection, item) => {
    const data = readData(collection);
    const newItem = { id: require('crypto').randomUUID(), ...item, createdAt: new Date() };
    data.push(newItem);
    writeData(collection, data);
    return newItem;
  },
  update: (collection, id, updates) => {
    const data = readData(collection);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updates, updatedAt: new Date() };
    writeData(collection, data);
    return data[index];
  },
  delete: (collection, id) => {
    const data = readData(collection);
    const filtered = data.filter(item => item.id !== id);
    writeData(collection, filtered);
    return true;
  }
};

module.exports = jsonDb;
