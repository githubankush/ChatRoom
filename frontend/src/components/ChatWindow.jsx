import { useAuth } from "../context/authContext";
import { useChatContext } from "../context/chatContext";
import MessageBubble from "./MessageBubble";
import { useEffect } from "react";

const ChatWindow = () => {
  const { messages, selectedChat, fetchMessageFunction } = useChatContext();
  const { user } = useAuth();

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessageFunction(selectedChat._id);
    }
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600 dark:text-gray-300 text-center p-4">
        <p className="text-lg font-medium">Select a chat to start messaging</p>
      </div>
    );
  }
  console.log("Selected chat: ", selectedChat);

  return (
  //   <div className="flex-1 flex flex-col h-full relative bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
  //     {/* Chat Header */}
      
  //     <div className="p-4 flex items-center gap-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
  //        <img
  //   src={
  //     selectedChat.isGroup
  //       ? selectedChat.avatar || "/group-default.png" // fallback for group
  //       : selectedChat.members?.find((m) => String(m._id) !== String(user?._id))?.avatar || "/user-default.png"
  //   }
  //   alt="avatar"
  //   className="w-10 h-10 rounded-full object-cover"
  // />
  //       <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
  //        {selectedChat.isGroup
  //       ? selectedChat.chatName || "Unnamed Group"
  //       : selectedChat.members?.find((m) => String(m._id) !== String(user?._id))?.username || "Chat"}
  //       </h2>
  //     </div>

  //     {/* Chat Messages */}
  //     <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scroll-smooth">
  //       {messages.length > 0 ? (
  //         messages.map((msg) => (
  //           <MessageBubble key={msg._id} message={msg} user={user} isGroup={selectedChat?.isGroup} />
  //         ))
  //       ) : (
  //         <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
  //           No messages yet. Start the conversation!
  //         </div>
  //       )}
  //     </div>
  //   </div>
  <div className="flex-1 flex flex-col h-[calc(100vh-64px)] relative bg-gray-100 dark:bg-gray-800">

  {/* Chat Header */}
  <div className="p-4 flex items-center gap-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
    <img
      src={
        selectedChat.isGroup
          ? selectedChat?.avatar 
          : selectedChat.members?.find((m) => String(m._id) !== String(user?._id))?.avatar || "/user-default.png"
      }
      className="w-10 h-10 rounded-full object-cover"
    />
    <div className="flex flex-col">
      <p className="font-semibold text-gray-900 dark:text-white text-sm">
        {selectedChat.isGroup
          ? selectedChat.chatName || "Unnamed Group"
          : selectedChat.members?.find((m) => String(m._id) !== String(user?._id))?.username || "Chat"}
      </p>
      <p className="text-xs text-gray-500">Online</p>
    </div>
  </div>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto p-4 space-y-2">
    {messages.length > 0 ? (
      messages.map((msg) => (
        <MessageBubble key={msg._id} message={msg} user={user} isGroup={selectedChat.isGroup} />
      ))
    ) : (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
        No messages yet. Start the conversation!
      </div>
    )}
  </div>
</div>



  );
};

export default ChatWindow;
