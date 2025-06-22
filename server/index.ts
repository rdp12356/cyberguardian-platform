import express from 'express';
import cors from 'cors';
import { MemStorage } from './storage';
import { createRouter } from './routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize storage
const storage = new MemStorage();

// Routes
app.use(createRouter(storage));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`CyberGuardian server running on port ${port}`);
});