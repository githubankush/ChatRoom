// socket.js
import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Map to track which socket is in which rooms
  const socketRoomMap = new Map();

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // Join a room
    socket.on("joinRoom", (roomId) => {
      // Leave previous room if exists
      if (socketRoomMap.has(socket.id)) {
        const prevRoom = socketRoomMap.get(socket.id);
        socket.leave(prevRoom);
        console.log(`📦 User ${socket.id} left room: ${prevRoom}`);
      }

      socket.join(roomId);
      socketRoomMap.set(socket.id, roomId);
      console.log(`📦 User ${socket.id} joined room: ${roomId}`);
    });

    // Receive new message and emit to room
    socket.on("newMessage", ({ roomId, message }) => {
      io.to(roomId).emit("messageReceived", message);
      console.log(`📨 Message sent to room: ${roomId}`);
    });

    // Friend request notification
    socket.on("friendRequestSent", ({ to, from, message }) => {
      io.to(to).emit("friendRequestNotification", { from, message });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      const leftRoom = socketRoomMap.get(socket.id);
      if (leftRoom) {
        console.log(`❌ Socket ${socket.id} disconnected from room: ${leftRoom}`);
        socketRoomMap.delete(socket.id);
      } else {
        console.log(`❌ Socket disconnected: ${socket.id}`);
      }
    });
  });

  return io;
};
