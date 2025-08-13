// socket.js
import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // Store mapping of userId to socketId if needed
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`📦 User joined room: ${roomId}`);
    });

    // For sending message to a chat room
    socket.on("newMessage", ({ roomId, message }) => {
      io.to(roomId).emit("messageReceived", message); // real-time emit
      console.log("📨 Message sent to room:", roomId);
    });

    // For friend request notification
    socket.on("friendRequestSent", ({ to, from, message }) => {
      io.to(to).emit("friendRequestNotification", { from, message });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  return io;
};
