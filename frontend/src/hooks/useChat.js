// src/hooks/useChat.js
import axios from "../axios";
import { useEffect } from "react";
import { useChatContext } from "../context/chatContext";
import useSocket from "./useSocket";

const useChat = () => {
  const { selectedChat, setChats, setMessages, fetchMessageFunction } = useChatContext();
  const { socket } = useSocket();

  // ✅ Listen for new incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      if (selectedChat && data.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("new-message", handleNewMessage);
    return () => socket.off("new-message", handleNewMessage);
  }, [socket, selectedChat, setMessages]);

  // ✅ Fetch all user chats
  const fetchUserChats = async () => {
    try {
      const res = await axios.get("/chat");
      setChats(res.data);
    } catch (error) {
      console.error("Error fetching chats:", error.response?.data || error.message);
    }
  };

  // ✅ Create a chat
  const createChat = async (userId) => {
    if (!userId) return null;
    try {
      const res = await axios.post("/chat/create", { userId });
      await fetchUserChats();
      return res.data;
    } catch (error) {
      console.error("Error creating chat:", error.response?.data || error.message);
    }
  };

  // ✅ Fetch messages safely
  const fetchMessages = async (chatId) => {
    if (!chatId) {
      console.warn("⚠ fetchMessages called without a chatId");
      return;
    }
    try {
      const res = await axios.get(`/chat/${chatId}/messages`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error.response?.data || error.message);
    }
  };

  // ✅ Send a message
  const sendMessage = async (chatId, text, media) => {
    if (!chatId || (!text && !media)) {
      console.error("Chat ID and content are required.");
      return;
    }
    try {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (media) formData.append("media", media);

      const res = await axios.post(`/chat/${chatId}/message`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Optionally update UI immediately
      await fetchMessageFunction(chatId);
      return res.data;
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      throw error;
    }
  };

  return { fetchUserChats, createChat, fetchMessages, sendMessage };
};

export default useChat;
