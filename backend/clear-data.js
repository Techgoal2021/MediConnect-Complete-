const jsonDb = require('./src/utils/jsonDb');

/**
 * Utility script to clear test data for a clean demo slate.
 * Keeps specialist profiles but clears appointments and non-specialist users.
 */
const clearData = () => {
  console.log('--- MediConnect Database Cleanup ---');

  // 1. Clear Appointments
  console.log('Cleaning appointments...');
  jsonDb.writeData('appointments', []);

  // 2. Reset Slots
  console.log('Resetting all slots to available...');
  const slots = jsonDb.findAll('slots');
  const resetSlots = slots.map(s => ({ ...s, isBooked: false, updatedAt: new Date() }));
  jsonDb.writeData('slots', resetSlots);

  // 3. Clear non-specialist users
  console.log('Removing non-specialist accounts...');
  const users = jsonDb.findAll('users');
  const specialistsOnly = users.filter(u => u.role === 'specialist' || u.email.includes('mediconnect.com'));
  jsonDb.writeData('users', specialistsOnly);

  console.log('--- Cleanup Complete! ---');
  console.log(`Remaining Users: ${specialistsOnly.length}`);
};

clearData();
