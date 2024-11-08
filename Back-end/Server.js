import express from 'express';
import db from './Modal.js'
import 'dotenv/config'
import cors from 'cors'
import Router from './Controler.js';
import bodyParser from 'body-parser'
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PORT = process.env.PORT;

// Middleware to parse JSON bodies
app.use(express.json());
// app.use(bodyParser.json());
app.use(cors(
  {
    origin:["https://empattandencefrontend.vercel.app"],
    methods:["POST","GET","PUT","DELETE"],
    credentials:true
  }
))
app.use('/', express.static('uploads'));
app.use('/', Router)
app.use(express.static(path.join(__dirname, '../front-end/build')));

app.use((err, req, res, next) => {
  
  if (err.message === 'Only PNG and JPG files are allowed') {
    
    return res.status(500).json({message:err.message});
  }
  res.status(500).send('Something went wrong');
  next()
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
