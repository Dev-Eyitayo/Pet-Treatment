import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "../utils/axiosInstance"; // Custom axios instance
import { toast } from "react-toastify";

export default function DoctorApplication() {
  const { user } = useOutletContext();

  const [formData, setFormData] = useState({
    bio: "",
    specialization: "",
    certificates: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certificatePreviews, setCertificatePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        certificates: "Only PDF, JPG, and PNG files under 5MB are allowed.",
      }));
      return;
    }

    if (formData.certificates.length + files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        certificates: "Cannot upload more than 5 certificates.",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      certificates: [...prev.certificates, ...files],
    }));
    setErrors((prev) => ({ ...prev, certificates: "" }));

    const previews = files.map((file) =>
      file.type.startsWith("image/") ? URL.createObjectURL(file) : null
    );
    setCertificatePreviews((prev) => [...prev, ...previews]);
  };

  const removeCertificate = (index) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
    setCertificatePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs = {};
    if (!formData.bio.trim()) errs.bio = "Bio is required";
    if (!formData.specialization.trim())
      errs.specialization = "Specialization is required";
    if (formData.certificates.length === 0)
      errs.certificates = "At least one certificate is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to submit an application.", {
        position: "bottom-right",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("specialization", formData.specialization);
    formData.certificates.forEach((file) => {
      formDataToSend.append("certificates[]", file);
    });

    console.log("Submitting with token:", token);
    console.log(
      "API URL:",
      `${import.meta.env.VITE_API_BASE_URL}/api/applications/`
    );
    console.log("FormData entries:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Application submitted successfully!", {
        position: "bottom-right",
      });
      setFormData({ bio: "", specialization: "", certificates: [] });
      setCertificatePreviews([]);
    } catch (error) {
      console.error("Error submitting application:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.certificates?.[0] ||
        error.response?.data?.bio?.[0] ||
        error.response?.data?.specialization?.[0] ||
        error.response?.data?.non_field_errors?.[0] ||
        "Failed to submit application. Please check your input and try again.";
      toast.error(errorMessage, { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileType = (file) => {
    const type = file.type.split("/")[1].toUpperCase();
    return type === "JPEG" || type === "JPG" || type === "PNG"
      ? "Image"
      : "PDF";
  };

  useEffect(() => {
    return () => {
      certificatePreviews.forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [certificatePreviews]);

  return (
    <section className='max-w-4xl mx-auto px-4 sm:px-6 py-12'>
      <h1 className='text-3xl font-bold text-text-light dark:text-text-dark mb-6'>
        Doctor Application
      </h1>
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 sm:p-8 space-y-6'
      >
        <div>
          <label
            htmlFor='bio'
            className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
          >
            Bio <span className='text-red-500'>*</span>
          </label>
          <textarea
            id='bio'
            name='bio'
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder='Tell us about yourself and your qualifications...'
            className={`w-full rounded-lg border bg-white dark:bg-slate-800 text-text-light dark:text-text-dark px-4 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
              errors.bio
                ? "border-red-500"
                : "border-gray-300 dark:border-slate-600"
            }`}
          />
          {errors.bio && (
            <p className='text-sm text-red-500 mt-1'>{errors.bio}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='specialization'
            className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
          >
            Specialization <span className='text-red-500'>*</span>
          </label>
          <input
            id='specialization'
            name='specialization'
            type='text'
            value={formData.specialization}
            onChange={handleChange}
            placeholder='e.g., Pediatrician'
            className={`w-full rounded-lg border bg-white dark:bg-slate-800 text-text-light dark:text-text-dark px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
              errors.specialization
                ? "border-red-500"
                : "border-gray-300 dark:border-slate-600"
            }`}
          />
          {errors.specialization && (
            <p className='text-sm text-red-500 mt-1'>{errors.specialization}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='certificates'
            className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
          >
            Certificates (PDF, JPG, PNG) <span className='text-red-500'>*</span>
          </label>
          <input
            id='certificates'
            type='file'
            multiple
            accept='.pdf,.jpg,.jpeg,.png'
            onChange={handleFileChange}
            className={`w-full rounded-md border ${
              errors.certificates ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white p-2`}
          />
          {errors.certificates && (
            <p className='text-sm text-red-500 mt-1'>{errors.certificates}</p>
          )}

          {formData.certificates.length > 0 && (
            <div className='mt-4 space-y-4'>
              {formData.certificates.map((file, index) => (
                <div
                  key={index}
                  className='bg-gray-100 dark:bg-slate-700 rounded-lg p-4 flex items-center gap-4'
                >
                  {certificatePreviews[index] ? (
                    <img
                      src={certificatePreviews[index]}
                      alt={`Certificate ${file.name}`}
                      className='w-12 h-12 object-cover rounded-md border'
                    />
                  ) : (
                    <svg
                      className='w-12 h-12 text-gray-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z' />
                    </svg>
                  )}
                  <div className='flex-1'>
                    <p className='text-sm font-medium truncate'>{file.name}</p>
                    <p className='text-xs text-gray-500'>
                      {getFileType(file)} •{" "}
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>j
                  </div>
                  <button
                    type='button'
                    onClick={() => removeCertificate(index)}
                    className='p-2 text-red-500 hover:text-red-700 rounded-full'
                    aria-label={`Remove ${file.name}`}
                  >
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </section>
  );
}
