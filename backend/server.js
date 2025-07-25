import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http'; // For socket.io
import { initSocket } from './sockets/socket.js'; // Your socket handler
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

dotenv.config();

const app = express();
const httpServer = createServer(app); // Wrap express app for socket.io
// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Chat Room API');
});
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connect to DB and start both HTTP & Socket.IO servers
connectDB()
  .then(() => {
    const io = initSocket(httpServer); // Initialize Socket.IO with server
    httpServer.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
