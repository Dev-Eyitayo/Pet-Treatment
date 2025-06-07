import { useState, useEffect } from "react"; // Add useEffect
import { toast } from "react-toastify";
import InputField from "./InputField";
import AvailableDaysSelector from "./AvailableDaysSelector";
import TimeSlotInput from "./TimeSlotInput";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ProfileEditForm = ({ user, profileData, updateProfile, setEditMode }) => {
  const [form, setForm] = useState({
    email: user?.email || "",
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    profilepicture: null,
    clearProfilePicture: false,
    bio: profileData?.bio || "",
    specialization: profileData?.specialization || "",
    available_days: profileData?.available_days || [],
    available_times: Object.keys(profileData?.available_times || {}).reduce(
      (acc, day) => {
        const slot = profileData.available_times[day][0] || {
          from: "",
          to: "",
        };
        acc[day] = slot;
        return acc;
      },
      {}
    ),
    years_experience: profileData?.years_experience || 0,
    address: profileData?.address || "",
  });
  const [errors, setErrors] = useState({});
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    user?.profilepicture
      ? `${import.meta.env.VITE_API_BASE_URL}${user.profilepicture}`
      : null
  );

  // Sync profilePicturePreview with user.profilepicture when user prop changes
  useEffect(() => {
    setProfilePicturePreview(
      user?.profilepicture
        ? `${import.meta.env.VITE_API_BASE_URL}${user.profilepicture}`
        : null
    );
  }, [user?.profilepicture]);

  // ... (validate and handleChange unchanged)

  const validate = () => {
    const errs = {};

    // Basic user info validation
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email format";
    if (!form.firstname.trim()) errs.firstname = "First name is required";
    if (!form.lastname.trim()) errs.lastname = "Last name is required";

    // Profile picture validation
    if (form.profilepicture) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(form.profilepicture.type)) {
        errs.profilepicture =
          "Profile picture must be a valid image (jpg, png, gif, webp)";
      } else if (form.profilepicture.size > 5 * 1024 * 1024) {
        errs.profilepicture = "Profile picture size must be less than 5MB";
      }
    }

    // Doctor-specific validation
    if (user?.role === "doctor") {
      if (!form.bio.trim()) errs.bio = "Bio is required";
      if (!form.specialization.trim())
        errs.specialization = "Specialization is required";
      if (!form.address.trim()) errs.address = "Address is required";

      if (
        isNaN(form.years_experience) ||
        form.years_experience < 0 ||
        !Number.isInteger(Number(form.years_experience))
      ) {
        errs.years_experience = "Valid years of experience is required";
      }

      if (form.available_days.length === 0) {
        errs.available_days = "At least one available day is required";
      }

      // Time slots validation
      const daysWithInvalidSlots = [];
      const normalizeTime = (time) => {
        if (!time) return null;
        const [hours, minutes] = time.split(":").map(Number);
        if (
          isNaN(hours) ||
          isNaN(minutes) ||
          hours < 0 ||
          hours > 23 ||
          minutes < 0 ||
          minutes > 59
        )
          return null;
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
      };

      Object.keys(form.available_times).forEach((day) => {
        if (!form.available_days.includes(day)) {
          daysWithInvalidSlots.push(day);
          return;
        }

        const slot = form.available_times[day];
        if (!slot.from || !slot.to) {
          errs[`time_${day}`] = `Time slot for ${day} is incomplete`;
          return;
        }

        const normalizedFrom = normalizeTime(slot.from);
        const normalizedTo = normalizeTime(slot.to);

        if (!normalizedFrom || !normalizedTo) {
          errs[`time_${day}`] = `Invalid time format for ${day} (use HH:MM)`;
          return;
        }

        const fromMinutes =
          parseInt(normalizedFrom.split(":")[0]) * 60 +
          parseInt(normalizedFrom.split(":")[1]);
        const toMinutes =
          parseInt(normalizedTo.split(":")[0]) * 60 +
          parseInt(normalizedTo.split(":")[1]);

        if (fromMinutes >= toMinutes) {
          errs[`time_${day}`] = `'From' time must be earlier than 'To' time`;
        }
      });

      if (daysWithInvalidSlots.length > 0) {
        errs.available_times = `Remove time slots for: ${daysWithInvalidSlots.join(
          ", "
        )} or add them to available days`;
      }
    }

    return errs;
  };

  const handleChange = (field, value) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };
      if (field === "available_days") {
        const newAvailableTimes = {};
        Object.keys(prev.available_times).forEach((day) => {
          if (value.includes(day)) {
            newAvailableTimes[day] = prev.available_times[day];
          }
        });
        newForm.available_times = newAvailableTimes;
      }
      return newForm;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "profilepicture") {
      if (value) {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePicturePreview(reader.result);
        reader.readAsDataURL(value);
        setForm((prev) => ({ ...prev, clearProfilePicture: false }));
      } else {
        setProfilePicturePreview(null);
        setForm((prev) => ({ ...prev, clearProfilePicture: true }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter available_times to include only valid slots
    const filteredAvailableTimes = {};
    form.available_days.forEach((day) => {
      const slot = form.available_times[day];
      if (slot?.from && slot?.to) {
        filteredAvailableTimes[day] = slot;
      }
    });

    const validatedForm = {
      ...form,
      available_times: filteredAvailableTimes,
    };

    const validationErrors = validate(validatedForm);
    console.log("Form State:", validatedForm);
    console.log("Validation Errors:", validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix form errors before submitting.", {
        position: "bottom-right",
      });
      return;
    }

    // Create FormData objects
    const userFormData = new FormData();
    userFormData.append("email", validatedForm.email);
    userFormData.append("firstname", validatedForm.firstname);
    userFormData.append("lastname", validatedForm.lastname);

    if (validatedForm.profilepicture !== undefined) {
      if (validatedForm.clearProfilePicture) {
        userFormData.append("profilepicture-clear", "true");
      } else if (validatedForm.profilepicture) {
        userFormData.append("profilepicture", validatedForm.profilepicture);
      }
    }

    let doctorFormData = null;
    if (user?.role === "doctor") {
      doctorFormData = new FormData();
      doctorFormData.append("bio", validatedForm.bio);
      doctorFormData.append("specialization", validatedForm.specialization);
      doctorFormData.append(
        "years_experience",
        validatedForm.years_experience.toString()
      );
      doctorFormData.append("address", validatedForm.address);
      doctorFormData.append(
        "available_days",
        JSON.stringify(validatedForm.available_days)
      );
      const backendAvailableTimes = {};
      Object.keys(validatedForm.available_times).forEach((day) => {
        backendAvailableTimes[day] = [validatedForm.available_times[day]];
      });
      doctorFormData.append(
        "available_times",
        JSON.stringify(backendAvailableTimes)
      );
    }

    try {
      console.log("Submitting userFormData:");
      for (const [key, value] of userFormData.entries()) {
        console.log(`${key}: ${value}`);
      }
      if (doctorFormData) {
        console.log("Submitting doctorFormData:");
        for (const [key, value] of doctorFormData.entries()) {
          console.log(`${key}: ${value}`);
        }
      }
      const response = await updateProfile({
        user: userFormData,
        doctor: doctorFormData,
      });
      // Update profilePicturePreview with server response
      if (response.user?.profilepicture) {
        setProfilePicturePreview(
          `${import.meta.env.VITE_API_BASE_URL}${response.user.profilepicture}`
        );
      } else if (validatedForm.clearProfilePicture) {
        setProfilePicturePreview(null);
      }
      setEditMode(false);
      toast.success("Profile updated successfully!", {
        position: "bottom-right",
      });
    } catch (err) {
      console.error("Full Update Error:", err);
      console.error(
        "Update Error Response:",
        err.response?.data || err.message
      );
      const backendErrors = err.response?.data || {};
      const newErrors = {};

      if (typeof backendErrors === "string") {
        newErrors.global = backendErrors;
      } else {
        Object.entries(backendErrors).forEach(([field, error]) => {
          newErrors[field] = Array.isArray(error) ? error.join(", ") : error;
        });
      }

      if (err.message && !Object.keys(newErrors).length) {
        newErrors.global = err.message;
      }

      setErrors(newErrors);
      toast.error(
        newErrors.global ||
          "Failed to update profile. Please check the errors.",
        { position: "bottom-right" }
      );
    }
  };

  
  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden w-full max-w-4xl mx-auto'
      encType='multipart/form-data'
    >
      <div className='bg-gradient-to-r from-blue-500 to-blue-600 dark:from-slate-700 dark:to-slate-800 p-6 text-white'>
        <h2 className='text-xl font-bold'>Edit Your Profile</h2>
        <p className='text-blue-100 dark:text-blue-300 mt-1'>
          Update your personal and professional information
        </p>
      </div>

      <div className='p-6 md:p-8 space-y-8'>
        <div className='space-y-6'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-slate-700'>
            Personal Information
          </h3>

          <div className='flex flex-col items-center gap-6'>
            <div className='relative group w-32 h-32'>
              <img
                src={
                  profilePicturePreview ||
                  "https://via.placeholder.com/150?text=No+Avatar"
                }
                alt='Profile preview'
                className='w-full h-full object-cover rounded-full shadow-md border-4 border-blue-100 dark:border-slate-700'
              />
              <label
                htmlFor='profilepicture'
                className='absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
              >
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              </label>
            </div>

            <input
              id='profilepicture'
              name='profilepicture'
              type='file'
              accept='image/jpeg,image/png,image/gif,image/webp'
              onChange={(e) =>
                handleChange("profilepicture", e.target.files[0])
              }
              className='hidden'
            />

            {errors.profilepicture && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.profilepicture}
              </p>
            )}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <InputField
              label='First Name'
              id='firstname'
              type='text'
              value={form.firstname}
              onChange={(value) => handleChange("firstname", value)}
              error={errors.firstname}
              required
              placeholder='Your first name'
            />
            <InputField
              label='Last Name'
              id='lastname'
              type='text'
              value={form.lastname}
              onChange={(value) => handleChange("lastname", value)}
              error={errors.lastname}
              required
              placeholder='Your last name'
            />
            <div className='sm:col-span-2'>
              <InputField
                label='Email'
                id='email'
                readOnly
                type='email'
                value={form.email}
                onChange={(value) => handleChange("email", value)}
                error={errors.email}
                required
                placeholder='your.email@example.com'
              />
            </div>
          </div>
        </div>

        {user?.role === "doctor" && (
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white border-b pb-2 border-blue-600 dark:border-slate-400'>
              Professional Information
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <InputField
                label='Specialization'
                id='specialization'
                type='text'
                value={form.specialization}
                onChange={(value) => handleChange("specialization", value)}
                error={errors.specialization}
                required
                placeholder='Your medical specialty'
              />
              <InputField
                label='Years of Experience'
                id='years_experience'
                type='number'
                value={form.years_experience}
                onChange={(value) =>
                  handleChange("years_experience", parseInt(value) || 0)
                }
                error={errors.years_experience}
                required
                min='0'
                placeholder='Number of years'
              />
              <div className='sm:col-span-2'>
                <InputField
                  label='Address'
                  id='address'
                  type='text'
                  value={form.address}
                  onChange={(value) => handleChange("address", value)}
                  error={errors.address}
                  required
                  placeholder='Your practice address'
                />
              </div>
              <div className='sm:col-span-2'>
                <InputField
                  label='Bio'
                  id='bio'
                  type='textarea'
                  value={form.bio}
                  onChange={(value) => handleChange("bio", value)}
                  error={errors.bio}
                  required
                  rows={5}
                  placeholder='Tell patients about your experience and approach'
                />
              </div>
            </div>

            <div className='space-y-4'>
              <h4 className='text-md font-medium text-gray-700 dark:text-gray-300'>
                Availability
              </h4>

              <AvailableDaysSelector
                selectedDays={form.available_days}
                onChange={(days) => handleChange("available_days", days)}
                error={errors.available_days}
                daysOfWeek={DAYS_OF_WEEK}
              />

              {errors.available_days && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.available_days}
                </p>
              )}
              {errors.available_times && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.available_times}
                </p>
              )}
              {errors.global && (
                <p className='text-red-500 text-sm mt-1'>{errors.global}</p>
              )}

              <div className='space-y-4'>
                {form.available_days.map((day) => (
                  <TimeSlotInput
                    key={day}
                    day={day}
                    slot={form.available_times[day] || { from: "", to: "" }}
                    onChange={(slot) =>
                      handleChange("available_times", {
                        ...form.available_times,
                        [day]: slot,
                      })
                    }
                    error={errors[`time_${day}`]}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='bg-gray-50 dark:bg-gray-700/30 px-6 py-4 flex items-center justify-between sm:justify-end gap-3'>
        <button
          type='button'
          onClick={() => setEditMode(false)}
          className='px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-800 dark:text-white font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
          Save Updates
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
