const { MongoClient } = require("mongodb");

let dbClient;

async function connectDB() {
  if (!dbClient) {
    dbClient = new MongoClient(process.env.DB_CONNECTION_STRING);
    await dbClient.connect();
    console.log("DB connection established");
  }
  return dbClient.db(process.env.DB_NAME);
}

function getDB() {
  if (!dbClient) {
    throw new Error("Database not connected");
  }
  return dbClient.db(process.env.DB_NAME);
}

function closeDB() {
  if (dbClient) {
    dbClient.close();
  }
}

module.exports = { connectDB, getDB, closeDB };
