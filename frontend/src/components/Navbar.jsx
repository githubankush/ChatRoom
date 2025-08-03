import React, { useState } from "react";
import { FiMessageCircle, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "../axios";
import { toast } from "react-hot-toast";
import Profile from "./Profile"; // Make sure this path is correct

const Navbar = () => {
  const { user, setUser } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800 relative z-40">
      {/* Logo / Chat Title */}
      <div className="flex items-center gap-3 sm:gap-4 animate-fade-in">
        <Link to="/" className="flex items-center gap-2 group">
          <FiMessageCircle
            className="text-3xl text-blue-600 drop-shadow-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            aria-label="ChatRoom logo"
          />
          <h1 className="text-2xl tracking-wide sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text transition-all duration-300 group-hover:tracking-widest">
            ChatRoom
          </h1>
        </Link>
      </div>

      {/* Right Side */}
      <div className="relative flex items-center gap-3 sm:gap-4">
        {user && (
          <>
            <button
              onClick={() => setShowProfile((prev) => !prev)}
              className="text-sm text-gray-800 dark:text-white font-medium hover:underline"
            >
              {<img className="w-10 h-10 rounded-full hover:opacity-80 " src={`${user?.avatar}`} />} 
            </button>
            {user.username}
            {showProfile && (
              <Profile user={user} onClose={() => setShowProfile(false)} />
            )}
          </>
        )}

        {!user && (
          <>
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 text-sm font-medium text-purple-600 border border-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition-all"
            >
              Register
            </Link>
          </>
        ) }
      </div>
    </nav>
  );
};

export default Navbar;
