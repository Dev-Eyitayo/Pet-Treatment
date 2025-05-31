import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

export default function BookAppointment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    petId: pets[0].id,
    reason: "",
    date: "",
    time: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Replace with API call to backend to book appointment
    console.log("Booking appointment", formData);

    setSubmitted(true);

    // After 2 seconds redirect back to pets or home page
    setTimeout(() => {
      navigate("/"); // or "/pets" depending on your route setup
    }, 2000);
  };

  return (
    <div className='max-w-xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>
        Book Appointment
      </h1>

      {submitted ? (
        <div className='bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 p-4 rounded-lg text-center font-semibold'>
          Appointment booked successfully! Redirecting...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className='bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md space-y-6'
        >
          {/* Select Pet */}
          <div>
            <label
              htmlFor='petId'
              className='block mb-2 font-semibold text-gray-900 dark:text-white'
            >
              Select Pet
            </label>
            <select
              id='petId'
              name='petId'
              value={formData.petId}
              onChange={handleChange}
              className='w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} — {pet.breed}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor='reason'
              className='block mb-2 font-semibold text-gray-900 dark:text-white'
            >
              Reason for Appointment
            </label>
            <input
              type='text'
              id='reason'
              name='reason'
              placeholder='e.g. Vaccination, Checkup'
              value={formData.reason}
              onChange={handleChange}
              className='w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor='date'
              className='block mb-2 font-semibold text-gray-900 dark:text-white'
            >
              Appointment Date
            </label>
            <input
              type='date'
              id='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              className='w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          {/* Time */}
          <div>
            <label
              htmlFor='time'
              className='block mb-2 font-semibold text-gray-900 dark:text-white'
            >
              Appointment Time
            </label>
            <input
              type='time'
              id='time'
              name='time'
              value={formData.time}
              onChange={handleChange}
              className='w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500/70'
          >
            Book Appointment
          </button>
        </form>
      )}

      <div className='mt-6 text-center'>
        <Link
          to='/'
          className='text-blue-600 hover:underline dark:text-blue-400 font-semibold'
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
