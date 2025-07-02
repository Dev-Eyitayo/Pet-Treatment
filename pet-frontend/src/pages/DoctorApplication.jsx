import { useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useCloudinaryUpload } from "../hooks/useCloudinaryUpload";

export default function DoctorApplication() {
  const [formData, setFormData] = useState({
    bio: "",
    specialization: "",
    certificates: [],
  });
  const [certificateMetadata, setCertificateMetadata] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [certificatePreviews, setCertificatePreviews] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const { uploadToCloudinary } = useCloudinaryUpload();

  const validSpecializations = [
    "Pediatrician",
    "Cardiologist",
    "Dermatologist",
    // Add more as needed
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation for bio
    if (name === "bio") {
      if (value.length > 1000) {
        setErrors((prev) => ({
          ...prev,
          bio: "Bio must not exceed 1000 characters",
        }));
        toast.error("Bio must not exceed 1000 characters");
      } else if (value.length < 50 && value.length > 0) {
        setErrors((prev) => ({
          ...prev,
          bio: "Bio must be at least 50 characters",
        }));
        toast.error("Bio must be at least 50 characters");
      } else {
        setErrors((prev) => ({ ...prev, bio: "" }));
      }
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const maxSize = 5 * 1024 * 1024;

    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      const invalidNames = invalidFiles.map((file) => file.name).join(", ");
      const errorMessage = `Invalid files: ${invalidNames}. Only PDF, JPG, and PNG files under 5MB are allowed.`;
      setErrors((prev) => ({
        ...prev,
        certificates: errorMessage,
      }));
      toast.error(errorMessage); // ❌ Toast for invalid files
      return;
    }

    if (formData.certificates.length + files.length > 5) {
      const errorMessage = "Cannot upload more than 5 certificates.";
      setErrors((prev) => ({
        ...prev,
        certificates: errorMessage,
      }));
      toast.error(errorMessage); // ❌ Toast for exceeding certificate limit
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls = [];
      const newMetadata = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        if (typeof url !== "string" || !url.includes("cloudinary.com")) {
          throw new Error(`Invalid Cloudinary URL for file: ${file.name}`);
        }
        uploadedUrls.push(url);
        newMetadata.push({ name: file.name, size: file.size, type: file.type });
      }

      setFormData((prev) => ({
        ...prev,
        certificates: [...prev.certificates, ...uploadedUrls],
      }));
      setCertificateMetadata((prev) => [...prev, ...newMetadata]);
      setCertificatePreviews((prev) => [
        ...prev,
        ...uploadedUrls.map((url) => (url.includes("image") ? url : null)),
      ]);
      setErrors((prev) => ({ ...prev, certificates: "" }));
      toast.success("Certificates uploaded successfully!"); // ✅ Toast for successful upload
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage =
        err.message || "Error uploading certificates. Please try again.";
      setErrors((prev) => ({
        ...prev,
        certificates: errorMessage,
      }));
      toast.error(errorMessage); // ❌ Toast for upload error
    } finally {
      setIsUploading(false);
    }
  };

  const getFileType = (url) => {
    if (url.includes(".pdf")) return "PDF";
    if (url.includes(".jpg") || url.includes(".jpeg") || url.includes(".png"))
      return "Image";
    return "Unknown";
  };

  const removeCertificate = (index) => {
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
    setCertificatePreviews((prev) => prev.filter((_, i) => i !== index));
    setCertificateMetadata((prev) => prev.filter((_, i) => i !== index));
    toast("Certificate removed"); // ℹ️ Toast for certificate removal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    let newErrors = {};
    if (!formData.bio) newErrors.bio = "Bio is required";
    else if (formData.bio.length < 50)
      newErrors.bio = "Bio must be at least 50 characters";
    else if (formData.bio.length > 1000)
      newErrors.bio = "Bio must not exceed 1000 characters";

    if (!formData.specialization)
      newErrors.specialization = "Specialization is required";
    else if (!validSpecializations.includes(formData.specialization))
      newErrors.specialization = "Please select a valid specialization";

    if (formData.certificates.length === 0) {
      newErrors.certificates = "At least one certificate is required";
    } else if (
      formData.certificates.some((url) => !url.includes("cloudinary.com"))
    ) {
      newErrors.certificates = "All certificates must be valid Cloudinary URLs";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const errorMessages = Object.values(newErrors).join("; ");
      toast.error(`Please fix the following errors: ${errorMessages}`); // ❌ Toast for invalid fields
      setIsSubmitting(false);
      return;
    }

    // Create FormData for submission
    const submissionData = new FormData();
    submissionData.append("bio", formData.bio);
    submissionData.append("specialization", formData.specialization);
    formData.certificates.forEach((url) =>
      submissionData.append("certificates[]", url)
    );

    try {
      await axios.post("/applications/", submissionData);
      setSubmissionSuccess(true);
      toast.success("Application submitted successfully!"); // ✅ Toast for successful submission
    } catch (err) {
      console.error("Submission error:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        Object.entries(err.response?.data || {})
          .map(([key, val]) => `${key}: ${val}`)
          .join("; ") ||
        "Failed to submit application. Please try again.";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage); // ❌ Toast for backend error (e.g., "Application already submitted")
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <section className='max-w-4xl mx-auto px-4 sm:px-6 py-12'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
          Application Submitted
        </h1>
        <div className='bg-green-100 dark:bg-green-800 rounded-2xl shadow-md p-6 sm:p-8'>
          <p className='text-lg text-gray-900 dark:text-white'>
            Your application has been successfully submitted and is pending
            review. You will be notified once it is processed.
          </p>
          {/* Removed "Submit Another Application" button */}
        </div>
      </section>
    );
  }

  return (
    <section className='max-w-4xl mx-auto px-4 sm:px-6 py-12'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
        Doctor Application
      </h1>
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 sm:p-8 space-y-6'
      >
        {errors.submit && (
          <p className='text-sm text-red-500 mt-1'>{errors.submit}</p>
        )}
        <div>
          <label
            htmlFor='bio'
            className='block text-sm font-medium text-gray-900 dark:text-white mb-1'
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
            className={`w-full rounded-lg border bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
              errors.bio
                ? "border-red-500"
                : "border-gray-300 dark:border-slate-600"
            }`}
            aria-describedby={errors.bio ? "bio-error" : undefined}
            required
          />
          {errors.bio && (
            <p id='bio-error' className='text-sm text-red-500 mt-1'>
              {errors.bio}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='specialization'
            className='block text-sm font-medium text-gray-900 dark:text-white mb-1'
          >
            Specialization <span className='text-red-500'>*</span>
          </label>
          <select
            id='specialization'
            name='specialization'
            value={formData.specialization}
            onChange={handleChange}
            className={`w-full rounded-lg border bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
              errors.specialization
                ? "border-red-500"
                : "border-gray-300 dark:border-slate-600"
            }`}
            aria-describedby={
              errors.specialization ? "specialization-error" : undefined
            }
            required
          >
            <option value=''>Select Specialization</option>
            {validSpecializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          {errors.specialization && (
            <p id='specialization-error' className='text-sm text-red-500 mt-1'>
              {errors.specialization}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor='certificates'
            className='block text-sm font-medium text-gray-900 dark:text-white mb-1'
          >
            Certificates (PDF, JPG, PNG) <span className='text-red-500'>*</span>
          </label>
          <input
            id='certificates'
            type='file'
            multiple
            accept='.pdf,.jpg,.jpeg,.png'
            onChange={handleFileChange}
            disabled={isUploading}
            className={`w-full rounded-md border ${
              errors.certificates ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white p-2`}
            aria-describedby={
              errors.certificates ? "certificates-error" : undefined
            }
          />
          {isUploading && (
            <p className='text-sm text-gray-500 mt-1'>Uploading files...</p>
          )}
          {errors.certificates && (
            <p id='certificates-error' className='text-sm text-red-500 mt-1'>
              {errors.certificates}
            </p>
          )}

          {formData.certificates.length > 0 && (
            <div className='mt-4 space-y-4'>
              {formData.certificates.map((url, index) => (
                <div
                  key={index}
                  className='bg-gray-100 dark:bg-slate-700 rounded-lg p-4 flex items-center gap-4'
                >
                  {certificatePreviews[index] ? (
                    <img
                      src={certificatePreviews[index]}
                      alt={`Certificate ${certificateMetadata[index]?.name || "Unknown"}`}
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
                    <p className='text-sm font-medium truncate'>
                      {certificateMetadata[index]?.name || "Unknown"}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {getFileType(url)} •{" "}
                      {(certificateMetadata[index]?.size / 1024 / 1024).toFixed(
                        2
                      )}{" "}
                      MB
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => removeCertificate(index)}
                    className='p-2 text-red-500 hover:text-red-700 rounded-full'
                    aria-label={`Remove ${certificateMetadata[index]?.name || "certificate"}`}
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
            disabled={isSubmitting || isUploading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg ${
              isSubmitting || isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </section>
  );
}
