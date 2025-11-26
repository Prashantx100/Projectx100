import {Client} from 'pg'

// configure the client
const client = new Client({
  user: 'postgres',          // your PostgreSQL username
  host: 'localhost',         // database host
  database: 'ads_db',          // the database you want to connect to
  password: 'SQL',  // your PostgreSQL password
  port: 5432,                // default PostgreSQL port
});

export default client;
