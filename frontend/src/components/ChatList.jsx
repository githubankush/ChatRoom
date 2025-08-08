import { useState, useEffect } from "react";
import axios from "../axios";
import { useAuth } from "../context/authContext";
import { useChatContext } from "../context/chatContext";
import { FaSearch } from "react-icons/fa";
import useSocket from "../hooks/useSocket";
// import FriendButton from "../components/FriendButton";
import Loader from "../components/Loader";
import formatChatTime  from "../utils/formatChatTime"; 
import CreateGroupModal from "./CreateGroupModal";
import { IoPerson } from "react-icons/io5";


const ChatList = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [showModal, setShowModal] = useState(false);
  const { chats, selectedChat, setChats, setSelectedChat } = useChatContext();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/chat");
        setChats(res.data);
        console.log("Chats fetched successfully:", res.data);
      } catch (err) {
        console.error("Error fetching chats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [setChats]);

    useEffect(() => {
    if (!socket) return;
    socket.on("messageReceived", (newMessage) => {
      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex(c => c._id === newMessage.chatId);
        if (chatIndex === -1) return prevChats; // no chat found
        const updatedChats = [...prevChats];
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          latestMessage: newMessage,
          updatedAt: new Date(),
        };
        return [...updatedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))];
        });
      });

        return () => socket.off("messageReceived");
      }, [socket, setChats]);


  const handleSearch = async (e) => {
  e.preventDefault();
  if (!search.trim()) return;

  try {
    setSearching(true);

    // Make parallel API calls
    const [userRes, groupRes] = await Promise.all([
      axios.get(`/auth?search=${search}`),      // 🔍 Users
      axios.get(`/chat/search?name=${search}`), // 🔍 Group Chats
    ]);

    // Optional: add type to identify in UI
    const users = userRes.data.map((user) => ({ ...user, type: "user" }));
    const groupChats = groupRes.data.map((group) => ({ ...group, type: "group" }));

    // Combine results
    setSearchResults([...users, ...groupChats]);
  } catch (err) {
    console.error("Search failed", err);
  } finally {
    setSearching(false);
  }
};


  const handleGroupCreated = (newGroup) => {
    setChats((prev) => [newGroup, ...prev]);
    setSelectedChat(newGroup);
  };

  const accessChat = async (userId) => {
    try {
      const res = await axios.post("/chat/create", { userId });
      const existing = chats.find((c) => c._id === res.data._id);
      if (!existing) {
        setChats((prev) => [res.data, ...prev]);
      }
      setSelectedChat(res.data);
      setSearch("");
      setSearchResults([]);
    } catch (err) {
      console.error("Chat access error", err);
    }
  };

  return (
    <aside className="w-full sm:w-2/3 md:w-2/5 lg:w-[80%] xl:w-[100%] h-[calc(100vh-64px)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 p-4 border-b bg-white dark:bg-gray-900 sticky top-0 z-10"
      >
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={searching}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          <FaSearch />
        </button>
      </form>
      <div>
         <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        + New Group
      </button>
      </div>
      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
      <div className="max-h-60 overflow-y-auto p-2">
        {searchResults.map((item) => (
          <div
            key={item._id}
            onClick={() => accessChat(item._id)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
          >
            <img
              src={
                item.avatar
                  ? `${import.meta.env.VITE_BACKEND_URL}${item.avatar}`
                  : "/default-avatar.webp"
              }
              className="w-10 h-10 rounded-full object-cover"
              alt="avatar"
            />

            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {item.type === "user" ? item.username : item.chatName}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {item.type === "user"
                  ? item.email
                  : `Group Chat • ${item.users?.length || 0} members`}
              </p>
            </div>
          </div>
        ))}
      </div>
      )}


      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <h1 className="text-center text-sm text-gray-500 p-4">
            <Loader />
          </h1>
        ) : (
          chats.map((chat) => {
            const otherUser = chat.members?.find((m) => m._id !== user?._id);
            const name = chat.isGroup ? chat.chatName : otherUser?.username;
            const avatar = chat.isGroup
              ? chat?.avatar
                ? `${import.meta.env.VITE_BACKEND_URL}${chat.avatar}`
                : "/default-avatar.webp"
              : otherUser?.avatar ? `${import.meta.env.VITE_BACKEND_URL}${otherUser.avatar}` : "/default-avatar.webp";

            return (
             <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition ${
                selectedChat?._id === chat._id
                  ? "bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
            >
              <img
                src={avatar || <IoPerson className="text-gray-500" />}
                className="w-15 h-15 rounded-full object-cover flex-shrink-0"
                alt="Chat Avatar"
              />

              {/* Main Text Section */}
              <div className="flex-1 min-w-0"> 
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                  {chat.latestMessage?.text || "Say hello!"}
                </p>
              </div>

              {/* Time */}
              <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {formatChatTime(chat?.updatedAt)}
              </div>
            </div>

                );
              })
            )}
      </div>
    </aside>
  );
};

export default ChatList;
