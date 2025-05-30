import { useTheme } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label='Toggle Theme'
      className={`relative w-10 h-6 flex items-center rounded-full px-1 transition-colors duration-300 ${
        theme === "dark" ? "bg-yellow-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute left-1 w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          theme === "dark" ? "translate-x-4" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <MoonIcon className='w-3 h-3 text-yellow-500' />
        ) : (
          <SunIcon className='w-3 h-3 text-orange-400' />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
