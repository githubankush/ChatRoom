// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Chat from "./pages/Chat";
import { ChatProvider } from "./context/chatContext";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import FriendRequestList from "./components/FriendRequestList";
import Error from "./components/Error";
import useSocketEvents from "./hooks/useSocketEvents";

const App = () => {
   useSocketEvents();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Fixed height navbar */}
      <header className="h-16 shadow-md z-10">
        <Navbar />
      </header>

      {/* Main area fills rest of the screen */}
      <main className="flex-1 max-h-[calc(100vh-64px)] overflow-y-auto">
        <Routes>
          <Route path="/" element={<div className="text-center text-xl"><Home /></div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/friend" element={<FriendRequestList />} />
          <Route path="*" element={<Error />} />
          <Route
            path="/chat"
            element={
              <ChatProvider>
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              </ChatProvider>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
