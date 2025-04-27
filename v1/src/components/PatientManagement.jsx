import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewPatient, setViewPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8084/api/patients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patients');
      setLoading(false);
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter(patient => 
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPatient = (patient) => {
    setViewPatient(patient);
  };

  const handleCloseView = () => {
    setViewPatient(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Patient Management</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patients by name or email..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      {loading ? (
        <div className="text-center">Loading patients...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <tr key={patient.id}>
                    <td className="px-4 py-2 border">{patient.id}</td>
                    <td className="px-4 py-2 border">{patient.patientName}</td>
                    <td className="px-4 py-2 border">{patient.email}</td>
                    <td className="px-4 py-2 border">
                      <button 
                        onClick={() => handleViewPatient(patient)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 border text-center">No patients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {viewPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Patient Details</h3>
            <div className="mb-4">
              <p><strong>ID:</strong> {viewPatient.id}</p>
              <p><strong>Name:</strong> {viewPatient.patientName}</p>
              <p><strong>Email:</strong> {viewPatient.email}</p>
              <p><strong>Age:</strong> {viewPatient.age || 'N/A'}</p>
              <p><strong>Gender:</strong> {viewPatient.gender || 'N/A'}</p>
              <p><strong>Phone:</strong> {viewPatient.phone || 'N/A'}</p>
              <p><strong>Address:</strong> {viewPatient.address || 'N/A'}</p>
            </div>
            <h4 className="font-bold mb-2">Appointment History</h4>
            {viewPatient.appointments && viewPatient.appointments.length > 0 ? (
              <div className="overflow-x-auto max-h-40">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 border">Date</th>
                      <th className="px-2 py-1 border">Doctor</th>
                      <th className="px-2 py-1 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewPatient.appointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td className="px-2 py-1 border">{appointment.appointmentDate}</td>
                        <td className="px-2 py-1 border">{appointment.doctor?.fullName || 'N/A'}</td>
                        <td className="px-2 py-1 border">{appointment.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No appointment history</p>
            )}
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleCloseView}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
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

export default PatientManagement;
