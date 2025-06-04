import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Doctor data from DoctorList
const allDoctors = [
  {
    id: 1,
    name: "Dr. Grace Adewale",
    specialization: "Veterinary Surgeon",
    experience: 7,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    availableDays: ["Monday", "Wednesday", "Friday"],
    bio: "Dr. Grace Adewale is a skilled veterinary surgeon with 7 years of experience, specializing in advanced surgical procedures for pets.",
  },
  {
    id: 2,
    name: "Dr. John Okafor",
    specialization: "Animal Nutritionist",
    experience: 5,
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    availableDays: ["Tuesday", "Thursday"],
    bio: "Dr. John Okafor focuses on optimizing pet health through tailored nutrition plans, with 5 years of expertise.",
  },
  {
    id: 3,
    name: "Dr. Amaka Ojo",
    specialization: "Pet Dermatologist",
    experience: 6,
    image: "https://randomuser.me/api/portraits/women/48.jpg",
    availableDays: ["Monday", "Thursday", "Saturday"],
    bio: "Dr. Amaka Ojo specializes in diagnosing and treating skin conditions in pets, with 6 years of experience.",
  },
  {
    id: 4,
    name: "Dr. Adebayo Yusuf",
    specialization: "Veterinary Pathologist",
    experience: 4,
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    availableDays: ["Wednesday", "Friday"],
    bio: "Dr. Adebayo Yusuf is an expert in diagnosing diseases in animals through laboratory analysis.",
  },
  {
    id: 5,
    name: "Dr. Bola Fashola",
    specialization: "Veterinary Oncologist",
    experience: 8,
    image: "https://randomuser.me/api/portraits/women/42.jpg",
    availableDays: ["Tuesday", "Friday"],
    bio: "Dr. Bola Fashola specializes in cancer treatment for pets, with 8 years of dedicated practice.",
  },
  {
    id: 6,
    name: "Dr. Kingsley Obi",
    specialization: "Pet Cardiologist",
    experience: 6,
    image: "https://randomuser.me/api/portraits/men/48.jpg",
    availableDays: ["Monday", "Wednesday"],
    bio: "Dr. Kingsley Obi focuses on heart health for pets, with extensive experience in cardiology.",
  },
  {
    id: 7,
    name: "Dr. Ada Eze",
    specialization: "Veterinary Radiologist",
    experience: 5,
    image: "https://randomuser.me/api/portraits/women/50.jpg",
    availableDays: ["Thursday", "Saturday"],
    bio: "Dr. Ada Eze is skilled in diagnostic imaging to identify health issues in pets.",
  },
  {
    id: 8,
    name: "Dr. Chuka Nnamdi",
    specialization: "Exotic Pet Specialist",
    experience: 7,
    image: "https://randomuser.me/api/portraits/men/50.jpg",
    availableDays: ["Tuesday", "Friday"],
    bio: "Dr. Chuka Nnamdi specializes in care for exotic pets, with 7 years of experience.",
  },
  {
    id: 9,
    name: "Dr. Yetunde Ogunleye",
    specialization: "Animal Behaviorist",
    experience: 9,
    image: "https://randomuser.me/api/portraits/women/52.jpg",
    availableDays: ["Monday", "Thursday"],
    bio: "Dr. Yetunde Ogunleye helps address behavioral issues in pets with her extensive expertise.",
  },
  {
    id: 10,
    name: "Dr. Tunde Ayeni",
    specialization: "Pet Ophthalmologist",
    experience: 3,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    availableDays: ["Wednesday", "Saturday"],
    bio: "Dr. Tunde Ayeni specializes in eye care for pets, with a focus on innovative treatments.",
  },
];

