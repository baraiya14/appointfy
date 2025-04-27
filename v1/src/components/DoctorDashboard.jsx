import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAppointments();
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8084/api/doctor/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsAvailable(response.data.available);
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8084/api/appointments/doctor', {
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

  const handleAvailabilityToggle = async () => {
    try {
      await axios.put('http://localhost:8084/api/doctor/availability', 
        { available: !isAvailable },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setIsAvailable(!isAvailable);
    } catch (err) {
      console.error('Error updating availability:', err);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.put(`http://localhost:8084/api/appointments/${appointmentId}/status`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status } 
          : appointment
      ));
      
      if (selectedAppointment && selectedAppointment.id === appointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status });
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
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

  const filteredAppointments = filterStatus === 'all' 
    ? appointments 
    : appointments.filter(appointment => appointment.status === filterStatus);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Availability Status</h2>
            <p className="text-gray-600">
              You are currently <span className={isAvailable ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {isAvailable ? "available" : "unavailable"}
              </span> for appointments
            </p>
          </div>
          <button
            onClick={handleAvailabilityToggle}
            className={`px-4 py-2 rounded-md font-medium ${
              isAvailable 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isAvailable ? "Set as Unavailable" : "Set as Available"}
          </button>
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
                  <th className="px-4 py-2 border">Patient</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-2 border">{formatDate(appointment.appointmentDate)}</td>
                    <td className="px-4 py-2 border">{appointment.appointmentTime}</td>
                    <td className="px-4 py-2 border">{appointment.patient?.patientName || 'Unknown'}</td>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded">No appointments found</div>
        )}
      </div>
      
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">Appointment Details</h3>
            
            <div className="mb-4">
              <p><strong>Patient:</strong> {selectedAppointment.patient?.patientName}</p>
              <p><strong>Date:</strong> {formatDate(selectedAppointment.appointmentDate)}</p>
              <p><strong>Time:</strong> {selectedAppointment.appointmentTime}</p>
              <p><strong>Status:</strong> {selectedAppointment.status}</p>
              <p><strong>Reason for Visit:</strong> {selectedAppointment.reasonForVisit || 'Not specified'}</p>
            </div>
            
            {selectedAppointment.status === 'SCHEDULED' && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Update Status</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'COMPLETED')}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'NO_SHOW')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    No Show
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'CANCELLED')}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
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

export default DoctorDashboard;
