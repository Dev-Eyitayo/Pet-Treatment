import {
  Home,
  Calendar,
  PawPrint,
  User,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Home", icon: Home, to: "/" },
  { name: "Apply as Doctor", icon: Stethoscope, to: "/doctor-application" },
  { name: "Pets", icon: PawPrint, to: "/pets" },
  { name: "Profile", icon: User, to: "/profile" },
];

const Navigation = ({handleLogout}) => {
  

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
