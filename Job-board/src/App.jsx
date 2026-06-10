import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import JobDetails from "./pages/JobDetails";
import Addjobform from "./pages/Addjobform";
import Editjobform from "./pages/Editjobform";
import Favorites from "./pages/Favorites";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Profile from "./auth/Profile";
import ForgotPassword from "./auth/Forgotpassword";
import PrivateRoute from "./components/PrivateRoute";
import ResetPassword from "./auth/Resetpassword";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <Navbar />

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/job/:id" element={
          <PrivateRoute>
            <JobDetails />
          </PrivateRoute>
        } />

        <Route path="/addjob" element={
          <PrivateRoute>
            <Addjobform />
          </PrivateRoute>
        } />

        <Route path="/Editjob/:id" element={
          <PrivateRoute>
            <Editjobform />
          </PrivateRoute>
        } />

        <Route path="/favorites" element={
          <PrivateRoute>
            <Favorites />
          </PrivateRoute>
        } />

      </Routes>
    </>
  );
}

export default App;