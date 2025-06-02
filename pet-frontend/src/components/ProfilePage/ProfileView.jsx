const ProfileView = ({ user, profileData }) => {
  return (
    <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg md:p-6 sm:p-2 p-4 flex flex-col md:flex-row items-center gap-6 sm:gap-8'>
      {user.profilepicture && (
        <div className='relative group'>
          <img
            src={user.profilepicture}
            alt={`${user.firstname} ${user.lastname}`}
            className='w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-full shadow-md transition-transform duration-300 group-hover:scale-105'
            loading='lazy'
          />
          <div className='absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300'></div>
        </div>
      )}
      <div className='flex-1 space-y-4 text-text-light dark:text-text-dark'>
        <h2 className='text-2xl font-semibold'>
          {user.firstname} {user.lastname}
        </h2>
        {user.role === "doctor" ? (
          <>
            <p>
              <strong className='font-medium'>Bio:</strong>{" "}
              {profileData?.bio || "Not provided"}
            </p>
            <p>
              <strong className='font-medium'>Specialization:</strong>{" "}
              {profileData?.specialization || "Not provided"}
            </p>
            <p>
              <strong className='font-medium'>Years of Experience:</strong>{" "}
              {profileData?.years_experience || "Not provided"}
            </p>
            <p>
              <strong className='font-medium'>Address:</strong>{" "}
              {profileData?.address || "Not provided"}
            </p>
            <p>
              <strong className='font-medium'>Available Days:</strong>{" "}
              {profileData?.available_days?.length > 0
                ? profileData.available_days.join(", ")
                : "None"}
            </p>
            {profileData?.available_days?.map((day) => (
              <p key={day}>
                <strong className='font-medium'>{day} Times:</strong>{" "}
                {(profileData.available_times?.[day] || []).map((slot, i) => (
                  <span key={i}>
                    {slot.from} - {slot.to}
                    {i < profileData.available_times[day].length - 1
                      ? ", "
                      : ""}
                  </span>
                )) || "None"}
              </p>
            ))}
          </>
        ) : (
          <p>
            This is a standard user profile. No additional details available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
