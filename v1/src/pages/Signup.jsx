import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    patientName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Create registration payload (exclude confirmPassword)
      const registrationData = {
        patientName: user.patientName,
        email: user.email,
        password: user.password
      };
      
      // Call the backend API
      const response = await axios.post(
        "http://localhost:8084/api/auth/register/patient", 
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Patient Sign Up</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="patientName"
            placeholder="Full Name"
            value={user.patientName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={user.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-2">Register as:</p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/doctor-signup" 
              className="text-sm px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Doctor
            </Link>
            <Link 
              to="/admin-signup" 
              className="text-sm px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
            >
              Administrator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
