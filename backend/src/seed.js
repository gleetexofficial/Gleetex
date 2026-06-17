require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ADMIN_NAME = 'Muhammad Ahmad';
const ADMIN_EMAIL = 'admin@gleetex.com';
const ADMIN_PASSWORD = 'admin123';
const OLD_EMAIL = 'admin@ahmury.com';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const User = require('./models/User');

  // Migrate old email if it exists
  const oldAdmin = await User.findOne({ email: OLD_EMAIL });
  if (oldAdmin) {
    await User.updateOne({ email: OLD_EMAIL }, { $set: { email: ADMIN_EMAIL, name: ADMIN_NAME, role: 'admin' } });
    console.log(`✅ Migrated admin email from ${OLD_EMAIL} to ${ADMIN_EMAIL}`);
  }

  // Check if admin already exists with new email
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    await User.updateOne({ email: ADMIN_EMAIL }, { $set: { role: 'admin', name: ADMIN_NAME } });
    console.log(`✅ Admin role confirmed for: ${ADMIN_EMAIL}`);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`✅ Admin account created!`);
  }

  console.log('─────────────────────────────');
  console.log('  Email:    ' + ADMIN_EMAIL);
  console.log('  Password: ' + ADMIN_PASSWORD);
  console.log('─────────────────────────────');
  console.log('Go to http://localhost:5173/login');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
