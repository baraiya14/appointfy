import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorManagement = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
    qualifications: "",
    phone: "",
    address: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await axios.get('http://localhost:8084/api/doctors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDoctors(response.data);
      setLoadingDoctors(false);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setLoadingDoctors(false);
    }
  };

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (doctor.password !== doctor.confirmPassword) {
      setError("Passwords do not match!");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      // Create registration payload (exclude confirmPassword)
      const registrationData = {
        fullName: doctor.fullName,
        email: doctor.email,
        password: doctor.password,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
        experience: doctor.experience,
        qualifications: doctor.qualifications,
        phone: doctor.phone,
        address: doctor.address
      };
      
      // Call the backend API
      await axios.post(
        "http://localhost:8084/api/auth/register/doctor", 
        registrationData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setSuccess("Doctor registered successfully!");
      
      // Reset form and refresh doctor list
      setDoctor({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        specialization: "",
        licenseNumber: "",
        experience: "",
        qualifications: "",
        phone: "",
        address: "",
      });
      
      fetchDoctors();
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Obstetrics and Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Urology"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Doctor Management</h1>
        <button 
          onClick={() => navigate("/admin")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return to Dashboard
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doctor Registration Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Add New Doctor</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  value={doctor.fullName}
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
                  value={doctor.email}
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
                  value={doctor.password}
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
                  value={doctor.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization*</label>
                <select
                  name="specialization"
                  value={doctor.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number*</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={doctor.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  value={doctor.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={doctor.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
              <textarea
                name="qualifications"
                value={doctor.qualifications}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MD, Ph.D., Board Certifications, etc."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={doctor.address}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Doctor"}
            </button>
          </form>
        </div>

        {/* Doctor List Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Doctor List</h2>
          {loadingDoctors ? (
            <div className="text-center py-4">Loading doctors...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Specialization</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Phone</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.length > 0 ? (
                    doctors.map((doc, index) => (
                      <tr key={index} className="border hover:bg-gray-50">
                        <td className="border p-2">{doc.fullName}</td>
                        <td className="border p-2">{doc.specialization}</td>
                        <td className="border p-2">{doc.email}</td>
                        <td className="border p-2">{doc.phone}</td>
                        <td className="border p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${doc.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {doc.available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="border p-4 text-center text-gray-500">No doctors found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Doctor Statistics */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Department Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-blue-800 text-lg font-semibold">Total Doctors</h3>
            <p className="text-3xl font-bold text-blue-600">{doctors.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h3 className="text-green-800 text-lg font-semibold">Available Doctors</h3>
            <p className="text-3xl font-bold text-green-600">
              {doctors.filter(doc => doc.available).length}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="text-purple-800 text-lg font-semibold">Specializations</h3>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(doctors.map(doc => doc.specialization)).size}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <h3 className="text-yellow-800 text-lg font-semibold">New This Month</h3>
            <p className="text-3xl font-bold text-yellow-600">-</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <img src="https://img.freepik.com/free-photo/team-young-specialist-doctors-standing-corridor-hospital_1303-21202.jpg" 
             alt="Doctor Team" 
             className="rounded-lg shadow-md max-w-full h-auto" 
             style={{maxHeight: "300px"}} />
      </div>
    </div>
  );
};

export default DoctorManagement;
