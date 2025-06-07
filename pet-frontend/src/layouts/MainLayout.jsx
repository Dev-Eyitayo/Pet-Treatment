import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import ThemeToggle from "../components/ThemeToggle";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const MainLayout = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        setUser(null);
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
          throw new Error("Token expired");
        }
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/me/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
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

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setUser(null);
    toast.success("Successfully logged out!", { position: "bottom-right" });
    navigate("/login");
  };

  const updateProfile = async ({
    user: userFormData,
    doctor: doctorFormData = null,
  }) => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to update profile.", {
        position: "bottom-right",
      });
      navigate("/login");
      throw new Error("No token found");
    }

    try {
      console.log("User FormData:");
      for (const [key, value] of userFormData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const userResponse = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/me/`,
        userFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("User update response:", userResponse.data);
      setUser(userResponse.data);

      let doctorResponse = null;
      if (doctorFormData && doctorFormData.has("bio")) {
        console.log("Doctor FormData:");
        for (const [key, value] of doctorFormData.entries()) {
          console.log(`${key}: ${value}`);
        }
        doctorResponse = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/doctorprofiles/me/`,
          doctorFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Doctor update response:", doctorResponse.data);
      }

      // toast.success("Profile updated successfully!", {
      //   position: "bottom-right",
      // });
      window.location.reload();
      return { user: userResponse.data, doctor: doctorResponse?.data };
    } catch (err) {
      console.error("Update profile error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        stack: err.stack,
      });
      const errorData = err.response?.data;
      let errorMessage = "Failed to update profile. Please try again.";
      if (errorData) {
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else {
          errorMessage = Object.entries(errorData)
            .map(([key, errors]) => `${key}: ${errors.join(", ")}`)
            .join("; ");
        }
      }
      // toast.error(errorMessage, { position: "bottom-right" });
      throw err; // Re-throw to preserve original error for caller
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-300 flex'>
      <Navigation handleLogout={handleLogout} />
      <main className='flex-1 md:ml-64 pt-4 pb-20 md:pb-4 px-4 sm:px-6 lg:px-8'>
        <Outlet context={{ user, updateProfile, handleLogout }} />
      </main>
    </div>
  );
};

export default MainLayout;
