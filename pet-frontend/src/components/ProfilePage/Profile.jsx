import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import ProfileView from "./ProfileView";
import ProfileEditForm from "./ProfileEditForm";

export default function Profile() {
  const { user, profileData, updateProfile } = useOutletContext();
  const [editMode, setEditMode] = useState(false);

  if (!user) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <p className='text-red-600 dark:text-red-400 text-center text-lg'>
          No user data available.
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-xl font-bold text-text-light dark:text-text-dark'>
          User Profile
        </h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className='bg-blue-600 hover:bg-primary-700 text-white text-base px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ease-in-out focus:outline-none'
          aria-label={editMode ? "Cancel editing" : "Edit profile"}
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className='transition-all duration-300 ease-in-out'>
        {editMode ? (
          <ProfileEditForm
            user={user}
            profileData={profileData}
            updateProfile={updateProfile}
            setEditMode={setEditMode}
          />
        ) : (
          <ProfileView user={user} profileData={profileData} />
        )}
      </div>
    </div>
  );
}
