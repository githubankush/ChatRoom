import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { initSocket } from "./sockets/socket.js";

// Routes
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import friendRoutes from "./routes/friend.route.js";

// Load environment variables
dotenv.config();

// Create express app & HTTP server
const app = express();
const httpServer = createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // allow frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to DB and start server
connectDB()
  .then(() => {
    // Initialize Socket.IO
    const io = initSocket(httpServer);

    // Make io accessible to all requests
    app.use((req, res, next) => {
      req.io = io;
      next();
    });
    app.set("io", io);

    // Serve static uploads
    app.use("/uploads", express.static("uploads"));

    // Routes
    app.use("/api/auth", userRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/friend", friendRoutes);

    // Default API test route
    app.get("/", (req, res) => {
      res.send("Welcome to the Chat Room API");
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  });
