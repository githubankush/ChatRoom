import { useState, useEffect } from "react";
import axios from "../axios";
import { useAuth } from "../context/authContext";
import { useChatContext } from "../context/chatContext";
import { FaSearch } from "react-icons/fa";

const ChatList = () => {
  const { user } = useAuth();
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
      } catch (err) {
        console.error("Error fetching chats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [setChats]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      setSearching(true);
      const res = await axios.get(`/auth?search=${search}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
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

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="max-h-60 overflow-y-auto p-2">
          {searchResults.map((user) => (
            <div
              key={user._id}
              onClick={() => accessChat(user._id)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-center text-sm text-gray-500 p-4">
            Loading chats...
          </p>
        ) : (
          chats.map((chat) => {
            const otherUser = chat.members?.find((m) => m._id !== user?._id);
            const name = chat.isGroup ? chat.chatName : otherUser?.username;
            const avatar = chat.isGroup ? chat?.avatar : otherUser?.avatar;

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
                  src={avatar || "/default-avatar.png"}
                  className="w-15 h-15 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {chat.latestMessage?.text || "Say hello!"}
                  </p>
                </div>
                <div className="test-sm text-gray-500 dark:text-gray-400">
                  {new Date(chat?.updatedAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
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
