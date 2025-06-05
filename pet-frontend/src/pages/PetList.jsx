import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PetList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");
        console.log("Token:", token);
        // console.log(
        //   "API URL:",
        //   `${import.meta.env.VITE_API_BASE_URL}/api/pets/`
        // );
        if (!token) {
          setError("Please log in to view your pets.");
          setLoading(false);
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/pets/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPets(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch pets error:", err.response?.data || err.message);
        const errorMessage =
          err.response?.data?.detail ||
          Object.values(err.response?.data || {}).join(", ") ||
          "Failed to fetch pets. Please try again.";
        setError(errorMessage);
        setLoading(false);
        // Optional: Redirect to login on 401
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchPets();
  }, [navigate]);

  if (loading) return <div className='text-center p-6'>Loading...</div>;
  if (error) return <div className='text-center p-6 text-red-600'>{error}</div>;

  // Optional: Empty state handling
  if (pets.length === 0) {
    return (
      <div className='max-w-5xl mx-auto p-6'>
        <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>
          Your Pets
        </h1>
        <p className='text-center text-gray-600 dark:text-gray-400'>
          You don’t have any pets yet.{" "}
          <Link to='/add-pet' className='text-blue-600 hover:underline'>
            Add a pet
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>
        Your Pets
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {pets.map((pet) => (
          <Link
            to={`/pets/${pet.id}`}
            key={pet.id}
            className='group bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
          >
            <div className='relative w-full h-48'>
              <img
                src={pet.image || "https://via.placeholder.com/300"}
                alt={pet.name}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                loading='lazy'
              />
              {/* Optional: Image loading placeholder */}
              {/* <div className='absolute inset-0 bg-gray-200 dark:bg-slate-700 animate-pulse group-hover:hidden' /> */}
            </div>
            <div className='p-4'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                {pet.name}
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                {/* Optional: Add species */}
                {pet.species} • {pet.breed || "Unknown breed"} • {pet.age} year
                {pet.age > 1 ? "s" : ""} old
              </p>
              <p className='mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium'>
                View Profile →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
