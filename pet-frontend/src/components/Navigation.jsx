import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  PawPrint,
  User,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import axios from "../utils/axiosInstance"; // Assuming axiosInstance is configured with auth headers
import { toast } from "react-toastify";

const Navigation = ({ handleLogout }) => {
  const [userRole, setUserRole] = useState(null); // State to store user role
  const [isLoading, setIsLoading] = useState(true); // Optional: Loading state

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/user/me/");
        setUserRole(response.data.role); // Store the role (e.g., "doctor" or "user")
      } catch (error) {
        console.error("Error fetching user role:", error);
        toast.error("Failed to load user profile.");
        setUserRole("user"); // Fallback to "user" role to show the "Apply as Doctor" link
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Define navItems, conditionally including "Apply as Doctor"
  const navItems = [
    { name: "Home", icon: Home, to: "/" },
    ...(userRole !== "doctor" && !isLoading
      ? [
          {
            name: "Apply as Doctor",
            icon: Stethoscope,
            to: "/doctor-application",
          },
        ]
      : []),
    { name: "Pets", icon: PawPrint, to: "/pets" },
    { name: "Profile", icon: User, to: "/profile" },
  ];

  // Optional: Show a loading state while fetching user role
  if (isLoading) {
    return (
      <aside className='hidden md:flex md:flex-col bg-background-light dark:bg-background-dark h-screen w-64 p-6 border-r border-gray-200 dark:border-gray-700 fixed justify-between'>
        <div className='flex justify-center items-center h-full'>
          <svg
            className='animate-spin h-8 w-8 text-primary'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className='hidden md:flex md:flex-col bg-background-light dark:bg-background-dark h-screen w-64 p-6 border-r border-gray-200 dark:border-gray-700 fixed justify-between'>
        <div>
          <div className='text-2xl font-bold mb-10 text-primary'>CuraPets</div>
          <nav className='space-y-4'>
            {navItems.map(({ name, icon: Icon, to }) => (
              <NavLink
                key={name}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-light hover:bg-primary/10 dark:text-text-dark"
                  }`
                }
              >
                <Icon className='w-5 h-5' />
                {name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className='flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900'
        >
          <LogOut className='w-5 h-5' />
          Logout
        </button>
      </aside>

      {/* Bottom Navbar for Mobile */}
      <nav className='fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 md:hidden z-50 shadow-md'>
        <ul className='flex justify-around py-2'>
          {navItems.map(({ name, icon: Icon, to }) => (
            <li key={name}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center text-xs ${
                    isActive
                      ? "text-primary"
                      : "text-gray-500 dark:text-gray-400 hover:text-primary"
                  }`
                }
              >
                <Icon className='w-5 h-5 mb-1' />
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
