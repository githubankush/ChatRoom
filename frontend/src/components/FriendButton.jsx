// ✅ Updated FriendButton.jsx
import React, { useState, useEffect } from "react";
import axios from "../axios";
import { toast } from "react-hot-toast";
import useSocket from "../hooks/useSocket"; // assuming you saved it in hooks folder

const FriendButton = ({ userId, userSearched }) => {
  const [status, setStatus] = useState("Send Request");
  const [loading, setLoading] = useState(false);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket && isConnected && userId) {
      socket.emit("joinRoom", userId); // join own user room

      socket.on("friendRequestNotification", (data) => {
        if (data?.message) {
          toast.success(data.message);
        }
      });
    }

    return () => {
      socket?.off("friendRequestNotification");
    };
  }, [socket, isConnected, userId]);

  const handleSend = async () => {
    if (userId === userSearched) {
      toast.error("You cannot send a request to yourself.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/friend/send",
        { receiverId: userSearched, senderId: userId },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Friend request sent");
      setStatus("Requested");

      // send socket event to receiver
      if (socket) {
        socket.emit("friendRequestSent", {
          to: userSearched,
          from: userId,
          message: `${userId} sent you a friend request`,
        });
      }
    } catch (err) {
      console.error("Error sending friend request:", err);
      const msg = err?.response?.data?.message || "Failed to send request";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSend}
      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
      disabled={status !== "Send Request" || loading}
    >
      {loading ? "Sending..." : status}
    </button>
  );
};

export default FriendButton;