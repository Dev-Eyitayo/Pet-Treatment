import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import InputField from "../components/InputField";
import Checkbox from "../components/CheckBox";
import Button from "../components/Button";
import GoogleAuthButton from "../components/GoogleAuthButton";

// Form data structure
const initialFormData = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
};

export default function SignUp() {
  const [formData, setFormData] = useState(initialFormData);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes for form fields
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Toggle terms checkbox
  const handleCheckboxChange = useCallback(() => {
    setIsTermsChecked((prev) => !prev);
  }, []);

  // Validate form fields
  const validateForm = () => {
    if (
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.password
    ) {
      toast.error("Please fill out all required fields.", {
        position: "bottom-right",
      });
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.", {
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

      if (!isTermsChecked) {
        toast.error("Please agree to the terms and conditions.", {
          position: "bottom-right",
        });
        return;
      }

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      try {
        const payload = {
          email: formData.email,
          firstname: formData.firstName,
          lastname: formData.lastName,
          password: formData.password,
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/signup/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Account created successfully! Please log in.", {
          position: "bottom-right",
        });
        window.location.href = "/login"; // Consider using react-router-dom for navigation
      } catch (error) {
        const errors = error.response?.data || {};
        let errorMessage = "Failed to create account. Please try again.";

        if (errors.email) {
          errorMessage = `Email: ${errors.email[0]}`;
        } else if (errors.firstname) {
          errorMessage = `First Name: ${errors.firstname[0]}`;
        } else if (errors.lastname) {
          errorMessage = `Last Name: ${errors.lastname[0]}`;
        } else if (errors.password) {
          errorMessage = `Password: ${errors.password[0]}`;
        } else if (errors.non_field_errors) {
          errorMessage = errors.non_field_errors[0];
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
    [formData, isTermsChecked]
  );

  return (
    <div className='min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark flex items-center justify-center px-4 transition-colors duration-300'>
      <div className='max-w-md w-full space-y-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-text-light dark:text-text-dark'>
            Sign up to continue
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
            placeholder='First Name'
            name='firstName'
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <InputField
            placeholder='Last Name'
            name='lastName'
            value={formData.lastName}
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
            id='terms'
            checked={isTermsChecked}
            onChange={handleCheckboxChange}
            label='I agree to the terms and conditions'
          />

          <Button
            type='submit'
            label={isLoading ? "Creating Account..." : "Create Account"}
            disabled={!isTermsChecked || isLoading}
          />
        </form>

        <div className='flex items-center justify-center'>
          <span className='text-sm text-text-light dark:text-text-dark opacity-70'>
            or
          </span>
        </div>

        <GoogleAuthButton onClick={() => console.log("Google signup")} />

        <p className='text-center text-sm text-text-light dark:text-text-dark opacity-70'>
          Already have an account?{" "}
          <a
            href='/login'
            className='text-primary font-medium dark:text-primary-dark'
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
