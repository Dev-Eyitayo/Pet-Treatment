// import axios from "axios"; // raw axios, not your axiosInstance
// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// export const useCloudinaryUpload = () => {
//   const getSignature = async (folder = "doctor_certificates") => {
//     const response = await axios.get(
//       "http://localhost:8000/api/generate-cloudinary-signature?folder=" + folder
//     );
//     return response.data;
//   };

//   const uploadToCloudinary = async (file, folder = "doctor_certificates") => {
//     const { signature, timestamp, api_key, cloud_name } =
//       await getSignature(folder);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("folder", folder);
//     formData.append("timestamp", timestamp);
//     formData.append("api_key", api_key);
//     formData.append("signature", signature);

//     // Use plain axios here to avoid Authorization header
//     const response = await axios.post(
//       `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
//       formData
//     );

//     return response.data.secure_url;
//   };

//   return { uploadToCloudinary };
// };

import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

export const useCloudinaryUpload = () => {
  const getSignature = async (folder = "doctor_certificates") => {
    const response = await axiosInstance.get(
      `/generate-cloudinary-signature?folder=${folder}`
    );
    return response.data;
  };

  const uploadToCloudinary = async (file, folder = "doctor_certificates") => {
    const { signature, timestamp, api_key, cloud_name } =
      await getSignature(folder);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("timestamp", timestamp);
    formData.append("api_key", api_key);
    formData.append("signature", signature);

    // Use raw axios here to avoid sending Authorization header
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
      formData
    );

    return res.data.secure_url;
  };

  return { uploadToCloudinary };
};
