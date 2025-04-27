import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    specialization: "",
    license: "",
    experience: "",
    address: "",
    age: "",
    gender: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  
  // Get token and role from localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Determine API endpoint based on role
        let endpoint = "";
        if (role === "ROLE_PATIENT") {
          endpoint = "/api/patient/profile";
        } else if (role === "ROLE_DOCTOR") {
          endpoint = "/api/doctor/profile";
        } else if (role === "ROLE_ADMIN") {
          endpoint = "/api/admin/profile"; // Assuming admin profile endpoint
        }
        
        if (endpoint) {
          const response = await axios.get(`http://localhost:8084${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          // Map backend data to form fields
          const userData = response.data;
          
          if (role === "ROLE_PATIENT") {
            setProfile({
              name: userData.patientName || "",
              email: userData.email || "",
              password: "",
              phone: userData.phone || "",
              dob: userData.dateOfBirth || "",
              address: userData.address || "",
              age: userData.age || "",
              gender: userData.gender || ""
            });
          } else if (role === "ROLE_DOCTOR") {
            setProfile({
              name: userData.fullName || "",
              email: userData.email || "",
              password: "",
              phone: userData.phone || "",
              dob: userData.dateOfBirth || "",
              specialization: userData.specialization || "",
              license: userData.licenseNumber || "",
              experience: userData.experience || ""
            });
          } else if (role === "ROLE_ADMIN") {
            setProfile({
              name: userData.fullName || "",
              email: userData.email || "",
              password: "",
              phone: userData.phone || "",
              dob: userData.dateOfBirth || ""
            });
          }
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      // Create payload based on role
      let endpoint = "";
      let payload = {};
      
      if (userRole === "ROLE_PATIENT") {
        endpoint = "/api/patient/profile";
        payload = {
          patientName: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          age: profile.age ? parseInt(profile.age, 10) : null,
          gender: profile.gender,
          dateOfBirth: profile.dob
        };
      } else if (userRole === "ROLE_DOCTOR") {
        endpoint = "/api/doctor/update";
        payload = {
          fullName: profile.name,
          email: profile.email,
          phone: profile.phone,
          specialization: profile.specialization,
          dateOfBirth: profile.dob
        };
      } else if (userRole === "ROLE_ADMIN") {
        endpoint = "/api/admin/profile"; // Assuming endpoint
        payload = {
          fullName: profile.name,
          email: profile.email,
          phone: profile.phone,
          dateOfBirth: profile.dob
        };
      }
      
      // Only update password if it's provided
      if (profile.password) {
        payload.password = profile.password;
      }
      
      if (endpoint) {
        await axios.put(`http://localhost:8084${endpoint}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setSuccess("Profile updated successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={profile.name} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            value={profile.email} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input 
            type="password" 
            name="password" 
            value={profile.password} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
            placeholder="Leave blank to keep current password" 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="text" 
            name="phone" 
            value={profile.phone} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input 
            type="date" 
            name="dob" 
            value={profile.dob} 
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md" 
          />
        </div>
        
        {userRole === "ROLE_PATIENT" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input 
                type="number" 
                name="age" 
                value={profile.age} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select 
                name="gender" 
                value={profile.gender || ""} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea 
                name="address" 
                value={profile.address} 
                onChange={handleChange} 
                rows="2" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
          </>
        )}
        
        {userRole === "ROLE_DOCTOR" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input 
                type="text" 
                name="specialization" 
                value={profile.specialization} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input 
                type="text" 
                name="license" 
                value={profile.license} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input 
                type="text" 
                name="experience" 
                value={profile.experience} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              />
            </div>
          </>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={handleUpdate} 
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
