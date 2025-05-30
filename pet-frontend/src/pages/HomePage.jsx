import { BellIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle"; // update the path if needed

const pets = [
  {
    name: "Buddy",
    breed: "Golden Retriever",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=100&q=80",
  },
  {
    name: "Whiskers",
    breed: "Siamese Cat",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&q=80",
  },
];

const appointments = [
  {
    title: "Annual Checkup",
    doctor: "Dr. Emily Carter",
    time: "Tomorrow, 2 PM",
  },
  {
    title: "Vaccination",
    doctor: "Dr. Mark Johnson",
    time: "Next Week, 10 AM",
  },
];

export default function Home() {
  return (
    <div className='max-w-7xl mx-auto p-1 md:p-6'>
      {/* Header */}
      <div className='flex justify-end items-center gap-4 mb-6'>
        <button className='relative'>
          <BellIcon className='h-6 w-6 text-text-light dark:text-text-dark' />
        </button>
        <ThemeToggle />
      </div>

      {/* Welcome + CTA */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
        <h1 className='text-2xl font-bold'>Welcome back, Alex!</h1>
        <Link
          to='/add-pet'
          className='bg-primary text-white font-medium px-5 py-2 rounded-xl shadow hover:bg-primary-dark transition text-center'
        >
          + Add a New Pet
        </Link>
      </div>

      {/* Grid Layout for Pets & Appointments */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* My Pets */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>My Pets</h2>
          <div className='space-y-4'>
            {pets.map((pet, index) => (
              <div key={index} className='flex items-center gap-4'>
                <img
                  src={pet.image}
                  alt={pet.name}
                  className='w-12 h-12 rounded-full object-cover'
                />
                <div>
                  <p className='font-medium text-text-light dark:text-text-dark'>
                    {pet.name}
                  </p>
                  <p className='text-sm text-gray-500'>{pet.breed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Upcoming Appointments</h2>
          <div className='space-y-4'>
            {appointments.map((appt, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-4 rounded-xl bg-gray-100 dark:bg-slate-800'
              >
                <div className='flex items-center gap-3'>
                  <CalendarDaysIcon className='h-6 w-6 text-primary' />
                  <div>
                    <p className='font-medium text-text-light dark:text-text-dark'>
                      {appt.title}
                    </p>
                    <p className='text-sm text-gray-500'>{appt.doctor}</p>
                  </div>
                </div>
                <p className='text-sm text-blue-600 font-medium'>{appt.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Appointment Button */}
      <div className='mt-10'>
        <Link
          to='/book-appointment'
          className='w-full block text-center bg-gray-200 dark:bg-slate-700 py-3 rounded-xl font-semibold text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-slate-600 transition'
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
