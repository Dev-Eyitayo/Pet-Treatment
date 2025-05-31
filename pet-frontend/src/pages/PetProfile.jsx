import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const mockPetData = {
  id: "1",
  name: "Buddy",
  species: "Dog",
  breed: "Golden Retriever",
  age: 4,
  photo: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&q=80",
};

export default function PetProfile() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    photo: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Simulate API fetch
    if (petId === mockPetData.id) {
      setPet(mockPetData);
      setFormData({
        name: mockPetData.name,
        species: mockPetData.species,
        breed: mockPetData.breed,
        age: mockPetData.age,
        photo: mockPetData.photo,
      });
    } else {
      alert("Pet not found");
      navigate("/pets");
    }
  }, [petId, navigate]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Pet name is required";
    if (!formData.species.trim()) errs.species = "Species is required";
    if (!formData.breed.trim()) errs.breed = "Breed is required";
    if (!formData.age || isNaN(formData.age) || formData.age <= 0)
      errs.age = "Valid age is required";
    if (
      formData.photo &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.photo)
    ) {
      errs.photo = "Photo URL must be a valid image URL (jpg, png, gif, webp)";
    }
    return errs;
  };

  const handleChange = (e) => {
    setFormData((d) => ({ ...d, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setPet({ ...formData, id: pet.id, age: Number(formData.age) });
    setEditMode(false);
    alert("Pet updated successfully!");
  };

  if (!pet) {
    return (
      <div className='max-w-4xl mx-auto px-6 py-12 animate-pulse'>
        <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8'>
          <div className='h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4'></div>
          <div className='flex flex-col md:flex-row gap-8'>
            <div className='w-48 h-48 bg-gray-200 dark:bg-slate-700 rounded-full'></div>
            <div className='flex-1 space-y-4'>
              <div className='h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4'></div>
              <div className='h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2'></div>
              <div className='h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-6 py-12'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-text-light dark:text-text-dark'>
          Pet Profile
        </h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className='bg-blue-600 hover:bg-primary-700 text-text-light dark:text-text-dark px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ease-in-out'
          aria-label={editMode ? "Cancel editing" : "Edit pet profile"}
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className='transition-all duration-300 ease-in-out'>
        {!editMode ? (
          // View Mode
          <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8'>
            <div className='relative group'>
              <img
                src={pet.photo}
                alt={pet.name}
                className='w-48 h-48 object-cover rounded-full shadow-md transition-transform duration-300 group-hover:scale-105'
                loading='lazy'
              />
              <div className='absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300'></div>
            </div>
            <div className='flex-1 space-y-4'>
              <h2 className='text-2xl font-semibold text-text-light dark:text-text-dark'>
                {pet.name}
              </h2>
              <p className='text-text-light dark:text-text-dark'>
                <strong className='font-medium'>Species:</strong> {pet.species}
              </p>
              <p className='text-text-light dark:text-text-dark'>
                <strong className='font-medium'>Breed:</strong> {pet.breed}
              </p>
              <p className='text-text-light dark:text-text-dark'>
                <strong className='font-medium'>Age:</strong> {pet.age} year
                {pet.age > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form
            onSubmit={handleSubmit}
            className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 max-w-lg mx-auto space-y-6'
          >
            <div className='relative'>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-text-light dark:text-text-dark mb-1 transition-all duration-200'
              >
                Pet Name <span className='text-red-500'>*</span>
              </label>
              <input
                id='name'
                name='name'
                type='text'
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-slate-600"
                } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark transition-all duration-200`}
                placeholder='e.g., Buddy'
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p
                  id='name-error'
                  className='text-red-500 mt-1 text-sm flex items-center'
                >
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 2 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div className='relative'>
              <label
                htmlFor='species'
                className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
              >
                Species <span className='text-red-500'>*</span>
              </label>
              <input
                id='species'
                name='species'
                type='text'
                value={formData.species}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.species
                    ? "border-red-500"
                    : "border-gray-300 dark:border-slate-600"
                } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark`}
                placeholder='e.g., Dog, Cat'
                aria-invalid={errors.species ? "true" : "false"}
                aria-describedby={errors.species ? "species-error" : undefined}
              />
              {errors.species && (
                <p
                  id='species-error'
                  className='text-red-500 mt-1 text-sm flex items-center'
                >
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.species}
                </p>
              )}
            </div>

            <div className='relative'>
              <label
                htmlFor='breed'
                className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
              >
                Breed <span className='text-red-500'>*</span>
              </label>
              <input
                id='breed'
                name='breed'
                type='text'
                value={formData.breed}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.breed
                    ? "border-red-500"
                    : "border-gray-300 dark:border-slate-600"
                } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark`}
                placeholder='e.g., Golden Retriever'
                aria-invalid={errors.breed ? "true" : "false"}
                aria-describedby={errors.breed ? "breed-error" : undefined}
              />
              {errors.breed && (
                <p
                  id='breed-error'
                  className='text-red-500 mt-1 text-sm flex items-center'
                >
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.breed}
                </p>
              )}
            </div>

            <div className='relative'>
              <label
                htmlFor='age'
                className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
              >
                Age (years) <span className='text-red-500'>*</span>
              </label>
              <input
                id='age'
                name='age'
                type='number'
                min='0'
                value={formData.age}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.age
                    ? "border-red-500"
                    : "border-gray-300 dark:border-slate-600"
                } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark`}
                placeholder='e.g., 4'
                aria-invalid={errors.age ? "true" : "false"}
                aria-describedby={errors.age ? "age-error" : undefined}
              />
              {errors.age && (
                <p
                  id='age-error'
                  className='text-red-500 mt-1 text-sm flex items-center'
                >
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.age}
                </p>
              )}
            </div>

            <div className='relative'>
              <label
                htmlFor='photo'
                className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
              >
                Photo URL
              </label>
              <input
                id='photo'
                name='photo'
                type='url'
                value={formData.photo}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.photo
                    ? "border-red-500"
                    : "border-gray-300 dark:border-slate-600"
                } focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-text-light dark:text-text-dark`}
                placeholder='https://example.com/photo.jpg'
                aria-invalid={errors.photo ? "true" : "false"}
                aria-describedby={errors.photo ? "photo-error" : undefined}
              />
              {errors.photo && (
                <p
                  id='photo-error'
                  className='text-red-500 mt-1 text-sm flex items-center'
                >
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.photo}
                </p>
              )}
            </div>

            <div className='flex gap-4'>
              <button
                type='submit'
                className='flex-1 bg-blue-600 hover:bg-primary-700 text-text-dark dark:text-text-dark font-semibold py-3 rounded-lg shadow-md transition-all duration-200'
              >
                Save Changes
              </button>
              <button
                type='button'
                onClick={() => setEditMode(false)}
                className='flex-1 bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-600 text-text-dark dark:text-text-dark font-semibold py-3 rounded-lg shadow-md transition-all duration-200'
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
