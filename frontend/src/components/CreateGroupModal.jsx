// src/components/CreateGroupModal.jsx
import { useState } from "react";
import axios from "../axios";
import { useChatContext } from "../context/chatContext";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../context/authContext"; // Assuming you have this context

const CreateGroupModal = ({ onClose }) => {
  const { setChats, setSelectedChat } = useChatContext();
  const { user } = useAuth(); // Get current user
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setSearch(keyword);
    if (!keyword.trim()) return;

    try {
      const res = await axios.get(`/auth?search=${keyword}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const handleSelectUser = (user) => {
    if (selectedUsers.find((u) => u._id === user._id)) return;
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupAvatar(file);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      return alert("Group name and at least 2 users are required.");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("chatName", groupName);
      formData.append("isGroup", true);
      formData.append("members", JSON.stringify(selectedUsers.map((u) => u._id)));
      formData.append("admin", user._id); // Add creator as admin
      if (groupAvatar) {
        formData.append("avatar", groupAvatar);
      }

      const res = await axios.post("/chat/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setChats((prev) => [res.data, ...prev]);
      setSelectedChat(res.data);
      onClose();
    } catch (err) {
      console.error("Group creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Create Group Chat</h2>

        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:text-white"
        />

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={handleSearch}
          className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:text-white"
        />

        <div className="max-h-32 overflow-y-auto mb-3">
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => handleSelectUser(user)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar || "/default-avatar.webp"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-800 dark:text-white">{user.username}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedUsers.map((user) => (
              <div key={user._id} className="flex items-center bg-gray-300 dark:bg-gray-700 px-2 py-1 rounded-full text-sm">
                {user.username}
                <FaTimes
                  className="ml-1 cursor-pointer"
                  onClick={() => handleRemoveUser(user._id)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
