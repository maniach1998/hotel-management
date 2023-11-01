import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';

import configRoutes from './routes/index.js';

// Setup express and env variables
const app = express();
app.use(express.json());
const PORT = 3000;
dotenv.config();

// Route config
configRoutes(app);

// Start the server
app.listen(PORT, async () => {
	console.log(`Server running -> http://localhost:${PORT} 💯`);

	await mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to DB!'));
});