// Generate available slots for a specific date
const generateAvailableSlots = (selectedDate, availableDays) => {
  const slots = [];
  const timeSlots = ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"]; // Standard time slots
  const dayName = selectedDate.toLocaleString("en-US", { weekday: "long" });

  if (availableDays.includes(dayName)) {
    timeSlots.forEach((time, index) => {
      slots.push({
        id: index + 1,
        date: selectedDate.toISOString().split("T")[0], // e.g., "2025-06-04"
        time,
      });
    });
  }

  return slots;
};

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Find doctor by ID
  const doctor = allDoctors.find((d) => d.id === parseInt(doctorId));

  // Generate available slots for the selected date
  const availableSlots =
    selectedDate && doctor
      ? generateAvailableSlots(selectedDate, doctor.availableDays)
      : [];

  // Handle booking action
  const handleBookAppointment = () => {
    if (selectedSlot) {
      setShowConfirmation(true);
      setTimeout(() => {
        setSelectedSlot(null);
        setShowConfirmation(false);
      }, 3000); // Hide confirmation after 3 seconds
    }
  };

  // Filter dates to only allow available days
  const isDateAvailable = (date) => {
    const dayName = date.toLocaleString("en-US", { weekday: "long" });
    return doctor ? doctor.availableDays.includes(dayName) : false;
  };

  if (!doctor) {
    return (
      <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
        <p className='text-lg text-gray-900 dark:text-white'>
          Doctor not found.
        </p>
        <Link
          to='/'
          className='mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800'
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
      {/* Header */}
      <div className='flex justify-between items-center gap-4 mb-8'>
        <Link
          to='/'
          className='flex items-center gap-2 text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition'
        >
          <ArrowLeftIcon className='h-6 w-6' />
          <span className='font-semibold'>Back to Home</span>
        </Link>
        <div className='text-xl font-bold text-gray-900 dark:text-white'>
          CuraPets
        </div>
      </div>

      {/* Doctor Profile */}
      <div className='bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-8 mb-8'>
        <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8'>
          <img
            src={doctor.image}
            alt={doctor.name}
            className='w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-md border-2 border-blue-600'
          />
          <div>
            <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2'>
              {doctor.name}
            </h1>
            <p className='text-lg text-gray-600 dark:text-gray-300'>
              {doctor.specialization}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              {doctor.experience} Years of Experience
            </p>
            <p className='text-gray-500 dark:text-gray-400 leading-relaxed mt-2'>
              {doctor.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Picker */}
      <section>
        <h2 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white'>
          Select a Date
        </h2>
        <div className='mb-6'>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            filterDate={isDateAvailable}
            minDate={new Date("2025-06-04")}
            maxDate={
              new Date(
                new Date("2025-06-04").setDate(
                  new Date("2025-06-04").getDate() + 30
                )
              )
            }
            inline
            calendarClassName='bg-white dark:bg-slate-800 rounded-xl shadow-md p-4'
            dayClassName={(date) =>
              isDateAvailable(date)
                ? "text-gray-900 dark:text-white cursor-pointer"
                : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }
          />
        </div>
      </section>

      {/* Available Appointment Slots */}
      <section>
        <h2 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white'>
          Available Time Slots
        </h2>
        {selectedDate ? (
          availableSlots.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition border-2 ${
                    selectedSlot?.id === slot.id
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <div className='flex items-center gap-4'>
                    <CalendarIcon className='h-6 w-6 text-gray-600 dark:text-gray-300' />
                    <div>
                      <p className='font-semibold text-gray-900 dark:text-white'>
                        {new Date(slot.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className='text-sm text-gray-400 dark:text-gray-500'>
                        {slot.time}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                      selectedSlot?.id === slot.id
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 dark:text-gray-400'>
              No available slots for the selected date.
            </p>
          )
        ) : (
          <p className='text-gray-500 dark:text-gray-400'>
            Please select a date to view available time slots.
          </p>
        )}
      </section>

      {/* Book Appointment Button */}
      {selectedSlot && (
        <div className='mt-6 sm:mt-8 flex justify-center'>
          <button
            onClick={handleBookAppointment}
            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800'
            disabled={!selectedSlot}
          >
            Book Appointment
          </button>
        </div>
      )}

      {/* Confirmation Message */}
      {showConfirmation && (
        <div className='fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300'>
          Your booking request has been submitted! You will be notified when{" "}
          {doctor.name} approves your appointment.
        </div>
      )}
    </div>
  );
}
