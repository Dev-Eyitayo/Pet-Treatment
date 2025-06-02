// import { useOutletContext } from "react-router-dom";
// import { useState } from "react";

// const DAYS_OF_WEEK = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

// export default function Profile() {
//   // Retrieve dummy data from Outlet context
//   const { user, profileData, updateProfile } = useOutletContext();

//   const [editMode, setEditMode] = useState(false);
//   const [form, setForm] = useState({
//     firstname: user?.firstname || "",
//     lastname: user?.lastname || "",
//     profilepicture: user?.profilepicture || null,
//     bio: profileData?.bio || "",
//     specialization: profileData?.specialization || "",
//     available_days: profileData?.available_days || [],
//     available_times: profileData?.available_times || {},
//     years_experience: profileData?.years_experience || 0,
//     address: profileData?.address || "",
//   });
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const errs = {};
//     if (!form.firstname.trim()) errs.firstname = "First name is required";
//     if (!form.lastname.trim()) errs.lastname = "Last name is required";
//     if (user?.role === "doctor") {
//       if (!form.bio.trim()) errs.bio = "Bio is required";
//       if (!form.specialization.trim())
//         errs.specialization = "Specialization is required";
//       if (!form.address.trim()) errs.address = "Address is required";
//       if (form.years_experience <= 0 || isNaN(form.years_experience))
//         errs.years_experience = "Valid years of experience is required";
//       if (form.available_days.length === 0)
//         errs.available_days = "At least one available day is required";
//       Object.keys(form.available_times).forEach((day) => {
//         form.available_times[day].forEach((slot, index) => {
//           if (!slot.from || !slot.to) {
//             errs[`time_${day}_${index}`] = `Time slot for ${day} is incomplete`;
//           }
//         });
//       });
//     }
//     return errs;
//   };

//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//   };

//   const toggleDay = (day) => {
//     const updated = form.available_days.includes(day)
//       ? form.available_days.filter((d) => d !== day)
//       : [...form.available_days, day];
//     setForm((prev) => ({ ...prev, available_days: updated }));
//     setErrors((prev) => ({ ...prev, available_days: undefined }));
//   };

//   const handleTimeChange = (day, index, field, value) => {
//     const dayTimes = form.available_times[day] || [{ from: "", to: "" }];
//     dayTimes[index][field] = value;
//     setForm((prev) => ({
//       ...prev,
//       available_times: { ...prev.available_times, [day]: [...dayTimes] },
//     }));
//     setErrors((prev) => ({ ...prev, [`time_${day}_${index}`]: undefined }));
//   };

//   const addTimeSlot = (day) => {
//     const dayTimes = form.available_times[day] || [];
//     setForm((prev) => ({
//       ...prev,
//       available_times: {
//         ...prev.available_times,
//         [day]: [...dayTimes, { from: "", to: "" }],
//       },
//     }));
//   };

//   const handleSubmit = () => {
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     setErrors({});
//     updateProfile(form);
//     setEditMode(false);
//   };

//   // Fallback UI if user is not available
//   if (!user) {
//     return (
//       <div className='max-w-4xl mx-auto px-6 py-12'>
//         <p className='text-red-500'>No user data available.</p>
//       </div>
//     );
//   }

//   return (
//     <div className='max-w-4xl mx-auto px-6 py-12'>
//       <div className='flex justify-between items-center mb-8'>
//         <h1 className='text-3xl font-bold text-text-light dark:text-text-dark'>
//           User Profile
//         </h1>
//         <button
//           onClick={() => setEditMode(!editMode)}
//           className='bg-blue-600 hover:bg-primary-700 text-text-light dark:text-text-dark px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ease-in-out'
//           aria-label={editMode ? "Cancel editing" : "Edit profile"}
//         >
//           {editMode ? "Cancel" : "Edit Profile"}
//         </button>
//       </div>

