import express from 'express';
import configRoutes from './routes/index.js';
const app = express();

const PORT = 4000;

configRoutes(app);

app.listen(PORT, () => {
	console.log(`Server running -> http://localhost:${PORT} 💯`);
});
