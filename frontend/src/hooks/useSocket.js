// useSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket; // persistent across hook calls

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
      });
    }

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      // Don't disconnect here if we want global persistence
      // Only remove event listeners to avoid stacking
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return { socket, isConnected };
};

export default useSocket;
