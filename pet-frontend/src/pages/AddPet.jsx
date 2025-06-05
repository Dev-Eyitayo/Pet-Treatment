import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddPet() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    photoFile: null,
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Pet name is required";
    if (!formData.species.trim()) errs.species = "Species is required";
    if (!formData.breed.trim()) errs.breed = "Breed is required";
    if (!formData.age || isNaN(formData.age) || formData.age <= 0)
      errs.age = "Valid age is required";
    if (formData.photoFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(formData.photoFile.type)) {
        errs.photoFile = "Photo must be a JPG, PNG, GIF, or WEBP image";
      }
      const maxSizeMB = 5;
      if (formData.photoFile.size > maxSizeMB * 1024 * 1024) {
        errs.photoFile = `Photo must be smaller than ${maxSizeMB}MB`;
      }
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photoFile") {
      const file = files[0];
      setFormData((d) => ({ ...d, photoFile: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFormData((d) => ({ ...d, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to add a pet.");
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("species", formData.species);
      formDataToSend.append("breed", formData.breed);
      formDataToSend.append("age", Number(formData.age));
      if (formData.photoFile) {
        formDataToSend.append("image", formData.photoFile); // Match backend field name
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/pets/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Pet added successfully!");
      setLoading(false);
      navigate("/pets");
    } catch (err) {
      console.error("Add pet error:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})
          .flat()
          .join(", ") ||
        "Failed to add pet. Please try again.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto px-6 py-12'>
      <h1 className='text-3xl font-bold text-text-light dark:text-text-dark mb-8'>
        Add New Pet
      </h1>

      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8 space-y-6'
        encType='multipart/form-data'
      >
        <div>
          <label
            htmlFor='name'
            className='block font-semibold mb-1 text-text-light dark:text-text-dark'
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
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
            placeholder='e.g., Buddy'
            disabled={loading}
          />
          {errors.name && (
            <p className='text-red-500 mt-1 text-sm'>{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='species'
            className='block font-semibold mb-1 text-text-light dark:text-text-dark'
          >
            Species <span className='text-red-500'>*</span>
          </label>
          <select
            id='species'
            name='species'
            value={formData.species}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.species ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
            disabled={loading}
          >
            <option value=''>Select Species</option>
            <option value='dog'>Dog</option>
            <option value='cat'>Cat</option>
            <option value='bird'>Bird</option>
            <option value='other'>Other</option>
          </select>
          {errors.species && (
            <p className='text-red-500 mt-1 text-sm'>{errors.species}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='breed'
            className='block font-semibold mb-1 text-text-light dark:text-text-dark'
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
              errors.breed ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
            placeholder='e.g., Golden Retriever'
            disabled={loading}
          />
          {errors.breed && (
            <p className='text-red-500 mt-1 text-sm'>{errors.breed}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='age'
            className='block font-semibold mb-1 text-text-light dark:text-text-dark'
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
              errors.age ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
            placeholder='e.g., 4'
            disabled={loading}
          />
          {errors.age && (
            <p className='text-red-500 mt-1 text-sm'>{errors.age}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='photoFile'
            className='block font-semibold mb-1 text-text-light dark:text-text-dark'
          >
            Upload Photo
          </label>
          <input
            id='photoFile'
            name='photoFile'
            type='file'
            accept='image/*'
            onChange={handleChange}
            className={`w-full rounded-md border ${
              errors.photoFile ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white p-2`}
            disabled={loading}
          />
          {errors.photoFile && (
            <p className='text-red-500 mt-1 text-sm'>{errors.photoFile}</p>
          )}
          {preview && (
            <img
              src={preview}
              alt='Preview'
              className='mt-4 max-h-48 rounded-md object-contain border border-gray-300 dark:border-slate-700'
            />
          )}
        </div>

        <button
          type='submit'
          className={`w-full bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 text-white font-semibold py-3 rounded-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding Pet..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
}
