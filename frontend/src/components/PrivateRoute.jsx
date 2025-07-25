// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // If no user is logged in, redirect to login page
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
