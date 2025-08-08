import { IoClose, IoPersonCircleOutline } from "react-icons/io5";
import { MdAdminPanelSettings, MdPeopleAlt } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";

const GroupChatDetails = ({ chat, onClose }) => {
  if (!chat) return null;

  const createdAtFormatted = new Date(chat.createdAt).toLocaleString();

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-lg z-50 flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Group Info
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
        >
          <IoClose className="text-2xl text-gray-500 dark:text-gray-300" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* Group Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={
              chat?.avatar
                ? `${import.meta.env.VITE_BACKEND_URL}${chat.avatar}`
                : "/default-avatar.png"
            }
            className="w-24 h-24 rounded-full object-cover border shadow-sm"
            alt="Group Avatar"
          />
          <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
            {chat.chatName || "Unnamed Group"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {chat.members?.length || 0} members
          </p>
        </div>

        {/* Group Details */}
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">

          {/* Created By */}
          <div className="flex items-center gap-2">
            <MdAdminPanelSettings className="text-blue-500 text-lg" />
            <p>
              <strong>Created by:</strong> {chat.admin?.username || "Unknown"}
            </p>
          </div>

          {/* Created At */}
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-green-500 text-lg" />
            <p>
              <strong>Created at:</strong> {createdAtFormatted}
            </p>
          </div>

          {/* Admin */}
          <div className="flex items-center gap-2">
            <IoPersonCircleOutline className="text-yellow-500 text-lg" />
            <p>
              <strong>Admin:</strong> {chat.admin?.username || "Unknown"}
            </p>
          </div>
        </div>

        {/* Member List */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MdPeopleAlt className="text-purple-500 text-lg" />
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Members
            </h3>
          </div>
          <ul className="space-y-2">
            {chat.members?.map((member) => (
              <li
                key={member._id}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg shadow-sm"
              >
                <img
                  src={
                    member.avatar
                      ? `${import.meta.env.VITE_BACKEND_URL}${member.avatar}`
                      : "/default-avatar.webp"
                  }
                  alt="Member Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-900 dark:text-white">
                  {member.username}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GroupChatDetails;
