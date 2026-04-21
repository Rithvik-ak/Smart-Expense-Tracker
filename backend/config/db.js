const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
  connectToDb: async (cb) => {
    try {
      const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
      if (!uri) throw new Error('No MongoDB URI set — define MONGODB_URI in Railway environment variables.');
      const client = new MongoClient(uri);
      await client.connect();
      dbConnection = client.db();
      console.log('✅ Connected to MongoDB Atlas successfully.');
      return cb();
    } catch (error) {
      console.error('❌ MongoDB Atlas connection error:', error);
      return cb(error);
    }
  },
  getDb: () => dbConnection
};
