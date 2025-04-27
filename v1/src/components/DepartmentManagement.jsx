import { useState } from "react";

const DepartmentManagement = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [departments, setDepartments] = useState([
    { id: 1, name: "Cardiology", phone: "1234567890" },
    { id: 2, name: "Pediatrics", phone: "2345678901" },
    { id: 3, name: "Orthopedics", phone: "3456789012" }
  ]);

  const handleAddDepartment = () => {
    if (departmentName && phoneNumber) {
      const newDepartment = {
        id: departments.length + 1,
        name: departmentName,
        phone: phoneNumber
      };
      setDepartments([...departments, newDepartment]);
      setDepartmentName("");
      setPhoneNumber("");
    }
  };

  const handleDelete = (id) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-2/3 mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Department</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Department Name"
          className="border p-2 w-full mb-2"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="border p-2 w-full mb-2"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button
          onClick={handleAddDepartment}
          className="bg-blue-600 text-white px-4 py-2 w-full rounded"
        >
          Add Department
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4">Department Details</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Department ID</th>
            <th className="border p-2">Department Name</th>
            <th className="border p-2">Phone Number</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id} className="border">
              <td className="border p-2 text-center">{dept.id}</td>
              <td className="border p-2 text-center">{dept.name}</td>
              <td className="border p-2 text-center">{dept.phone}</td>
              <td className="border p-2 text-center">
                <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(dept.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentManagement;
