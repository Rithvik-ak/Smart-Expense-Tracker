const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
  connectToDb: async (cb) => {
    try {
      const client = new MongoClient(process.env.MONGO_URI);
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
