import { useState } from "react";
import axios from "axios";

export default function DoctorApplication() {
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
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        certificates: "Only PDF, JPG, and PNG files are allowed.",
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

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("specialization", formData.specialization);
    formData.certificates.forEach((file, index) => {
      formDataToSend.append(`certificates[${index}]`, file);
    });

    try {
      await axios.post("/api/doctor-application/", formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Application submitted successfully!");
      setFormData({ bio: "", specialization: "", certificates: [] });
      setCertificatePreviews([]);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileType = (file) => {
    const type = file.type.split("/")[1].toUpperCase();
    return type === "JPEG" || type === "PNG" ? "Image" : "PDF";
  };

  return (
    <section className='max-w-4xl mx-auto px-4 sm:px-6 py-12'>
      <h1 className='text-3xl font-bold text-text-light dark:text-text-dark mb-6'>
        Doctor Application
      </h1>

      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 sm:p-8 space-y-6'
      >
        {/* Bio */}
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
            aria-invalid={errors.bio ? "true" : "false"}
            aria-describedby={errors.bio ? "bio-error" : undefined}
          />
          {errors.bio && (
            <p
              id='bio-error'
              className='text-sm text-red-500 mt-1 flex items-center'
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
              {errors.bio}
            </p>
          )}
        </div>

        {/* Specialization */}
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
            aria-invalid={errors.specialization ? "true" : "false"}
            aria-describedby={
              errors.specialization ? "specialization-error" : undefined
            }
          />
          {errors.specialization && (
            <p
              id='specialization-error'
              className='text-sm text-red-500 mt-1 flex items-center'
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
              {errors.specialization}
            </p>
          )}
        </div>

        {/* Certificates - Improved Section */}
        <div>
          <label
            htmlFor='certificates'
            className='block text-sm font-medium text-text-light dark:text-text-dark mb-1'
          >
            Certificates (PDF, JPG, PNG) <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <input
              id='certificates'
              type='file'
              multiple
              accept='.pdf,.jpg,.jpeg,.png'
              onChange={handleFileChange}
              className={`w-full rounded-md border ${
                errors.photoFile ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white p-2`}
            />
            
          </div>
          {errors.certificates && (
            <p
              id='certificates-error'
              className='text-sm text-red-500 mt-1 flex items-center'
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
              {errors.certificates}
            </p>
          )}

          {formData.certificates.length > 0 && (
            <div className='mt-4 space-y-4'>
              {formData.certificates.map((file, index) => (
                <div
                  key={index}
                  className='bg-gray-100 dark:bg-slate-700 rounded-lg shadow-sm p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-md'
                >
                  {certificatePreviews[index] ? (
                    <img
                      src={certificatePreviews[index]}
                      alt={`Certificate ${file.name}`}
                      className='w-12 h-12 object-cover rounded-md border border-gray-200 dark:border-slate-600'
                    />
                  ) : (
                    <svg
                      className='w-12 h-12 text-gray-400 dark:text-gray-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z' />
                    </svg>
                  )}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-text-light dark:text-text-dark truncate'>
                      {file.name}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                      {getFileType(file)} •{" "}
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => removeCertificate(index)}
                    className='p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-all duration-200'
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
            className={`w-full bg-blue-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label={
              isSubmitting ? "Submitting application" : "Submit application"
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </section>
  );
}
