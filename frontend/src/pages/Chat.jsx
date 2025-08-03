import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useChat from "../hooks/useChat";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { useAuth } from "../context/authContext";
import Loader from "../components/Loader";
const Chat = () => {
  const { fetchUserChats, fetchMessages, selectedChat } = useChat();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (user) fetchUserChats();
  }, [loading, user]);

  




  if (loading) {
    return (
      <Loader />
    );
  }

  if (!user) return null;

  const showChatArea = !isMobile || (isMobile && selectedChat);

  return (
   <div className="flex h-[calc(100vh-64px)] w-full bg-white dark:bg-gray-900 overflow-hidden">
  {/* Sidebar - ChatList */}
  <div
    className={`${
      isMobile
        ? selectedChat
          ? "hidden"
          : "w-full"
        : "w-full sm:w-2/3 md:w-2/5 lg:w-[100%] xl:w-[30%] border-r border-gray-300 dark:border-gray-700"
    }`}
  >
    <ChatList onSelect={fetchMessages} />
  </div>

  {/* Chat Window + Message Input */}
  <div
    className={`${
      showChatArea
        ? "flex flex-col max-h-[calc(100vh-64px)] w-full sm:w-1/3 md:w-3/5 lg:w-[68%] xl:w-[70%]"
        : "hidden"
    }`}
  >
    {/* ChatWindow */}
    <div className="overflow-hidden">
      <ChatWindow />
    </div>

    {/* MessageInput */}
    <div className="border-t border-gray-200 dark:border-gray-700 p-2">
      <MessageInput fetchMessages={fetchMessages} />
    </div>
  </div>
</div>

  );
};

export default Chat;
