import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserName(name || "User");
    }
    
    // Add click outside listener to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRegisterDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    
    setIsAuthenticated(false);
    setUserRole(null);
    
    // Redirect to home page
    navigate("/");
  };
  
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10">
        {/* Blue top bar */}
        {/* <div className="h-8 bg-blue-500"></div> */}
        
        {/* White navbar section */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-2 py-2 mt-0 flex justify-between items-center">

            {/* Logo in search-like container */}
            <div className="border border-gray-300 rounded flex items-center px-2 py-1 w-64">
              <span className="text-orange-400 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </span>
              <span className="text-black font-bold">Health Booking</span>
            </div>
            
            {/* Right side content */}
            <div className="flex items-center space-x-3">
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/login" 
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-orange-400 text-white px-4 py-1 rounded hover:bg-orange-500 transition-colors duration-300 font-medium"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Main navigation links for authenticated users */}
                  <div className="hidden md:flex space-x-4">
                    <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
                    
                    {userRole === "ROLE_PATIENT" && (
                      <>
                        <Link to="/patient" className="text-gray-700 hover:text-primary">Dashboard</Link>
                        <Link to="/appointment" className="text-gray-700 hover:text-primary">Appointments</Link>
                      </>
                    )}
                    
                    {userRole === "ROLE_DOCTOR" && (
                      <Link to="/doctor" className="text-gray-700 hover:text-primary">Dashboard</Link>
                    )}
                    
                    {userRole === "ROLE_ADMIN" && (
                      <>
                        <Link to="/admin" className="text-gray-700 hover:text-primary">Dashboard</Link>
                        <Link to="/manage-doctors" className="text-gray-700 hover:text-primary">Doctors</Link>
                        <Link to="/manage-patients" className="text-gray-700 hover:text-primary">Patients</Link>
                      </>
                    )}
                    
                    <Link to="/profile" className="text-gray-700 hover:text-primary">Profile</Link>
                  </div>
                  
                  <span className="text-gray-700">Hi, {userName}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-orange-400 text-white px-3 py-1 rounded hover:bg-orange-500 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Add empty space to prevent content from hiding behind navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
