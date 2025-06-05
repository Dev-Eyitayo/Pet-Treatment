import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const itemsPerPage = 6;

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      setError(null);

      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        toast.error("No authentication token found. Please log in.", {
          position: "bottom-right",
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/doctorprofiles/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle paginated or non-paginated response
        const fetchedDoctors = response.data.results
          ? response.data.results
          : response.data;

        // Debug: Log response
        console.log("Fetched doctors:", fetchedDoctors);

        // Map response to UI structure
        const mappedDoctors = fetchedDoctors.map((profile) => {
          // Handle profilepicture: use full URL if provided, otherwise prepend base URL or use placeholder
          let imageUrl =
            "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";
          if (profile.doctor.profilepicture) {
            imageUrl = profile.doctor.profilepicture.startsWith("http")
              ? profile.doctor.profilepicture
              : `${import.meta.env.VITE_API_BASE_URL}${profile.doctor.profilepicture}`;
          }
          console.log(
            `Doctor ${profile.doctor.firstname} image URL:`,
            imageUrl
          ); // Debug

          return {
            id: profile.doctor.id,
            name:
              `Dr. ${profile.doctor.firstname || ""} ${profile.doctor.lastname || ""}`.trim() ||
              "Dr. Unknown",
            specialization: profile.specialization || "Veterinarian",
            experience: profile.years_experience || 0,
            image: imageUrl,
          };
        });

        setDoctors(mappedDoctors);
        setTotalPages(
          response.data.count
            ? Math.ceil(response.data.count / itemsPerPage)
            : Math.ceil(mappedDoctors.length / itemsPerPage)
        );
      } catch (err) {
        console.error("Failed to fetch doctors:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setError("Failed to load doctors. Please try again.");
        toast.error("Failed to load doctors. Please try again.", {
          position: "bottom-right",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (isLoading) {
    return <div className='text-center p-6'>Loading doctors...</div>;
  }

  if (error) {
    return <div className='text-center p-6 text-red-500'>{error}</div>;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDoctors = doctors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className='max-w-6xl mx-auto'>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
        {currentDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className='bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center p-4'
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              width='80'
              height='80'
              className='w-20 h-20 mx-auto rounded-full object-cover border-2 border-primary mb-3'
              onError={(e) => {
                console.error(
                  `Failed to load image for ${doctor.name}: ${doctor.image}`
                );
                e.target.src = "https://via.placeholder.com/100"; // Fallback on error
              }}
            />
            <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>
              {doctor.name}
            </h3>
            <p className='text-xs text-gray-600 dark:text-gray-400'>
              {doctor.specialization}
            </p>

            <Link
              to={`/doctors/${doctor.id}`}
              className='inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800'
              aria-label={`View profile of ${doctor.name}`}
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center space-x-2'>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-slate-700 dark:text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
