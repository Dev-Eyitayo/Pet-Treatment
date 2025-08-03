import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import InputField from "../components/InputField";
import Checkbox from "../components/CheckBox";
import Button from "../components/Button";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { useNavigate } from "react-router-dom";

// Form data structure
const initialFormData = {
  email: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialFormData);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Handle input changes for form fields
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Toggle remember me checkbox
  const handleCheckboxChange = useCallback(() => {
    setRememberMe((prev) => !prev);
  }, []);

  // Validate form fields
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill out all required fields.", {
        position: "bottom-right",
      });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address.", {
        position: "bottom-right",
      });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      try {
        const payload = {
          email: formData.email,
          password: formData.password,
        };

        console.log(
          "Login API URL:",
          `${import.meta.env.VITE_API_BASE_URL}/api/user/login/`
        );
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/login/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Login response:", response.data);
        const { access } = response.data; 
        console.log("Stored token:", access);

        if (rememberMe) {
          localStorage.setItem("authToken", access);
          console.log(
            "Stored in localStorage:",
            localStorage.getItem("authToken")
          );
        } else {
          sessionStorage.setItem("authToken", access);
          console.log(
            "Stored in sessionStorage:",
            sessionStorage.getItem("authToken")
          );
        }

        toast.success("Logged in successfully!", {
          position: "bottom-right",
        });
        navigate("/");
      } catch (error) {
        console.error("Login error:", {
          status: error.response?.status,
          data: error.response?.data,
        });
        const errors = error.response?.data || {};
        let errorMessage = "Failed to log in. Please try again.";

        if (errors.non_field_errors) {
          errorMessage = errors.non_field_errors[0];
        } else if (errors.email) {
          errorMessage = `Email: ${errors.email[0]}`;
        } else if (errors.password) {
          errorMessage = `Password: ${errors.password[0]}`;
        } else if (errors.detail) {
          errorMessage = errors.detail;
        }

        toast.error(errorMessage, {
          position: "bottom-right",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, rememberMe]
  );

  return (
    <div className='min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark flex items-center justify-center px-4 transition-colors duration-300'>
      <div className='max-w-md w-full space-y-6'>
        <div className='text-center'>
          
          <h2 className='text-2xl font-bold text-text-light dark:text-text-dark'>
            Log in to your account
          </h2>
        </div>

        <form className='space-y-4' onSubmit={handleSubmit}>
          <InputField
            placeholder='Enter your email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleInputChange}
          />
          <InputField
            placeholder='Password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleInputChange}
          />

          <Checkbox
            id='remember'
            checked={rememberMe}
            onChange={handleCheckboxChange}
            label={
              <span className='text-text-light dark:text-text-dark'>
                Remember me
              </span>
            }
          />

          <Button
            type='submit'
            label={isLoading ? "Logging In..." : "Log In"}
            disabled={isLoading}
          />
        </form>

        <div className='flex items-center justify-center'>
          <span className='text-sm text-text-light dark:text-text-dark opacity-70'>
            or
          </span>
        </div>

        <GoogleAuthButton onClick={() => console.log("Google login")} />

        <p className='text-center text-sm text-text-light dark:text-text-dark opacity-70'>
          Don't have an account?{" "}
          <a
            href='/signup'
            className='text-primary font-medium dark:text-primary-dark'
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
