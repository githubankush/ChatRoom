// src/context/ChatContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "../axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const fetchMessageFunction = async (chatId) => {
    try {
      const response = await axios.get(`/chat/${chatId}/messages`, {
        withCredentials: true,
      });
      setMessages(response.data);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
        fetchMessageFunction,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
