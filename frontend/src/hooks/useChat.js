// src/hooks/useChat.js
import axios from "../axios";
import { useEffect } from "react";
import { useChatContext } from "../context/chatContext";
import useSocket from "./useSocket";
const useChat = () => {
  const { selectedChat, fetchMessageFunction } = useChatContext();
  
  const { socket } = useSocket();


  useEffect(() => {
    if (!socket) return;
    socket.on("new-message", (data) => {
      if (data.chatId === selectedChat._id) {
        setMessages(prev => [...prev, data]);
      }
    });
  }, [socket, selectedChat]);
  const { setChats, setMessages } = useChatContext();

  const fetchUserChats = async () => {
    const res = await axios.get("/chat");
    setChats(res.data);
  };

  const createChat = async (userId) => {
    const res = await axios.post("/chat/create", { userId });
    await fetchUserChats(); // Refresh chat list
    return res.data;
  };

  const fetchMessages = async (chatId) => {
    const res = await axios.get(`/chat/${chatId}/messages`);
    setMessages(res.data);
  };

 
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Message sent:", res.data);

      // Optionally fetch updated messages
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
