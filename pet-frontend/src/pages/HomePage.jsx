import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle"; // Update path if needed
import DoctorList from "../components/DoctorList";

const pets = [
  {
    id: 1,
    name: "Buddy",
    breed: "Golden Retriever",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=100&q=80",
  },
  {
    id: 2,
    name: "Whiskers",
    breed: "Siamese Cat",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&q=80",
  },
];

const appointments = [
  {
    id: 1,
    title: "Annual Checkup",
    doctor: "Dr. Emily Carter",
    time: "Tomorrow, 2 PM",
  },
  {
    id: 2,
    title: "Vaccination",
    doctor: "Dr. Mark Johnson",
    time: "Next Week, 10 AM",
  },
];

const todaysAppointments = [
  {
    id: 1,
    petName: "Buddy",
    petImage:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=100&q=80",
    patientName: "Alex Johnson",
    time: "Today, 10 AM",
    reason: "General Checkup",
  },
  {
    id: 2,
    petName: "Whiskers",
    petImage:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&q=80",
    patientName: "Maria Garcia",
    time: "Today, 1 PM",
    reason: "Follow-up Visit",
  },
];

const appointmentRequests = [
  {
    id: 1,
    petName: "Charlie",
    petImage:
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=100&q=80",
    patientName: "John Smith",
    requestedTime: "Tomorrow, 3 PM",
    reason: "New patient consultation",
  },
  {
    id: 2,
    petName: "Luna",
    petImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
    patientName: "Emily Davis",
    requestedTime: "Next Monday, 9 AM",
    reason: "Vaccination",
  },
];

export default function Home() {
  const userRole = "user"; // Toggle "user" or "doctor"

  return (
    <div className='max-w-7xl mx-auto p-1 sm:p-2 lg:p-6'>
      {/* Header */}
      <div className='flex justify-between items-center gap-4 mb-10'>
        <div className='md:z-[-300] text-xl font-bold text-gray-900 dark:text-white'>
          CuraPets
        </div>
        <div className='flex items-center gap-4'>
          <button className='relative' aria-label='Notifications'>
            <BellIcon className='h-6 w-6 text-gray-600 dark:text-gray-300' />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Welcome + CTA */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
        <h1 className='text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white'>
          Welcome back, Alex!
        </h1>
        {userRole === "user" && (
          <Link
            to='/add-pet'
            className='inline-block bg-blue-500 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500/70 text-center'
          >
            + Add a New Pet
          </Link>
        )}
      </div>

      {userRole === "user" ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
          {/* My Pets */}
          <section>
            <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white'>
              Meet Our Doctors
            </h2>
            <DoctorList />
          </section>

          {/* Upcoming Appointments */}
          <section>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white'>
              Upcoming Appointments
            </h2>
            <div className='space-y-4 sm:space-y-6'>
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className='flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition'
                >
                  <div className='flex items-center gap-4 sm:gap-5'>
                    <div>
                      <p className='font-semibold text-gray-900 dark:text-white text-base sm:text-lg'>
                        {appt.title} —{" "}
                        <span className='font-normal'>{appt.doctor}</span>
                      </p>
                      <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>
                        {appt.time}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/appointments/${appt.id}`} // Use appt.id here
                    className='bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/70 text-center'
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10'>
          {/* Today's Appointments */}
          <section>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white'>
              Today's Appointments
            </h2>
            <div className='space-y-4 sm:space-y-6'>
              {todaysAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className='flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-5 hover:shadow-md transition'
                >
                  <div className='flex items-center gap-4 sm:gap-5'>
                    <img
                      src={appt.petImage}
                      alt={appt.petName}
                      className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-md'
                    />
                    <div>
                      <p className='font-semibold text-gray-900 dark:text-white text-base sm:text-lg'>
                        {appt.petName} —{" "}
                        <span className='font-normal'>{appt.reason}</span>
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Owner: {appt.patientName}
                      </p>
                      <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>
                        {appt.time}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/appointments/${appt.id}`}
                    className='mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/70 text-center'
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Appointment Requests */}
          <section>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white'>
              Appointment Requests
            </h2>
            <div className='space-y-4 sm:space-y-6'>
              {appointmentRequests.map((req) => (
                <div
                  key={req.id}
                  className='flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-5 hover:shadow-md transition'
                >
                  <div className='flex items-center gap-4 sm:gap-5'>
                    <img
                      src={req.petImage}
                      alt={req.petName}
                      className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-md'
                    />
                    <div>
                      <p className='font-semibold text-gray-900 dark:text-white text-base sm:text-lg'>
                        {req.petName} —{" "}
                        <span className='font-normal'>{req.reason}</span>
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Owner: {req.patientName}
                      </p>
                      <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>
                        {req.requestedTime}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/requests/${req.id}`}
                    className='mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/70 text-center'
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
      {/* Book Appointment Button for users only */}
      {/* {userRole === "user" && (
        <div className='mt-8 sm:mt-10'>
          <Link
            to='/book-appointment'
            className='block w-full sm:w-auto sm:max-w-xs mx-auto bg-gray-200 dark:bg-slate-700 py-2 sm:py-3 rounded-xl font-semibold text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500/70 text-center'
          >
            Book Appointment
          </Link>
        </div>
      )} */}
    </div>
  );
}
