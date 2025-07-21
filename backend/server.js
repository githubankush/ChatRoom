import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allows cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Chat Room API');
});

// Connect to DB and start server
connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
