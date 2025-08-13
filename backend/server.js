import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { initSocket } from './sockets/socket.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import friendRoutes from './routes/friend.route.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to DB and start the server
connectDB()
  .then(() => {
    const io = initSocket(httpServer); // ✅ Now io is defined here

    // ✅ Set io in req only after it's initialized
    app.use((req, res, next) => {
      req.io = io;
      console.log('io is set in req');
      next();
    });
    app.set("io", io); // ✅ Attach io to the Express app

    app.use("/uploads", express.static("uploads"));
    // Routes
    app.use('/api/auth', userRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/friend', friendRoutes);

    app.get('/', (req, res) => {
      res.send('Welcome to the Chat Room API');
    });

    httpServer.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
