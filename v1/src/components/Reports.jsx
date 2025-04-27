import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalDepartments: 0,
    totalTransactions: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    pendingAppointments: 0,
    monthlyAppointments: {},
    specializations: {},
    patientsByAge: {
      "0-18": 0,
      "19-35": 0,
      "36-50": 0,
      "51-65": 0,
      "65+": 0
    },
    appointmentsByDay: {
      "Monday": 0,
      "Tuesday": 0,
      "Wednesday": 0,
      "Thursday": 0,
      "Friday": 0,
      "Saturday": 0,
      "Sunday": 0
    }
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      
      try {
        // In a real application, you would make actual API calls to fetch this data
        // Simulating API calls with axios for demonstration
        const [patientsResponse, doctorsResponse, appointmentsResponse, departmentsResponse] = await Promise.all([
          axios.get('http://localhost:8084/api/patients', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:8084/api/doctors', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:8084/api/appointments', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:8084/api/departments', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        
        // Process appointment data to extract stats
        const appointments = appointmentsResponse.data || [];
        const doctors = doctorsResponse.data || [];
        
        // Calculate appointment status counts
        const completed = appointments.filter(app => app.status === 'COMPLETED').length;
        const cancelled = appointments.filter(app => app.status === 'CANCELLED').length;
        const pending = appointments.filter(app => app.status === 'PENDING').length;
        
        // Calculate appointments by month
        const monthlyData = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach(month => monthlyData[month] = 0);
        
        appointments.forEach(app => {
          const date = new Date(app.appointmentDate);
          const month = months[date.getMonth()];
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        });
        
        // Calculate appointments by day of week
        const dayData = {
          "Monday": 0,
          "Tuesday": 0,
          "Wednesday": 0,
          "Thursday": 0,
          "Friday": 0, 
          "Saturday": 0,
          "Sunday": 0
        };
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        appointments.forEach(app => {
          const date = new Date(app.appointmentDate);
          const day = days[date.getDay()];
          dayData[day] = (dayData[day] || 0) + 1;
        });
        
        // Calculate doctor specializations
        const specializationData = {};
        doctors.forEach(doc => {
          const spec = doc.specialization || 'Other';
          specializationData[spec] = (specializationData[spec] || 0) + 1;
        });
        
        // Update report data state
        setReportData({
          totalPatients: patientsResponse.data?.length || 0,
          totalDoctors: doctorsResponse.data?.length || 0,
          totalAppointments: appointments.length,
          totalDepartments: departmentsResponse.data?.length || 0,
          totalTransactions: appointments.length, // Assuming each appointment has a transaction
          completedAppointments: completed,
          cancelledAppointments: cancelled,
          pendingAppointments: pending,
          monthlyAppointments: monthlyData,
          specializations: specializationData,
          patientsByAge: reportData.patientsByAge, // Simulated age data
          appointmentsByDay: dayData
        });
      } catch (error) {
        console.error("Error fetching report data:", error);
        // Fallback to sample data in case of errors
        setReportData({
          ...reportData,
          totalPatients: 120,
          totalDoctors: 15,
          totalAppointments: 450,
          totalDepartments: 8,
          totalTransactions: 430,
          completedAppointments: 320,
          cancelledAppointments: 50,
          pendingAppointments: 80
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, []);

  // Generate chart data
  const appointmentStatusData = {
    labels: ['Completed', 'Cancelled', 'Pending'],
    datasets: [
      {
        label: 'Appointments by Status',
        data: [
          reportData.completedAppointments, 
          reportData.cancelledAppointments, 
          reportData.pendingAppointments
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 205, 86, 0.6)'
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const monthlyAppointmentData = {
    labels: Object.keys(reportData.monthlyAppointments),
    datasets: [
      {
        label: 'Appointments per Month',
        data: Object.values(reportData.monthlyAppointments),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }
    ]
  };
  
  const specializationData = {
    labels: Object.keys(reportData.specializations),
    datasets: [
      {
        label: 'Doctors by Specialization',
        data: Object.values(reportData.specializations),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 255, 0.6)',
          'rgba(54, 162, 64, 0.6)',
          'rgba(255, 206, 153, 0.6)',
          'rgba(75, 192, 255, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const appointmentsByDayData = {
    labels: Object.keys(reportData.appointmentsByDay),
    datasets: [
      {
        label: 'Appointments by Day of Week',
        data: Object.values(reportData.appointmentsByDay),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
        tension: 0.1
      }
    ]
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Hospital Reports & Analytics</h1>
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
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center border-t-4 border-blue-500">
              <h3 className="font-semibold text-gray-500 text-sm">TOTAL PATIENTS</h3>
              <p className="text-3xl font-bold text-blue-700">{reportData.totalPatients}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center border-t-4 border-green-500">
              <h3 className="font-semibold text-gray-500 text-sm">TOTAL DOCTORS</h3>
              <p className="text-3xl font-bold text-green-700">{reportData.totalDoctors}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center border-t-4 border-yellow-500">
              <h3 className="font-semibold text-gray-500 text-sm">APPOINTMENTS</h3>
              <p className="text-3xl font-bold text-yellow-700">{reportData.totalAppointments}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center border-t-4 border-purple-500">
              <h3 className="font-semibold text-gray-500 text-sm">DEPARTMENTS</h3>
              <p className="text-3xl font-bold text-purple-700">{reportData.totalDepartments}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center border-t-4 border-red-500">
              <h3 className="font-semibold text-gray-500 text-sm">TRANSACTIONS</h3>
              <p className="text-3xl font-bold text-red-700">{reportData.totalTransactions}</p>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Appointment Status</h2>
              <div className="h-64">
                <Pie data={appointmentStatusData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Doctor Specializations</h2>
              <div className="h-64">
                <Pie data={specializationData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Monthly Appointments</h2>
              <div className="h-64">
                <Bar 
                  data={monthlyAppointmentData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Appointments Distribution by Month'
                      }
                    }
                  }} 
                />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Appointments by Day</h2>
              <div className="h-64">
                <Bar 
                  data={appointmentsByDayData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Appointments by Day of Week'
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
          
          {/* Report Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Report Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                onClick={() => alert("This would generate a downloadable PDF report in a real application")}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Export PDF Report
              </button>
              
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                onClick={() => alert("This would export data to Excel in a real application")}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export to Excel
              </button>
              
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                onClick={() => alert("This would email reports to stakeholders in a real application")}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Email Report
              </button>
              
              <button 
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
                onClick={() => alert("This would print the current report in a real application")}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                </svg>
                Print Report
              </button>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <img src="https://img.freepik.com/free-vector/business-team-discussing-ideas-startup_74855-4380.jpg" 
                alt="Analytics Team" 
                className="rounded-lg shadow-md max-w-full h-auto" 
                style={{maxHeight: "300px"}} />
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
