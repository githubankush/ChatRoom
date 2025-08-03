// ✅ useSocketEvents.js
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import {useAuth} from "../context/authContext"; 
import useSocket from "./useSocket";

const useSocketEvents = () => {
  const { user } = useAuth(); 
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !user?._id) return;

    // Join your personal room once socket is connected
    socket.emit("joinRoom", user._id);

    // Listen for friend request notifications
    socket.on("friendRequestNotification", (data) => {
        console.log("friendRequestNotification received")
      toast.success(data.message || "You have a new friend request!");
      // you can also trigger custom UI/logic here
    });

    return () => {
      socket.off("friendRequestNotification");
    };
  }, [socket, isConnected, user]);
};

export default useSocketEvents;
