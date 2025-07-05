import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileView from "./ProfileView";
import ProfileEditForm from "./ProfileEditForm";
import axios from "axios";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, updateProfile } = useOutletContext();
  const [editMode, setEditMode] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      setDoctorProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchDoctorProfile = async () => {
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
          `${import.meta.env.VITE_API_BASE_URL}/api/doctorprofiles/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDoctorProfile(response.data);
        setError(null);
      } catch (err) {
        console.error(
          "Fetch doctor profile error:",
          err.response?.data || err.message
        );
        const errorMsg =
          err.response?.data?.error || "Failed to fetch doctor profile.";
        setError(errorMsg);
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

    fetchDoctorProfile();
  }, [user]);

  if (!user) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center'>
          <div className='text-red-500 dark:text-red-400 text-lg p-4 rounded-lg bg-red-50 dark:bg-red-900/20'>
            No user data available. Please log in.
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 flex justify-center'>
          <div className='animate-pulse flex flex-col items-center space-y-4'>
            <div className='rounded-full bg-gray-200 dark:bg-slate-700 h-32 w-32'></div>
            <div className='h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4'></div>
            <div className='h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8'>
          <div className='text-red-500 dark:text-red-400 text-lg p-4 rounded-lg bg-red-50 dark:bg-red-900/20'>
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 sm:py-12'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-8 gap-4'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
          {editMode ? "Edit Profile" : "My Profile"}
        </h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 w-full sm:w-auto ${
            editMode
              ? "bg-gray-500 hover:bg-gray-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
          }`}
          aria-label={editMode ? "Cancel editing" : "Edit profile"}
        >
          {editMode ? "Cancel Editing" : "Edit Profile"}
        </button>
      </div>

      <div className='transition-all duration-300'>
        {editMode ? (
          <ProfileEditForm
            user={user}
            profileData={doctorProfile}
            updateProfile={updateProfile}
            setEditMode={setEditMode}
          />
        ) : (
          <ProfileView user={user} profileData={doctorProfile} />
        )}
      </div>
    </div>
  );
}
