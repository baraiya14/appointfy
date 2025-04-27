// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './components/HomePage';
import PatientDashboard from './components/PatientDashboard';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DoctorSignup from "./pages/DoctorSignup";
import AdminSignup from "./pages/AdminSignup";
import AppointmentForm from './components/AppointmentForm';
import Profile from './components/Profile'; // Assuming you will create this component
import Reports from './components/Reports'; // Assuming you will create this component
import DepartmentManagement from './components/DepartmentManagement'; // Assuming you will create this component
import DoctorManagement from './components/DoctorManagement'; // Assuming you will create this component
import PatientManagement from './components/PatientManagement';
import './App.css'; // Import the CSS file

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/patient" element={<PatientDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/doctor" element={<DoctorDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/doctor-signup" element={<DoctorSignup />} />
                <Route path="/admin-signup" element={<AdminSignup />} />
                <Route path="/appointment" element={<AppointmentForm />} />
                <Route path="/profile" element={<Profile />} /> 
                <Route path="/reports" element={<Reports />} />
                <Route path="/manage-departments" element={<DepartmentManagement />} />
                <Route path="/manage-doctors" element={<DoctorManagement />} />
                <Route path="/manage-patients" element={<PatientManagement />} />
            </Routes>
        </Router>
    );
};

export default App;