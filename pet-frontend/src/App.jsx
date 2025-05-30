import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { ThemeProvider } from "./context/ThemeContext";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage"; // Dashboard-like homepage

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          {/* Auth routes (no navigation or layout) */}
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />

          {/* Main app routes (wrapped in layout) */}
          <Route
            path='/'
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          {/* Add more routes as needed */}
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
