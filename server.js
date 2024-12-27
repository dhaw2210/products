import express from 'express';
import { MongoClient } from 'mongodb';
import usersRoutes from './routes/users.js';
import productsRoutes from './routes/products.js';

const app = express();
const PORT = process.env.PORT || 3000;
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'productsDB';
let db;

app.use(express.json());

// Function to connect to the database
const connectToDB = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to database');

    // Initialize routes after successful DB connection
    app.use('/api/users', usersRoutes(db));
    app.use('/api/products', productsRoutes(db));

    // Start the server
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Call the function to connect to the database and initialize the server
connectToDB();
