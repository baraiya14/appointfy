import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    
    // Redirect to home page
    navigate("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
        >
          Sign Out
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="bg-blue-500 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-bold">Doctors</h2>
          <p>Manage and view doctors.</p>
          <button 
            onClick={() => navigate("/manage-doctors")}
            className="mt-4 bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Go to Doctors
          </button>
        </div>
        
        <div className="bg-green-500 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-bold">Patients</h2>
          <p>Manage and view patients.</p>
          <button 
            onClick={() => navigate("/manage-patients")}
            className="mt-4 bg-white text-green-500 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Go to Patients
          </button>
        </div>
        
        <div className="bg-yellow-500 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-bold">Departments</h2>
          <p>Manage hospital departments.</p>
          <button 
            onClick={() => navigate("/manage-departments")}
            className="mt-4 bg-white text-yellow-500 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Go to Departments
          </button>
        </div>
        
        <div className="bg-red-500 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-bold">Reports</h2>
          <p>View and generate reports.</p>
          <button 
            onClick={() => navigate("/reports")}
            className="mt-4 bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Go to Reports
          </button>
        </div>
      </div>
      
      {/* Analytics Summary */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">System Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border p-4 rounded">
            <h3 className="text-gray-500">Total Patients</h3>
            <p className="text-2xl font-bold text-blue-600">--</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="text-gray-500">Total Doctors</h3>
            <p className="text-2xl font-bold text-green-600">--</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="text-gray-500">Appointments Today</h3>
            <p className="text-2xl font-bold text-yellow-600">--</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="text-gray-500">System Status</h3>
            <p className="text-2xl font-bold text-green-600">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
