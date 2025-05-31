import { useState } from "react";
import { Link } from "react-router-dom";

const allDoctors = [
  {
    id: 1,
    name: "Dr. Grace Adewale",
    specialization: "Veterinary Surgeon",
    experience: 7,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Dr. John Okafor",
    specialization: "Animal Nutritionist",
    experience: 5,
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: 3,
    name: "Dr. Amaka Ojo",
    specialization: "Pet Dermatologist",
    experience: 6,
    image: "https://randomuser.me/api/portraits/women/48.jpg",
  },
  {
    id: 4,
    name: "Dr. Adebayo Yusuf",
    specialization: "Veterinary Pathologist",
    experience: 4,
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 5,
    name: "Dr. Bola Fashola",
    specialization: "Veterinary Oncologist",
    experience: 8,
    image: "https://randomuser.me/api/portraits/women/42.jpg",
  },
  {
    id: 6,
    name: "Dr. Kingsley Obi",
    specialization: "Pet Cardiologist",
    experience: 6,
    image: "https://randomuser.me/api/portraits/men/48.jpg",
  },
  {
    id: 7,
    name: "Dr. Ada Eze",
    specialization: "Veterinary Radiologist",
    experience: 5,
    image: "https://randomuser.me/api/portraits/women/50.jpg",
  },
  {
    id: 8,
    name: "Dr. Chuka Nnamdi",
    specialization: "Exotic Pet Specialist",
    experience: 7,
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
  {
    id: 9,
    name: "Dr. Yetunde Ogunleye",
    specialization: "Animal Behaviorist",
    experience: 9,
    image: "https://randomuser.me/api/portraits/women/52.jpg",
  },
  {
    id: 10,
    name: "Dr. Tunde Ayeni",
    specialization: "Pet Ophthalmologist",
    experience: 3,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
];

const itemsPerPage = 6;

export default function DoctorList() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDoctors = allDoctors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
              className='w-20 h-20 mx-auto rounded-full object-cover border-2 border-primary mb-3'
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
    </section>
  );
}
