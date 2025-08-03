import { useAuth } from "../context/authContext";
import { useChatContext } from "../context/chatContext";
import MessageBubble from "./MessageBubble";
import { useEffect, useRef, useState } from "react";
import useSocket from "../hooks/useSocket";
import axios from "../axios";
import { groupMessagesByDate } from "../utils/groupMessagesByDate";

const ChatWindow = () => {
  const {
    messages,
    selectedChat,
    fetchMessageFunction,
    setMessages,
    fetchOlderMessages,
  } = useChatContext();
  const { user } = useAuth();
  const { socket } = useSocket();

  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Load messages when chat changes
  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessageFunction(selectedChat._id);
    }
  }, [selectedChat]);

  // Join room
  useEffect(() => {
    if (socket && selectedChat?._id) {
      socket.emit("joinRoom", selectedChat._id);
    }
  }, [socket, selectedChat]);

  // Incoming message
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceive = (newMessage) => {
      if (!selectedChat || newMessage.chat !== selectedChat._id) return;
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("messageReceived", handleMessageReceive);
    return () => socket.off("messageReceived", handleMessageReceive);
  }, [socket, selectedChat]);

  // Auto scroll to bottom when new message
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Scroll listeners
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    setShowScrollToBottom(!isBottom);

    if (el.scrollTop === 0) {
      fetchOlderMessages(selectedChat._id); // You must implement this in context
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600 dark:text-gray-300 text-center p-4">
        <p className="text-lg font-medium">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-160px)] relative bg-gray-100 dark:bg-gray-800">
      {/* Header */}
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
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 space-y-4 relative"
      >
        {messages.length > 0 ? (
          Object.entries(groupMessagesByDate(messages)).map(([dateLabel, group]) => (
            <div key={dateLabel} className="space-y-2">
              <div className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 border-t border-gray-200 dark:border-gray-700 p-2">
                {dateLabel}
              </div>
              {group.map((msg) => (
                <MessageBubble key={msg._id} message={msg} user={user} isGroup={selectedChat.isGroup} />
              ))}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <button
          onClick={() =>
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
          }
          className="absolute bottom-20 right-4 bg-blue-500 text-white px-3 py-1 rounded-full shadow-md text-xs hover:bg-blue-600 transition-all"
        >
          🔽 Scroll to Bottom
        </button>
      )}
    </div>
  );
};

export default ChatWindow;
