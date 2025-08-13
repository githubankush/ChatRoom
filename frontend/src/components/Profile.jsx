import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { FiLogOut, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";

const Profile = ({ user, onClose }) => {
  const backendBase = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get("/auth/logout", { withCredentials: true });
      toast.success("Logout successful");
      setUser(null);
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsUploading(true);
      const res = await axios.put(`${backendBase}/auth/avatar`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      toast.success("Avatar updated!");
    } catch (err) {
      toast.error("Failed to update avatar");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="absolute right-4 top-16 z-50 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 animate-fade-in">
      <div className="flex flex-col items-center text-center">
        <label className="relative cursor-pointer group">
          <img
            className="w-16 h-16 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
             src={`http://localhost:3000${user?.avatar}`} 
            alt="User Avatar"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FiUpload className="text-white text-xl" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </label>

        <h2 className="mt-3 text-lg font-semibold text-gray-800 dark:text-white">
          {user.username}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {user.email || "user@chatroom.com"}
        </p>
        {isUploading && (
          <p className="text-xs text-blue-500 mt-1">Uploading...</p>
        )}
      </div>

      <div className="flex items-center justify-center mt-4 gap-2">
        <button
          onClick={onClose}
          className="w-full text-sm text-center text-red-500 hover:underline"
        >
          Close
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-all shadow-sm"
        >
          <FiLogOut className="text-base" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
