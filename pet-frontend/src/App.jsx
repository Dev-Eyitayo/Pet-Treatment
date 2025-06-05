import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { ThemeProvider } from "./context/ThemeContext";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import AppointmentDetails from "./pages/AppointmentDetails";
import PetProfile from "./pages/PetProfile";
import AddPet from "./pages/AddPet";
import BookAppointment from "./pages/BookAppointment";
import AppointmentRequest from "./pages/AppointmentRequest";
import PetList from "./pages/PetList";
import DoctorApplication from "./pages/DoctorApplication";
import Profile from "./components/ProfilePage/Profile";
import DoctorProfile from "./pages/DoctorProfile";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    // <AuthProvider>
      <Router>
        <ThemeProvider>
          <Routes>
            {/* Auth routes (outside layout) */}
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<Login />} />

            {/* App routes inside layout */}
            <Route path='/' element={<MainLayout />}>
              {/* index = default page for this layout (HomePage) */}
              <Route index element={<HomePage />} />
              <Route path='/doctors/:doctorId' element={<DoctorProfile />} />
              <Route path='appointments/:id' element={<AppointmentDetails />} />
              <Route path='requests/:id' element={<AppointmentRequest />} />
              <Route path="/pets/:petId" element={<PetProfile />} />
              <Route path='/pets' element={<PetList />} />

              {/* <Route path="/profile" element={<Profile />} /> */}

              <Route path='/add-pet' element={<AddPet />} />
              <Route path='/book-appointment' element={<BookAppointment />} />
              <Route
                path='/doctor-application'
                element={<DoctorApplication />}
              />
              <Route path='/profile' element={<Profile />} />
              {/* Add more nested routes here if needed */}
            </Route>
          </Routes>
        </ThemeProvider>
      </Router>
    // </AuthProvider>
  );
}

export default App;
