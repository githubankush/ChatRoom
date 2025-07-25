import React from "react";
import { FiMessageCircle, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "../axios";
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear user data and token (optional: call logout API)
    await axios.get("/auth/logout", { withCredentials: true });
    alert("Logout successful");
    toast.success("Logout successful");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow-md">
      {/* Logo / Chat Title */}
      <div className="flex items-center space-x-2">
        <FiMessageCircle className="text-2xl text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          ChatRoom
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Greeting */}
        {user && (
          <span className="text-gray-800 dark:text-white hidden sm:inline">
            Hello, {user.username}
          </span>
        )}

        {/* Auth Buttons */}
        {!user ? (
          <>
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:underline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm text-blue-600 hover:underline"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            <FiLogOut className="inline-block mr-1" />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
