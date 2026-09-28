const mongoose = require('mongoose');

const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/ds-technologies';

  if (!uri || uri.includes('<') || uri.includes('YOUR_') || uri.includes('xxxx')) {
    console.error('ERROR: Set a valid MONGODB_URI in Environment Variables.');
    console.error('Example: mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/ds-technologies?retryWrites=true&w=majority');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (error.message.includes('ENOTFOUND')) {
      console.error('→ Check Atlas hostname in MONGODB_URI (copy again from Atlas → Connect → Drivers).');
    }
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('→ Wrong username/password. Encode special chars in password (@ → %40).');
    }
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('→ Atlas Network Access: allow 0.0.0.0/0');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
