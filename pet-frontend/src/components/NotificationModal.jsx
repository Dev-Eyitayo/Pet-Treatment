import { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

export default function NotificationModal({ isOpen, onClose, notifications }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const markNotificationsAsRead = async () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");
        if (!token) return;

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/notifications/mark-all-read/`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
        toast.error("Failed to update notifications.", {
          position: "bottom-right",
        });
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      markNotificationsAsRead();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg ring-1 ring-black/10 z-50'
      ref={modalRef}
    >
      <div className='flex justify-between items-center px-4 py-3 border-b dark:border-gray-700'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
          Notifications
        </h3>
        <button onClick={onClose} aria-label='Close'>
          <XMarkIcon className='w-5 h-5 text-gray-500 dark:text-gray-300 hover:text-red-500' />
        </button>
      </div>
      <div className='max-h-64 overflow-y-auto p-4 space-y-3'>
        {notifications.length === 0 ? (
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            No new notifications
          </p>
        ) : (
          notifications.map((note) => (
            <div
              key={note.id}
              className='bg-gray-50 dark:bg-slate-700 p-3 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-slate-600 transition'
            >
              <p className='text-sm text-gray-700 dark:text-gray-200'>
                {note.message}
              </p>
              <p className='text-xs text-gray-400 mt-1'>{note.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
