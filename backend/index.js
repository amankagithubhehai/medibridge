const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

const Hospital = require('./models/Hospital');
const Referral = require('./models/Referral');
const User = require('./models/User');
const Patient = require('./models/Patient');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/users', require('./routes/users'));
app.use('/api/patients', require('./routes/patients'));

// Initialize MongoDB connection and seed data
const startServer = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.log('No MONGODB_URI found. Initializing Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Successfully');
    
    // Seed Users (Admin)
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      // 1. Seed Super Admin
      await User.create({
        name: 'GovHealth Super Admin',
        email: 'admin@gov.in',
        password: 'admin',
        role: 'admin',
        department: 'Administration',
        notifications: { inApp: true, sms: false, email: true }
      });
      console.log('Super Admin seeded successfully');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

startServer();
