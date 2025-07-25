import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext"
import axios from "../axios";

const ChatRoom = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await axios.get("/chat", {withCredentials: true});
      setChats(data);
    };

    if (user) fetchChats();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Your Chats</h2>
      {chats.map(chat => (
        <div key={chat._id} className="p-2 border-b">
          {chat.chatName || "Direct Chat"}
        </div>
      ))}
    </div>
  );
};

export default ChatRoom;
