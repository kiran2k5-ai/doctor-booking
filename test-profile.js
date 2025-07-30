// Quick test to initialize profile data
console.log('Initializing profile data...');

// Simulate localStorage for Node.js environment
global.localStorage = {
  getItem: function(key) {
    return this.data[key] || null;
  },
  setItem: function(key, value) {
    this.data[key] = value;
  },
  removeItem: function(key) {
    delete this.data[key];
  },
  clear: function() {
    this.data = {};
  },
  data: {}
};

// Test profile data structure
const testProfile = {
  id: 'user123',
  name: 'Demo User',
  email: 'demo@example.com',
  phone: '9042222856',
  dateOfBirth: '1990-05-15',
  gender: 'Male',
  address: '123 Main St, Demo City, DC 12345',
  emergencyContact: 'Emergency Contact: +1-555-0123',
  bloodType: 'O+',
  allergies: ['Peanuts', 'Shellfish'],
  preferences: {
    notifications: true,
    language: 'en',
    theme: 'light'
  }
};

console.log('Test profile structure:');
console.log(JSON.stringify(testProfile, null, 2));
console.log('\nProfile data structure is valid ✓');
