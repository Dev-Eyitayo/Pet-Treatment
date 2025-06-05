// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getToken = () =>
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  const refreshToken = async () => {
    const refresh =
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken");
    if (!refresh) {
      throw new Error("No refresh token available");
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
        { refresh }
      );
      const newToken = response.data.access;
      localStorage.setItem("authToken", newToken);
      sessionStorage.setItem("authToken", newToken);
      return newToken;
    } catch (err) {
      console.error("Refresh token error:", err.response?.data || err.message);
      throw err;
    }
  };

  const fetchUser = async () => {
    console.log(
      "fetchUser: Starting, API URL:",
      `${import.meta.env.VITE_API_BASE_URL}/api/user/me/`
    );
    const token = getToken();
    console.log("fetchUser: Token:", token);
    if (!token) {
      console.log("fetchUser: No token, redirecting to login");
      navigate("/login");
      setLoading(false);
      return;
    }
    try {
      let decoded;
      try {
        decoded = jwtDecode(token);
        console.log("fetchUser: Token payload:", decoded);
      } catch (decodeErr) {
        console.error("fetchUser: Token decode error:", decodeErr);
        throw new Error("Invalid token format");
      }
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        console.log("fetchUser: Token expired, refreshing...");
        const newToken = await refreshToken();
        if (!newToken) {
          throw new Error("Failed to refresh token");
        }
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/me/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("fetchUser: User data:", response.data);
      setUser(response.data);
    } catch (err) {
      console.error("fetchUser: Error:", err.message, err.response?.data);
      setUser(null);
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      toast.error("Session expired. Please log in again.", {
        position: "bottom-right",
      });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Running useEffect to fetch user");
    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div className='text-center p-6'>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, getToken, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