//       <div className='transition-all duration-300 ease-in-out'>
//         {!editMode ? (
//           // View Mode
//           <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8'>
//             {form.profilepicture && (
//               <div className='relative group'>
//                 <img
//                   src={
//                     typeof form.profilepicture === "string"
//                       ? form.profilepicture
//                       : URL.createObjectURL(form.profilepicture)
//                   }
//                   alt={`${form.firstname} ${form.lastname}`}
//                   className='w-48 h-48 object-cover rounded-full shadow-md transition-transform duration-300 group-hover:scale-105'
//                   loading='lazy'
//                 />
//                 <div className='absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300'></div>
//               </div>
//             )}
//             <div className='flex-1 space-y-4'>
//               <h2 className='text-2xl font-semibold text-text-light dark:text-text-dark'>
//                 {form.firstname} {form.lastname}
//               </h2>
//               {user.role === "doctor" ? (
//                 <>
//                   <p className='text-text-light dark:text-text-dark'>
//                     <strong className='font-medium'>Bio:</strong>{" "}
//                     {form.bio || "Not provided"}
//                   </p>
//                   <p className='text-text-light dark:text-text-dark'>
//                     <strong className='font-medium'>Specialization:</strong>{" "}
//                     {form.specialization || "Not provided"}
//                   </p>
//                   <p className='text-text-light dark:text-text-dark'>
//                     <strong className='font-medium'>
//                       Years of Experience:
//                     </strong>{" "}
//                     {form.years_experience || "Not provided"}
//                   </p>
//                   <p className='text-text-light dark:text-text-dark'>
//                     <strong className='font-medium'>Address:</strong>{" "}
//                     {form.address || "Not provided"}
//                   </p>
//                   <p className='text-text-light dark:text-text-dark'>
//                     <strong className='font-medium'>Available Days:</strong>{" "}
//                     {form.available_days.length > 0
//                       ? form.available_days.join(", ")
//                       : "None"}
//                   </p>
//                   {form.available_days.map((day) => (
//                     <p
//                       key={day}
//                       className='text-text-light dark:text-text-dark'
//                     >
//                       <strong className='font-medium'>{day} Times:</strong>{" "}
//                       {(form.available_times[day] || []).map((slot, i) => (
//                         <span key={i}>
//                           {slot.from} - {slot.to}
//                           {i < form.available_times[day].length - 1 ? ", " : ""}
//                         </span>
//                       )) || "None"}
//                     </p>
//                   ))}
//                 </>
//               ) : (
//                 <p className='text-text-light dark:text-text-dark'>
//                   This is a standard user profile. No additional details
//                   available.
//                 </p>
//               )}
//             </div>
//           </div>
//         ) : (
//           // Edit Mode
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSubmit();
//             }}
//             className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 max-w-lg mx-auto space-y-6'
//           >
//             <div className='relative'>
//               <label
//                 htmlFor='firstname'
//                 className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
//               >
//                 First Name <span className='text-red-500'>*</span>
//               </label>
//               <input
//                 id='firstname'
//                 type='text'
//                 value={form.firstname}
//                 onChange={(e) => handleChange("firstname", e.target.value)}
//                 className={`w-full px-4 py-2 rounded-md border ${
//                   errors.firstname
//                     ? "border-red-500"
//                     : "border-gray-300 dark:border-slate-600"
//                 } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark transition-all duration-200`}
//                 placeholder='e.g., John'
//                 aria-invalid={errors.firstname ? "true" : "false"}
//                 aria-describedby={
//                   errors.firstname ? "firstname-error" : undefined
//                 }
//               />
//               {errors.firstname && (
//                 <p
//                   id='firstname-error'
//                   className='text-red-500 mt-1 text-sm flex items-center'
//                 >
//                   <svg
//                     className='w-4 h-4 mr-1'
//                     fill='currentColor'
//                     viewBox='0 0 20 20'
//                   >
//                     <path
//                       fillRule='evenodd'
//                       d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
//                       clipRule='evenodd'
//                     />
//                   </svg>
//                   {errors.firstname}
//                 </p>
//               )}
//             </div>

//             <div className='relative'>
//               <label
//                 htmlFor='lastname'
//                 className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
//               >
//                 Last Name <span className='text-red-500'>*</span>
//               </label>
//               <input
//                 id='lastname'
//                 type='text'
//                 value={form.lastname}
//                 onChange={(e) => handleChange("lastname", e.target.value)}
//                 className={`w-full px-4 py-2 rounded-md border ${
//                   errors.lastname
//                     ? "border-red-500"
//                     : "border-gray-300 dark:border-slate-600"
//                 } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark transition-all duration-200`}
//                 placeholder='e.g., Doe'
//                 aria-invalid={errors.lastname ? "true" : "false"}
//                 aria-describedby={
//                   errors.lastname ? "lastname-error" : undefined
//                 }
//               />
//               {errors.lastname && (
//                 <p
//                   id='lastname-error'
//                   className='text-red-500 mt-1 text-sm flex items-center'
//                 >
//                   <svg
//                     className='w-4 h-4 mr-1'
//                     fill='currentColor'
//                     viewBox='0 0 20 20'
//                   >
//                     <path
//                       fillRule='evenodd'
//                       d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
//                       clipRule='evenodd'
//                     />
//                   </svg>
//                   {errors.lastname}
//                 </p>
//               )}
//             </div>

