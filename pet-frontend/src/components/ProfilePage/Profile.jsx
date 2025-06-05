import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileView from "./ProfileView";
import ProfileEditForm from "./ProfileEditForm";
import axios from "axios";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, profileData, updateProfile } = useOutletContext();
  const [editMode, setEditMode] = useState(false);
  const [localProfileData, setLocalProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile data if profileData is not provided
  useEffect(() => {
    if (profileData) {
      setLocalProfileData(profileData);
      return;
    }

    // Optional: Fetch profile data if separate endpoint exists
    const fetchProfile = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to view profile.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/profile/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLocalProfileData(response.data);
      } catch (err) {
        console.error(
          "Fetch profile error:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.detail || "Failed to fetch profile data.");
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
          toast.error("Session expired. Please log in again.", {
            position: "bottom-right",
          });
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      setError("No user data available. Please log in.");
      return;
    }
    fetchProfile();
  }, [user, profileData]);

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='flex items-center justify-center'>
          <svg
            className='animate-spin h-8 w-8 text-blue-600'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8v8z'
            />
          </svg>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <p className='text-red-600 dark:text-red-400 text-center text-lg'>
          {error || "No user data available. Please log in."}
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-text-dark'>
          {editMode ? "Edit Profile" : `${user.username}'s Profile`}
        </h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
          aria-label={editMode ? "Cancel editing" : "Edit profile"}
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 transition-all duration-300 animate-fadeIn'>
        {editMode ? (
          <ProfileEditForm
            user={user}
            profileData={localProfileData || user} // Fallback to user if profileData is unavailable
            updateProfile={updateProfile}
            setEditMode={setEditMode}
          />
        ) : (
          <ProfileView
            user={user}
            profileData={localProfileData || user} // Fallback to user
          />
        )}
      </div>
    </div>
  );
}
