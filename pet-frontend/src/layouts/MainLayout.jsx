import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import ThemeToggle from "../components/ThemeToggle";

const MainLayout = () => {
  // Dummy data for user
  const dummyUser = {
    firstname: "John",
    lastname: "Doe",
    role: "user",
    profilepicture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  };

  // Dummy data for profileData
  const dummyProfileData = {
    bio: "Experienced cardiologist with a passion for patient care.",
    specialization: "Cardiology",
    available_days: ["Monday", "Wednesday", "Friday"],
    available_times: {
      Monday: [{ from: "09:00", to: "17:00" }],
      Wednesday: [{ from: "10:00", to: "16:00" }],
      Friday: [{ from: "08:00", to: "14:00" }],
    },
    years_experience: 12,
    address: "123 Heartbeat Lane, Health City",
  };

  // Dummy updateProfile function
  const updateProfile = (formData) => {
    console.log("Profile updated with:", formData);
    // Simulate saving data (no backend yet)
  };

  return (
    <div className='min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-300 flex'>
      <Navigation />
      <main className='flex-1 md:ml-64 pt-4 pb-20 md:pb-4 px-4'>
        
        {/* Pass dummy data to nested routes via Outlet context */}
        <Outlet
          context={{
            user: dummyUser,
            profileData: dummyProfileData,
            updateProfile,
          }}
        />
      </main>
    </div>
  );
};

export default MainLayout;
