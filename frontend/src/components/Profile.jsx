// components/Profile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";

const Profile = ({ user, onClose }) => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
    try {
      await axios.get("/auth/logout", { withCredentials: true });
      alert("Logout successful");
      toast.success("Logout successful");
      setUser(null);
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };
  return (
    <div className="absolute right-4 top-16 z-50 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 animate-fade-in">
      <div className="flex flex-col items-center text-center">
       <img className="w-16 h-16 object-cover rounded-full"
            src={`${user?.avatar}`}
            alt="User Avatar"
            />
        <h2 className="mt-3 text-lg font-semibold text-gray-800 dark:text-white">
          {user.username}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {user.email || "user@chatroom.com"}
        </p>
      </div>
       
       <div className="flex items-center justify-center mt-4 gap-2">

      <button
        onClick={onClose}
        className=" w-full text-sm text-center text-red-500 hover:underline"
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
