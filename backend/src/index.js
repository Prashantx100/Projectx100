import client from "./db/db.js";

// connect to the database
client.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch(err => console.error('Connection error', err));