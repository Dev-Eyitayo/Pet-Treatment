import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
export default function PetProfile() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: null, // Initialize as null instead of ""
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/pets/${petId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPet(response.data);
        setFormData({
          name: response.data.name,
          species: response.data.species,
          breed: response.data.breed,
          age: response.data.age, // Keep as number
          image: null,
        });
        setImagePreview(response.data.image || "");
      } catch (err) {
        console.error("Fetch pet error:", err.response?.data || err.message);
        setError(err.response?.data?.detail || "Failed to fetch pet details");
        if (err.response?.status === 401) {
          navigate("/login");
        } else if (err.response?.status === 404) {
          navigate("/pets", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId, navigate]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Pet name is required";
    if (!formData.species.trim()) errs.species = "Species is required";
    if (!formData.breed.trim()) errs.breed = "Breed is required";
    if (formData.age === null || isNaN(formData.age) || formData.age <= 0)
      errs.age = "Valid age is required";
    if (
      formData.image &&
      !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        formData.image.type
      )
    ) {
      errs.image = "Image must be a valid format (jpg, png, gif, webp)";
    }
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      errs.image = "Image size must be less than 5MB";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(pet?.image || "");
      }
    } else if (name === "age") {
      // Convert to number or null if empty
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("species", formData.species);
      formDataToSend.append("breed", formData.breed);
      formDataToSend.append("age", Number(formData.age)); // Already a number
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/pets/${petId}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPet(response.data);
      setEditMode(false);
      setFormData({
        name: response.data.name,
        species: response.data.species,
        breed: response.data.breed,
        age: response.data.age, // Keep as number
        image: null,
      });
      setImagePreview(response.data.image || "");
      toast.success("Pet updated successfully!");
    } catch (err) {
      console.error("Update pet error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Failed to update pet");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div className='max-w-4xl mx-auto px-3 py-12'>
        <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center'>
          <p className='text-red-500 mb-4'>{error}</p>
          <button
            onClick={() => navigate("/pets")}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'
          >
            Back to Pets List
          </button>
        </div>
      </div>
    );
  }

  if (!pet) {
    return null;
  }

  return (
    <div className='max-w-4xl mx-auto px-2 py-12'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
          {editMode ? "Edit Pet Profile" : `${pet.name}'s Profile`}
        </h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm rounded-lg font-semibold shadow-md transition-all duration-200'
          aria-label={editMode ? "Cancel editing" : "Edit pet profile"}
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 transition-all duration-300'>
        {!editMode ? (
          // View Mode
          <div className='flex flex-col md:flex-row items-center gap-8'>
            <div className='relative group'>
              <img
                src={pet.image || "https://via.placeholder.com/300"}
                alt={pet.name}
                className='w-56 h-56 object-cover rounded-full shadow-md transition-transform duration-300 group-hover:scale-105'
                loading='lazy'
              />
              <div className='absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300'></div>
            </div>
            <div className='flex-1 space-y-4'>
              <h2 className='text-3xl font-semibold text-gray-900 dark:text-white'>
                {pet.name}
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <p className='text-gray-600 dark:text-gray-300'>
                  <strong className='font-medium'>Species:</strong>{" "}
                  {pet.species}
                </p>
                <p className='text-gray-600 dark:text-gray-300'>
                  <strong className='font-medium'>Breed:</strong> {pet.breed}
                </p>
                <p className='text-gray-600 dark:text-gray-300'>
                  <strong className='font-medium'>Age:</strong> {pet.age} year
                  {pet.age > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className='space-y-6 max-w-lg mx-auto'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 dark:text-gray-200'
              >
                Pet Name <span className='text-red-500'>*</span>
              </label>
              <input
                id='name'
                name='name'
                type='text'
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 rounded-md border ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-slate-600"
                } focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 text-gray-900 dark:text-white`}
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
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='species'
                className='block text-sm font-medium text-gray-700 dark:text-gray-200'
              >
                Species <span className='text-red-500'>*</span>
              </label>
              <input
                id='species'
                name='species'
                type='text'
                value={formData.species}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 rounded-md border ${
                  errors.species
                    ? "border-red-500"
                    : "border-gray-300 dark:border-slate-600"
                } focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 text-gray-900 dark:text-white`}
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

            <div>
              <label
                htmlFor='breed'
                className='block text-sm font-medium text-gray-700 dark:text-gray-200'
              >
                Breed <span className='text-red-500'>*</span>
              </label>
              <input
                id='breed'
                name='breed'
                type='text'
                value={formData.breed}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 rounded-md border ${
                  errors.breed
                    ? "border-red-500"
                    : "border-gray-300 dark:border-slate-600"
                } focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 text-gray-900 dark:text-white`}
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

            <div>
              <label
                htmlFor='age'
                className='block text-sm font-medium text-gray-700 dark:text-gray-200'
              >
                Age (years) <span className='text-red-500'>*</span>
              </label>
              <input
                id='age'
                name='age'
                type='number'
                min='0'
                value={formData.age ?? ""} // Use empty string for input if null
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 rounded-md border ${
                  errors.age
                    ? "border-red-500"
                    : "border-gray-300 dark:border-slate-600"
                } focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 text-gray-900 dark:text-white`}
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

            <div>
              <label
                htmlFor='image'
                className='block text-sm font-medium text-gray-700 dark:text-gray-200'
              >
                Pet Image
              </label>
              <input
                id='image'
                name='image'
                type='file'
                accept='image/jpeg,image/png,image/gif,image/webp'
                onChange={handleChange}
                className='mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 text-gray-900 dark:text-white'
                aria-invalid={errors.image ? "true" : "false"}
                aria-describedby={errors.image ? "image-error" : undefined}
              />
              {imagePreview && (
                <div className='mt-2'>
                  <img
                    src={imagePreview}
                    alt='Preview'
                    className='w-32 h-32 object-cover rounded-md'
                  />
                </div>
              )}
              {errors.image && (
                <p
                  id='image-error'
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
                  {errors.image}
                </p>
              )}
            </div>

            <div className='flex gap-4'>
              <button
                type='submit'
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-2 rounded-lg shadow-md transition-all duration-200'
              >
                Save Changes
              </button>
              <button
                type='button'
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    name: pet.name,
                    species: pet.species,
                    breed: pet.breed,
                    age: pet.age, // Reset to original number
                    image: null,
                  });
                  setImagePreview(pet.image || "");
                }}
                className='flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-2 rounded-lg shadow-md transition-all duration-200'
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
