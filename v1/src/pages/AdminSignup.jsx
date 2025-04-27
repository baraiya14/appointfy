import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    adminCode: "", // Secret code for admin registration
    phone: "",
    position: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admin.password !== admin.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Create registration payload (exclude confirmPassword and adminCode)
      const registrationData = {
        fullName: admin.fullName,
        email: admin.email,
        password: admin.password,
        department: admin.department,
        phone: admin.phone,
        position: admin.position,
        adminVerificationCode: admin.adminCode // Send verification code to backend
      };
      
      // Call the backend API
      const response = await axios.post(
        "http://localhost:8084/api/auth/register/admin", 
        registrationData
      );
      
      console.log("Registration successful:", response.data);
      
      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    "IT Administration",
    "Hospital Management",
    "Patient Support",
    "Billing & Insurance",
    "Operations",
    "Human Resources",
    "Compliance & Legal",
    "Marketing",
    "Executive",
    "Other"
  ];

  const positions = [
    "System Administrator",
    "Database Administrator",
    "Department Head",
    "Manager",
    "Supervisor",
    "Coordinator",
    "Director",
    "Executive Officer",
    "Assistant",
    "Specialist"
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Administrator Registration</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded mb-4">
          <p className="text-sm">Note: Admin registration requires an admin verification code from existing administrators.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
              <input
                type="text"
                name="fullName"
                value={admin.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <input
                type="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
              <input
                type="password"
                name="password"
                value={admin.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password*</label>
              <input
                type="password"
                name="confirmPassword"
                value={admin.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
              <select
                name="department"
                value={admin.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position*</label>
              <select
                name="position"
                value={admin.position}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Position</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={admin.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Code*</label>
              <input
                type="password"
                name="adminCode"
                value={admin.adminCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter verification code"
              />
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the terms and conditions and understand administrator responsibilities
            </label>
          </div>
          
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="privacy"
              className="mr-2"
              required
            />
            <label htmlFor="privacy" className="text-sm text-gray-600">
              I will maintain the confidentiality of patient and system data
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Processing..." : "Register as Administrator"}
          </button>
        </form>
        
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup; 