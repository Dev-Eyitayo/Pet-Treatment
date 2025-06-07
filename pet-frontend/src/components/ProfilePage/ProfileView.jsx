// const ProfileView = ({ user, profileData }) => {
//   return (
//     <div className=' p-6 w-full max-w-2xl mx-auto'>
//       <div className='flex flex-col items-center gap-6'>
//         <div className='relative group w-32 h-32'>
//           <img
//             src={
//               user.profilepicture
//                 ? `${import.meta.env.VITE_API_BASE_URL}${user.profilepicture}`
//                 : "https://via.placeholder.com/150?text=No+Avatar"
//             }
//             alt={`${user.firstname} ${user.lastname}`}
//             className='w-full h-full object-cover rounded-full shadow-md border-4 border-blue-100 dark:border-slate-700 transition-transform duration-300 group-hover:scale-105'
//             loading='lazy'
//           />
//           <div className='absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300'></div>
//         </div>
//         <div className='w-full space-y-4 text-gray-600 dark:text-text-dark'>
//           <h2 className='text-2xl font-semibold text-gray-900 dark:text-text-dark text-center'>
//             {user.firstname} {user.lastname}
//           </h2>
//           <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
//             <p>
//               <strong className='font-medium'>Email:</strong>{" "}
//               {user.email || "Not provided"}
//             </p>
//             <p>
//               <strong className='font-medium'>Role:</strong>{" "}
//               {user.role || "Not provided"}
//             </p>
//           </div>
//           {user.role === "doctor" && profileData ? (
//             <div className='space-y-4'>
//               <p>
//                 <strong className='font-medium'>Bio:</strong>{" "}
//                 {profileData.bio || "Not provided"}
//               </p>
//               <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
//                 <p>
//                   <strong className='font-medium'>Specialization:</strong>{" "}
//                   {profileData.specialization || "Not provided"}
//                 </p>
//                 <p>
//                   <strong className='font-medium'>Years of Experience:</strong>{" "}
//                   {profileData.years_experience || "Not provided"}
//                 </p>
//                 <p>
//                   <strong className='font-medium'>Address:</strong>{" "}
//                   {profileData.address || "Not provided"}
//                 </p>
//                 <p>
//                   <strong className='font-medium'>Available Days:</strong>{" "}
//                   {profileData.available_days?.length > 0
//                     ? profileData.available_days.join(", ")
//                     : "None"}
//                 </p>
//               </div>
//               {profileData.available_days?.map((day) => (
//                 <p key={day}>
//                   <strong className='font-medium'>{day} Times:</strong>{" "}
//                   {(profileData.available_times?.[day] || []).map((slot, i) => (
//                     <span key={i}>
//                       {slot.from} - {slot.to}
//                       {i < profileData.available_times[day].length - 1
//                         ? ", "
//                         : ""}
//                     </span>
//                   )) || "None"}
//                 </p>
//               ))}
//             </div>
//           ) : (
//             <p className='text-center'>
//               This is a standard user profile. No additional details available.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileView;

const ProfileView = ({ user, profileData }) => {
  const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden w-full max-w-4xl mx-auto'>
      {/* Profile Header */}
      <div className='bg-gradient-to-r from-blue-500 to-blue-600 dark:from-slate-700 dark:to-slate-800 p-6 text-white'>
        <div className='flex flex-col md:flex-row items-center gap-6'>
          <div className='relative group w-32 h-32 shrink-0'>
            <img
              src={
                user.profilepicture
                  ? `${import.meta.env.VITE_API_BASE_URL}${user.profilepicture}`
                  : "https://via.placeholder.com/150?text=No+Avatar"
              }
              alt={`${user.firstname} ${user.lastname}`}
              className='w-full h-full object-cover rounded-full shadow-lg border-4 border-white/30 dark:border-slate-600/50 transition-transform duration-300 group-hover:scale-105'
              loading='lazy'
            />
            <div className='absolute inset-0 rounded-full bg-black/10 group-hover:bg-black/20 transition-all duration-300' />
          </div>
          <div className='text-center md:text-left'>
            <h2 className='text-2xl md:text-3xl font-bold'>
              {user.firstname} {user.lastname}
            </h2>
            <p className='text-blue-100 dark:text-blue-300 mt-1'>
              {user.role === "doctor" ? "Medical Professional" : "Pet Owner"}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className='p-6 md:p-8 space-y-6'>
        {/* Basic Info Section */}
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-slate-700'>
            Basic Information
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg'>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Email
              </p>
              <p className='text-gray-800 dark:text-gray-200 mt-1'>
                {user.email || "Not provided"}
              </p>
            </div>
            {/* <div className='bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg'>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Role
              </p>
              <p className='text-gray-800 dark:text-gray-200 mt-1 capitalize'>
                {user.role || "Not provided"}
              </p>
            </div> */}
          </div>
        </div>

        {/* Doctor Specific Info */}
        {user.role === "doctor" && profileData && (
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-slate-700'>
              Professional Details
            </h3>

            <div className='bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg'>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                Bio
              </p>
              <p className='text-gray-800 dark:text-gray-200 mt-1'>
                {profileData.bio || "Not provided"}
              </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg'>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Specialization
                </p>
                <p className='text-gray-800 dark:text-gray-200 mt-1'>
                  {profileData.specialization || "Not provided"}
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg'>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Experience
                </p>
                <p className='text-gray-800 dark:text-gray-200 mt-1'>
                  {profileData.years_experience || "0"} years
                </p>
              </div>
              <div className='bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg sm:col-span-2'>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  Address
                </p>
                <p className='text-gray-800 dark:text-gray-200 mt-1'>
                  {profileData.address || "Not provided"}
                </p>
              </div>
            </div>

            {/* Availability Section */}
            <div className='space-y-4'>
              <h4 className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                Availability
              </h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className={`p-4 rounded-lg border ${
                      profileData.available_days?.includes(day)
                        ? "border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800/50"
                        : "border-gray-200 bg-gray-50/50 dark:bg-slate-700/30 dark:border-slate-700"
                    }`}
                  >
                    <p className='font-medium text-gray-700 dark:text-gray-300'>
                      {day}
                    </p>
                    {profileData.available_days?.includes(day) ? (
                      <div className='mt-2 space-y-1'>
                        {(profileData.available_times?.[day] || []).map(
                          (slot, i) => (
                            <p
                              key={i}
                              className='text-sm text-gray-600 dark:text-gray-400'
                            >
                              {slot.from} - {slot.to}
                            </p>
                          )
                        )}
                      </div>
                    ) : (
                      <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
                        Not available
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