//             <div className='relative'>
//               <label
//                 htmlFor='profilepicture'
//                 className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
//               >
//                 Profile Picture
//               </label>
//               <input
//                 id='profilepicture'
//                 type='file'
//                 onChange={(e) =>
//                   handleChange("profilepicture", e.target.files[0])
//                 }
//                 className='block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark file:bg-blue-50 dark:file:bg-blue-900 file:border-none file:px-4 file:py-2 file:rounded file:text-blue-600 dark:file:text-blue-300 file:cursor-pointer hover:file:bg-blue-100 dark:hover:file:bg-blue-800 transition-all duration-200'
//               />
//             </div>

//             {user.role === "doctor" && (
//               <>
//                 <div className='relative'>
//                   <label
//                     htmlFor='bio'
//                     className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
//                   >
//                     Bio <span className='text-red-500'>*</span>
//                   </label>
//                   <textarea
//                     id='bio'
//                     value={form.bio}
//                     onChange={(e) => handleChange("bio", e.target.value)}
//                     rows={4}
//                     className={`w-full px-4 py-2 rounded-md border ${
//                       errors.bio
//                         ? "border-red-500"
//                         : "border-gray-300 dark:border-slate-600"
//                     } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark transition-all duration-200`}
//                     placeholder='Tell us about yourself'
//                     aria-invalid={errors.bio ? "true" : "false"}
//                     aria-describedby={errors.bio ? "bio-error" : undefined}
//                   />
//                   {errors.bio && (
//                     <p
//                       id='bio-error'
//                       className='text-red-500 mt-1 text-sm flex items-center'
//                     >
//                       <svg
//                         className='w-4 h-4 mr-1'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       {errors.bio}
//                     </p>
//                   )}
//                 </div>

//                 <div className='relative'>
//                   <label
//                     htmlFor='specialization'
//                     className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
//                   >
//                     Specialization <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     id='specialization'
//                     type='text'
//                     value={form.specialization}
//                     onChange={(e) =>
//                       handleChange("specialization", e.target.value)
//                     }
//                     className={`w-full px-4 py-2 rounded-md border ${
//                       errors.specialization
//                         ? "border-red-500"
//                         : "border-gray-300 dark:border-slate-600"
//                     } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark transition-all duration-200`}
//                     placeholder='e.g., Cardiology'
//                     aria-invalid={errors.specialization ? "true" : "false"}
//                     aria-describedby={
//                       errors.specialization ? "specialization-error" : undefined
//                     }
//                   />
//                   {errors.specialization && (
//                     <p
//                       id='specialization-error'
//                       className='text-red-500 mt-1 text-sm flex items-center'
//                     >
//                       <svg
//                         className='w-4 h-4 mr-1'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       {errors.specialization}
//                     </p>
//                   )}
//                 </div>

//                 <div className='relative'>
//                   <label
//                     htmlFor='years_experience'
//                     className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
//                   >
//                     Years of Experience <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     id='years_experience'
//                     type='number'
//                     min='0'
//                     value={form.years_experience}
//                     onChange={(e) =>
//                       handleChange("years_experience", parseInt(e.target.value))
//                     }
//                     className={`w-full px-4 py-2 rounded-md border ${
//                       errors.years_experience
//                         ? "border-red-500"
//                         : "border-gray-300 dark:border-slate-600"
//                     } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark transition-all duration-200`}
//                     placeholder='e.g., 5'
//                     aria-invalid={errors.years_experience ? "true" : "false"}
//                     aria-describedby={
//                       errors.years_experience
//                         ? "years_experience-error"
//                         : undefined
//                     }
//                   />
//                   {errors.years_experience && (
//                     <p
//                       id='years_experience-error'
//                       className='text-red-500 mt-1 text-sm flex items-center'
//                     >
//                       <svg
//                         className='w-4 h-4 mr-1'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       {errors.years_experience}
//                     </p>
//                   )}
//                 </div>

//                 <div className='relative'>
//                   <label
//                     htmlFor='address'
//                     className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
//                   >
//                     Address <span className='text-red-500'>*</span>
//                   </label>
//                   <input
//                     id='address'
//                     type='text'
//                     value={form.address}
//                     onChange={(e) => handleChange("address", e.target.value)}
//                     className={`w-full px-4 py-2 rounded-md border ${
//                       errors.address
//                         ? "border-red-500"
//                         : "border-gray-300 dark:border-slate-600"
//                     } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark transition-all duration-200`}
//                     placeholder='e.g., 123 Main St, City'
//                     aria-invalid={errors.address ? "true" : "false"}
//                     aria-describedby={
//                       errors.address ? "address-error" : undefined
//                     }
//                   />
//                   {errors.address && (
//                     <p
//                       id='address-error'
//                       className='text-red-500 mt-1 text-sm flex items-center'
//                     >
//                       <svg
//                         className='w-4 h-4 mr-1'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       {errors.address}
//                     </p>
//                   )}
//                 </div>

