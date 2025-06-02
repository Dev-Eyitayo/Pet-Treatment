import { useState } from "react";
import InputField from "./InputField";
import FileInput from "./FileInput";
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
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    profilepicture: user?.profilepicture || null,
    bio: profileData?.bio || "",
    specialization: profileData?.specialization || "",
    available_days: profileData?.available_days || [],
    available_times: profileData?.available_times || {},
    years_experience: profileData?.years_experience || 0,
    address: profileData?.address || "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.firstname.trim()) errs.firstname = "First name is required";
    if (!form.lastname.trim()) errs.lastname = "Last name is required";
    if (user?.role === "doctor") {
      if (!form.bio.trim()) errs.bio = "Bio is required";
      if (!form.specialization.trim())
        errs.specialization = "Specialization is required";
      if (!form.address.trim()) errs.address = "Address is required";
      if (form.years_experience <= 0 || isNaN(form.years_experience))
        errs.years_experience = "Valid years of experience is required";
      if (form.available_days.length === 0)
        errs.available_days = "At least one available day is required";
      Object.keys(form.available_times).forEach((day) => {
        form.available_times[day].forEach((slot, index) => {
          if (!slot.from || !slot.to) {
            errs[`time_${day}_${index}`] = `Time slot for ${day} is incomplete`;
          }
        });
      });
    }
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    updateProfile(form);
    setEditMode(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 md:p-6 sm:p-2 max-w-lg w-full mx-auto box-border overflow-hidden'
    >
      <div className='space-y-4'>
        {/* Basic Info Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-text-light dark:text-text-dark'>
            Basic Information
          </h3>
          <InputField
            label='First Name'
            id='firstname'
            type='text'
            value={form.firstname}
            onChange={(value) => handleChange("firstname", value)}
            error={errors.firstname}
            required
            placeholder='e.g., John'
          />
          <InputField
            label='Last Name'
            id='lastname'
            type='text'
            value={form.lastname}
            onChange={(value) => handleChange("lastname", value)}
            error={errors.lastname}
            required
            placeholder='e.g., Doe'
          />
          <FileInput
            label='Profile Picture'
            id='profilepicture'
            onChange={(file) => handleChange("profilepicture", file)}
          />
        </div>

        {/* Doctor Info Section */}
        {user.role === "doctor" && (
          <div className='space-y-4 mt-6'>
            <h3 className='text-lg font-semibold text-text-light dark:text-text-dark'>
              Professional Details
            </h3>
            <InputField
              label='Bio'
              id='bio'
              type='textarea'
              value={form.bio}
              onChange={(value) => handleChange("bio", value)}
              error={errors.bio}
              required
              placeholder='Tell us about yourself'
              rows={4}
            />
            <InputField
              label='Specialization'
              id='specialization'
              type='text'
              value={form.specialization}
              onChange={(value) => handleChange("specialization", value)}
              error={errors.specialization}
              required
              placeholder='e.g., Cardiology'
            />
            <InputField
              label='Years of Experience'
              id='years_experience'
              type='number'
              value={form.years_experience}
              onChange={(value) =>
                handleChange("years_experience", parseInt(value))
              }
              error={errors.years_experience}
              required
              placeholder='e.g., 5'
              min='0'
            />
            <InputField
              label='Address'
              id='address'
              type='text'
              value={form.address}
              onChange={(value) => handleChange("address", value)}
              error={errors.address}
              required
              placeholder='e.g., 123 Main St, City'
            />
            <AvailableDaysSelector
              selectedDays={form.available_days}
              onChange={(days) => handleChange("available_days", days)}
              error={errors.available_days}
              daysOfWeek={DAYS_OF_WEEK}
            />
            <div className='space-y-4'>
              {form.available_days.map((day) => (
                <TimeSlotInput
                  key={day}
                  day={day}
                  slots={form.available_times[day] || [{ from: "", to: "" }]}
                  onChange={(slots) =>
                    handleChange("available_times", {
                      ...form.available_times,
                      [day]: slots,
                    })
                  }
                  errors={errors}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className='flex gap-6 mt-6'>
        <button
          type='submit'
          className='flex-1 bg-blue-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500'
        >
          Save Changes
        </button>
        <button
          type='button'
          onClick={() => setEditMode(false)}
          className='flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500'
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
