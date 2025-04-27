import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientProfile, setPatientProfile] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAppointments();
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8084/api/patient/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPatientProfile(response.data);
    } catch (err) {
      console.error('Error fetching patient profile:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8084/api/appointments/patient', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch appointments');
      setLoading(false);
      console.error(err);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:8084/api/appointments/${appointmentId}/status`, 
        { status: 'CANCELLED' },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'CANCELLED' } 
          : appointment
      ));
      
      if (selectedAppointment && selectedAppointment.id === appointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status: 'CANCELLED' });
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
  };

  const canCancel = (appointment) => {
    if (appointment.status !== 'SCHEDULED') return false;
    
    // Check if appointment is at least 24 hours in the future
    const appointmentDate = new Date(appointment.appointmentDate);
    const now = new Date();
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return hoursDiff >= 24;
  };

  const filteredAppointments = filterStatus === 'all' 
    ? appointments 
    : appointments.filter(appointment => appointment.status === filterStatus);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
      
      {patientProfile && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome, {patientProfile.patientName}!</h2>
          <p className="text-gray-600">
            Here you can manage your appointments and medical information.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow hover:shadow-md transition duration-300">
          <h3 className="font-bold text-lg text-blue-800 mb-2">Book Appointment</h3>
          <p className="text-gray-700 mb-4">Schedule a new appointment with one of our healthcare professionals.</p>
          <Link to="/appointment" className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Book Now
          </Link>
        </div>
        
        <div className="bg-green-100 p-4 rounded-lg shadow hover:shadow-md transition duration-300">
          <h3 className="font-bold text-lg text-green-800 mb-2">Medical Records</h3>
          <p className="text-gray-700 mb-4">Access your medical history, test results, and prescriptions.</p>
          <Link to="/reports" className="block text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            View Records
          </Link>
        </div>
        
        <div className="bg-purple-100 p-4 rounded-lg shadow hover:shadow-md transition duration-300">
          <h3 className="font-bold text-lg text-purple-800 mb-2">Profile Settings</h3>
          <p className="text-gray-700 mb-4">Update your personal information and communication preferences.</p>
          <Link to="/profile" className="block text-center bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
            Edit Profile
          </Link>
        </div>
      </div>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">My Appointments</h2>
        
        <div className="mb-4">
          <label className="text-gray-700 mr-2">Filter by status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Appointments</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
        
        {loading ? (
          <div className="text-center py-4">Loading appointments...</div>
        ) : filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Time</th>
                  <th className="px-4 py-2 border">Doctor</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-2 border">{formatDate(appointment.appointmentDate)}</td>
                    <td className="px-4 py-2 border">{appointment.appointmentTime}</td>
                    <td className="px-4 py-2 border">{appointment.doctor?.fullName || 'Unknown'}</td>
                    <td className="px-4 py-2 border">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm"
                      >
                        View
                      </button>
                      {canCancel(appointment) && (
                        <button
                          onClick={() => cancelAppointment(appointment.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded">
            <p>No appointments found</p>
            <Link to="/appointment" className="text-blue-500 hover:underline mt-2 inline-block">
              Book your first appointment
            </Link>
          </div>
        )}
      </div>
      
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">Appointment Details</h3>
            
            <div className="mb-4">
              <p><strong>Doctor:</strong> {selectedAppointment.doctor?.fullName || 'Unknown'}</p>
              <p><strong>Specialization:</strong> {selectedAppointment.doctor?.specialization || 'Not specified'}</p>
              <p><strong>Date:</strong> {formatDate(selectedAppointment.appointmentDate)}</p>
              <p><strong>Time:</strong> {selectedAppointment.appointmentTime}</p>
              <p><strong>Status:</strong> {selectedAppointment.status}</p>
              <p><strong>Reason for Visit:</strong> {selectedAppointment.reasonForVisit || 'Not specified'}</p>
            </div>
            
            <div className="flex justify-end">
              {canCancel(selectedAppointment) && (
                <button
                  onClick={() => {
                    cancelAppointment(selectedAppointment.id);
                    closeModal();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel Appointment
                </button>
              )}
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