//                 <div className='relative'>
//                   <h3 className='text-sm font-medium text-text-light dark:text-text-dark mb-2'>
//                     Available Days <span className='text-red-500'>*</span>
//                   </h3>
//                   <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
//                     {DAYS_OF_WEEK.map((day) => (
//                       <label
//                         key={day}
//                         className='flex items-center space-x-2 text-text-light dark:text-text-dark'
//                       >
//                         <input
//                           type='checkbox'
//                           checked={form.available_days.includes(day)}
//                           onChange={() => toggleDay(day)}
//                           className='w-4 h-4 rounded border-gray-300 dark:border-slate-600 focus:ring-primary-500 transition-all duration-200'
//                         />
//                         <span>{day}</span>
//                       </label>
//                     ))}
//                   </div>
//                   {errors.available_days && (
//                     <p
//                       id='available_days-error'
//                       className='text-red-500 mt-1 text-sm flex items-center'
//                     >
//                       <svg
//                         className='w-4 h-4 mr-1'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       {errors.available_days}
//                     </p>
//                   )}
//                 </div>

//                 {form.available_days.map((day) => (
//                   <div
//                     key={day}
//                     className='border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-700 shadow-sm'
//                   >
//                     <h4 className='text-sm font-semibold text-text-light dark:text-text-dark mb-2'>
//                       {day} Time Slots
//                     </h4>
//                     {(form.available_times[day] || [{ from: "", to: "" }]).map(
//                       (slot, index) => (
//                         <div
//                           key={index}
//                           className='flex items-center gap-2 mt-2 w-full'
//                         >
//                           <input
//                             type='time'
//                             value={slot.from}
//                             onChange={(e) =>
//                               handleTimeChange(
//                                 day,
//                                 index,
//                                 "from",
//                                 e.target.value
//                               )
//                             }
//                             className={`w-1/2 px-2 py-1 rounded-md border ${
//                               errors[`time_${day}_${index}`]
//                                 ? "border-red-500"
//                                 : "border-gray-300 dark:border-slate-600"
//                             } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark transition-all duration-200`}
//                             aria-invalid={
//                               errors[`time_${day}_${index}`] ? "true" : "false"
//                             }
//                             aria-describedby={
//                               errors[`time_${day}_${index}`]
//                                 ? `time_${day}_${index}-error`
//                                 : undefined
//                             }
//                           />
//                           <input
//                             type='time'
//                             value={slot.to}
//                             onChange={(e) =>
//                               handleTimeChange(day, index, "to", e.target.value)
//                             }
//                             className={`w-1/2 px-2 py-1 rounded-md border ${
//                               errors[`time_${day}_${index}`]
//                                 ? "border-red-500"
//                                 : "border-gray-300 dark:border-slate-600"
//                             } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark transition-all duration-200`}
//                             aria-invalid={
//                               errors[`time_${day}_${index}`] ? "true" : "false"
//                             }
//                             aria-describedby={
//                               errors[`time_${day}_${index}`]
//                                 ? `time_${day}_${index}-error`
//                                 : undefined
//                             }
//                           />
//                           {errors[`time_${day}_${index}`] && (
//                             <p
//                               id={`time_${day}_${index}-error`}
//                               className='text-red-500 mt-1 text-sm flex items-center'
//                             >
//                               <svg
//                                 className='w-4 h-4 mr-1'
//                                 fill='currentColor'
//                                 viewBox='0 0 20 20'
//                               >
//                                 <path
//                                   fillRule='evenodd'
//                                   d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
//                                   clipRule='evenodd'
//                                 />
//                               </svg>
//                               {errors[`time_${day}_${index}`]}
//                             </p>
//                           )}
//                         </div>
//                       )
//                     )}
//                     <button
//                       type='button'
//                       onClick={() => addTimeSlot(day)}
//                       className='mt-3 text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-primary-700 font-semibold shadow-md transition-all duration-200'
//                     >
//                       + Add Slot
//                     </button>
//                   </div>
//                 ))}
//               </>
//             )}

//             <div className='flex gap-4'>
//               <button
//                 type='submit'
//                 className='flex-1 bg-blue-600 hover:bg-primary-700 text-text-dark dark:text-text-dark font-semibold py-3 rounded-lg shadow-md transition-all duration-200'
//               >
//                 Save Changes
//               </button>
//               <button
//                 type='button'
//                 onClick={() => setEditMode(false)}
//                 className='flex-1 bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-600 text-text-dark dark:text-text-dark font-semibold py-3 rounded-lg shadow-md transition-all duration-200'
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
