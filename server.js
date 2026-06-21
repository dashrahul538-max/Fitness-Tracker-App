import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  initializeDatabase, 
  signUpUser, 
  loginUser,
  getUserById,
  getAllActivities, 
  addActivity, 
  updateActivity, 
  deleteActivity, 
  getActivitiesByDate 
} from './db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize database and start server
async function startServer() {
  await initializeDatabase();

  // ============ USER ROUTES ============

  // Sign up
  app.post('/api/users/signup', (req, res) => {
    try {
      const { name, email, password, age, goal } = req.body;
      
      if (!name || !email || !password || !age) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const user = signUpUser(name, email, password, age, goal);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Login
  app.post('/api/users/login', (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = loginUser(email, password);
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  });

  // Get user profile
  app.get('/api/users/:id', (req, res) => {
    try {
      const { id } = req.params;
      const user = getUserById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ ACTIVITY ROUTES ============

  // Get all activities for user
  app.get('/api/activities/:userId', (req, res) => {
    try {
      const { userId } = req.params;
      const activities = getAllActivities(userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get activities by date range for user
  app.get('/api/activities/:userId/:startDate/:endDate', (req, res) => {
    try {
      const { userId, startDate, endDate } = req.params;
      const activities = getActivitiesByDate(userId, startDate, endDate);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add new activity
  app.post('/api/activities', (req, res) => {
    try {
      const { userId, date, type, duration, calories, notes } = req.body;
      
      if (!userId || !date || !type || !duration) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const activity = addActivity(userId, date, type, duration, calories, notes);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update activity
  app.put('/api/activities/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { date, type, duration, calories, notes } = req.body;
      const activity = updateActivity(id, date, type, duration, calories, notes);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete activity
  app.delete('/api/activities/:id', (req, res) => {
    try {
      const { id } = req.params;
      deleteActivity(id);
      res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
  });

  // Serve React app for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`\n🏋️  Fitness Tracker Server running on http://localhost:${PORT}\n`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
