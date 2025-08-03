import React from "react";
import { Link } from "react-router-dom";
import AnimateChat from "../components/AnimateChat";

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex flex-col justify-center items-center text-white px-4">
      {/* Title Section */}
 
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to ChatRoom 💬</h1>
        <p className="text-lg max-w-md mx-auto">
          Connect with your friends and the world around you in real-time. Enjoy seamless messaging in a modern interface.
        </p>
      </div>

      {/* Illustration or Icon */}
      <div className="my-10">
        {/* <img
          src="https://cdn-icons-png.flaticon.com/512/2589/2589175.png"
          alt="Chat Illustration"
          className="w-48 h-48 animate-bounce drop-shadow-lg"
        /> */}
        <AnimateChat />
      </div>

      {/* Button to Chat Page */}
      <Link
        to="/chat"
        className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:bg-gray-100 transition duration-300"
      >
        Enter Chat Room
      </Link>

      {/* Footer */}
      <div className="absolute bottom-5 text-sm text-white/80">
        Made with ❤️ by Ankush
      </div>
    </div>
  );
};

export default Home;
