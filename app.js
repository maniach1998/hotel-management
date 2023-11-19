import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import handlebars from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import configRoutes from './routes/index.js';

// Path variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup express, static path and env variables
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;
dotenv.config();

const staticDir = express.static(__dirname + '/public');
app.use('/public', staticDir);

// Setup handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Route config
configRoutes(app);

// Start the server
app.listen(PORT, async () => {
	console.log(`Server running -> http://localhost:${PORT} 💯`);

	await mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to DB!'));
});
