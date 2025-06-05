import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import ThemeToggle from "../components/ThemeToggle";
import axios from "axios";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";

const MainLayout = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      console.log(
        "MainLayout API URL:",
        `${import.meta.env.VITE_API_BASE_URL}/api/user/me/`
      );
      console.log("Retrieved token:", token);

      if (!token) {
        console.log("No token found, redirecting to login");
        setUser(null);
        setIsLoading(false);
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("Token payload:", decoded);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
          console.log("Token expired");
          throw new Error("Token expired");
        }
        console.log("Request headers:", { Authorization: `Bearer ${token}` });
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/me/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("User data response:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
          config: err.config,
        });
        setUser(null);
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        toast.error("Session expired. Please log in again.", {
          position: "bottom-right",
        });
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setUser(null);
    toast.success("Logged out successfully!", {
      position: "bottom-right",
    });
    navigate("/login");
  };

  const updateProfile = (formData) => {
    console.log("Profile updated with:", formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-300 flex'>
      <Navigation handleLogout={handleLogout}/>
      <main className='flex-1 md:ml-64 pt-4 pb-20 md:pb-4 px-4'>
        <Outlet context={{ user, updateProfile, handleLogout }} />
      </main>
    </div>
  );
};

export default MainLayout;
