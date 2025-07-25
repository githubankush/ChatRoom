import { createContext, useContext, useState, useEffect } from "react";
import axios from "../axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true initially

  // Fetch the user profile once on mount
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/auth/profile", {
        withCredentials: true,
      });
      console.log("✅ User profile fetched:", res.data);
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user profile:", err?.response?.data?.message || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing context easily
export const useAuth = () => useContext(AuthContext);
