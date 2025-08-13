import { useAuth } from "../context/authContext";
import { useChatContext } from "../context/chatContext";
import MessageBubble from "./MessageBubble";
import { useEffect, useRef, useState } from "react";
import useSocket from "../hooks/useSocket";
import { groupMessagesByDate } from "../utils/groupMessagesByDate";
import GroupChatDetails from "../components/GroupChatDetails ";

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

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const prevScrollHeightRef = useRef(0);

  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [autoScrollAllowed, setAutoScrollAllowed] = useState(true);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  // Fetch messages when chat changes
  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessageFunction(selectedChat._id);
      setAutoScrollAllowed(true);
    }
  }, [selectedChat]);

  // Join room only once per selectedChat change
  useEffect(() => {
    if (socket && selectedChat?._id) {
      socket.emit("joinRoom", selectedChat._id);
    }
  }, [socket, selectedChat?._id]); // ✅ only trigger when chat id changes

  // Listen for new messages from socket
  useEffect(() => {
    if (!socket || !selectedChat?._id) return;

    const handleMessageReceive = (newMessage) => {
      if (newMessage.chat === selectedChat._id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === newMessage._id);
          return exists ? prev : [...prev, newMessage];
        });
        setAutoScrollAllowed(true);
      }
    };

    // ✅ Remove existing listener first to prevent duplicates
    socket.off("messageReceived", handleMessageReceive);
    socket.on("messageReceived", handleMessageReceive);

    // ✅ Cleanup listener when chat changes/unmount
    return () => {
      socket.off("messageReceived", handleMessageReceive);
    };
  }, [socket, selectedChat?._id, setMessages]);

  // Auto scroll on new messages
  useEffect(() => {
    if (autoScrollAllowed && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    setAutoScrollAllowed(false);
  }, [messages]);

  // Handle scrolling & load older messages
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isAtBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    setShowScrollToBottom(!isAtBottom);

    if (el.scrollTop === 0 && !loadingOlder) {
      setLoadingOlder(true);
      prevScrollHeightRef.current = el.scrollHeight;

      fetchOlderMessages(selectedChat._id).finally(() => {
        setLoadingOlder(false);
        setAutoScrollAllowed(false);

        setTimeout(() => {
          const newScrollHeight = el.scrollHeight;
          el.scrollTop = newScrollHeight - prevScrollHeightRef.current;
        }, 0);
      });
    }
  };

  const scrollToBottom = () => {
    setAutoScrollAllowed(true);
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600 dark:text-gray-300 p-4">
        <p className="text-lg font-medium">Select a chat to start messaging</p>
      </div>
    );
  }

  const partner = selectedChat.members?.find((m) => m._id !== user?._id);
  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-160px)] relative bg-gray-100 dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b bg-white dark:bg-gray-900 dark:border-gray-700">
        <div
          className={selectedChat?.isGroup ? "cursor-pointer" : ""}
          onClick={() => selectedChat.isGroup && setShowGroupInfo(true)}
        >
          <img
            src={
              selectedChat?.isGroup && selectedChat?.avatar
                ? `${backendBase}${selectedChat.avatar}`
                : partner?.avatar
                ? `${backendBase}${partner.avatar}`
                : "/default-avatar.webp"
            }
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        <div>
          <p className="font-semibold text-sm text-gray-900 dark:text-white">
            {selectedChat?.isGroup
              ? selectedChat.chatName || "Unnamed Group"
              : partner?.username || "Chat"}
          </p>

          {selectedChat?.isGroup ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
              {selectedChat.members?.map((u) => u.username).join(", ")}
            </p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 space-y-4"
      >
        {loadingOlder && (
          <div className="text-center text-xs text-gray-400">
            Loading older messages...
          </div>
        )}

        {messages.length > 0 ? (
          Object.entries(groupMessagesByDate(messages)).map(
            ([dateLabel, group]) => (
              <div key={dateLabel} className="space-y-2">
                <div className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 py-2">
                  {dateLabel}
                </div>
                {group.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    message={msg}
                    user={user}
                    isGroup={selectedChat.isGroup}
                  />
                ))}
              </div>
            )
          )
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-4 bg-blue-500 text-white px-3 py-1 rounded-full shadow-md text-xs hover:bg-blue-600 transition-all"
        >
          🔽 Scroll to Bottom
        </button>
      )}

      {/* Group Info Sidebar */}
      {showGroupInfo && selectedChat?.isGroup && (
        <GroupChatDetails
          chat={selectedChat}
          onClose={() => setShowGroupInfo(false)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
