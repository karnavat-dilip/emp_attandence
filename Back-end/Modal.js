import mysql from 'mysql2';
import 'dotenv/config'
 
// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.HOST,     // Replace with your DB host
  user: process.env.USER,          // Replace with your MySQL username
  password: process.env.PASSWORD,          // Replace with your MySQL password
  database: process.env.DB_NAME // Replace with your DB name
});

export default db;
