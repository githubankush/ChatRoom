// src/hooks/useChat.js
import axios from "../axios";
import { useEffect } from "react";
import { useChatContext } from "../context/chatContext";
import useSocket from "./useSocket";
const useChat = () => {
  const { selectedChat } = useChatContext();
  
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

 const sendMessage = async (chatId, text) => {
  
  console.log("text: ", text);
  if (!chatId || !text) {
    console.error("Chat ID and text are required to send a message.");
    return;
  }

  try {
    const res = await axios.post(`/chat/${chatId}/message`, {
      text
    });
    await fetchMessages(chatId);
    return res.data;
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    throw error;
  }
};




  return { fetchUserChats, createChat, fetchMessages, sendMessage };
};

export default useChat;
