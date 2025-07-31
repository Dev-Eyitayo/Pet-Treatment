import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import DoctorList from "../components/DoctorList";
import NotificationModal from "../components/NotificationModal";
import axios from "../utils/axiosInstance"; // Use custom axios instance with interceptor
import { toast } from "react-toastify";

export default function Home() {
  const { user } = useOutletContext();
  const userRole = user?.role || "user";

  const [appointments, setAppointments] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      message: "New appointment request from Emily Davis",
      time: "2 mins ago",
      read: false,
    },
    { message: "Buddy has a checkup tomorrow", time: "1 hour ago", read: true },
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isModalOpen) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }, [isModalOpen]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        toast.error("No user found. Please log in.", {
          position: "bottom-right",
        });
        setIsLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        if (userRole === "user") {
          // Fetch upcoming appointments for users
          const appointmentsResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/appointments/upcoming/`,
            { headers }
          );
          setAppointments(appointmentsResponse.data);
        } else {
          // Fetch today's appointments for doctors
          const todaysAppointmentsResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/appointments/today/`,
            { headers }
          );
          setTodaysAppointments(todaysAppointmentsResponse.data);

          // Fetch appointment requests for doctors
          const requestsResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/appointments/requests/`,
            { headers }
          );
          setAppointmentRequests(requestsResponse.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setError("Failed to load data. Please try again.");
        toast.error("Failed to load data. Please try again.", {
          position: "bottom-right",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  if (isLoading) {
    return <div className='text-center p-6'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center p-6 text-red-500'>{error}</div>;
  }

  return (
    <div className='max-w-7xl mx-auto p-1 sm:p-2 lg:p-6'>
      {/* Header */}
      <div className='flex justify-between items-center gap-4 mb-10'>
        <div className='md:z-[-300] text-xl font-bold text-gray-900 dark:text-white'>
          CuraPets
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className='relative'
              aria-label='Notifications'
            >
              <BellIcon className='h-7 w-7 text-gray-600 dark:text-gray-300' />
              {unreadCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full'>
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              notifications={notifications}
            />
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* Welcome + CTA */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
        <h1 className='text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white'>
          Welcome back, {user?.firstname || "User"}!
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
          {/* Meet Our Doctors */}
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
              {appointments.length === 0 ? (
                <p className='text-gray-500 dark:text-gray-400'>
                  No upcoming appointments.
                </p>
              ) : (
                appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className='flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition'
                  >
                    <div className='flex items-center gap-4 sm:gap-5'>
                      <div>
                        <p className='font-semibold text-gray-900 dark:text-white text-base sm:text-lg'>
                          {appt.title || "Appointment"} —{" "}
                          <span className='font-normal'>{appt.doctorName}</span>
                        </p>
                        <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>
                          {appt.time}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/appointments/${appt.id}`}
                      className='bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/70 text-center'
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
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
              {todaysAppointments.length === 0 ? (
                <p className='text-gray-500 dark:text-gray-400'>
                  No appointments today.
                </p>
              ) : (
                todaysAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className='flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-5 hover:shadow-md transition'
                  >
                    <div className='flex items-center gap-4 sm:gap-5'>
                      <img
                        src={
                          appt.petImage
                            ? `${import.meta.env.VITE_API_BASE_URL}${appt.petImage}`
                            : "https://via.placeholder.com/80"
                        }
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
                ))
              )}
            </div>
          </section>

          {/* Appointment Requests */}
          <section>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white'>
              Appointment Requests
            </h2>
            <div className='space-y-4 sm:space-y-6'>
              {appointmentRequests.length === 0 ? (
                <p className='text-gray-500 dark:text-gray-400'>
                  No appointment requests.
                </p>
              ) : (
                appointmentRequests.map((req) => (
                  <div
                    key={req.id}
                    className='flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-5 hover:shadow-md transition'
                  >
                    <div className='flex items-center gap-4 sm:gap-5'>
                      <img
                        src={
                          req.petImage
                            ? `${import.meta.env.VITE_API_BASE_URL}${req.petImage}`
                            : "https://via.placeholder.com/80"
                        }
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
                          {req.time} {/* Use 'time' as 'requestedTime' */}
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
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
