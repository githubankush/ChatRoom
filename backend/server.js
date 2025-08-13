import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { initSocket } from "./sockets/socket.js";
import path from "path";

// Routes
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import friendRoutes from "./routes/friend.route.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect DB and start server
connectDB()
  .then(() => {
    // Initialize socket.io
    const io = initSocket(httpServer);

    // Make io accessible in requests if needed
    app.use((req, res, next) => {
      req.io = io;
      next();
    });

    // Routes
    app.use("/api/auth", userRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/friend", friendRoutes);

    app.get("/", (req, res) => {
      res.send("Welcome to Chat Room API");
    });

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
