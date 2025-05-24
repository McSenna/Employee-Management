import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import AdminAddEmployee from './AdminAddEmployee';

const AdminEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const departments = ['HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    let results = employees;
    
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(employee => {
        const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
        return (
          fullName.includes(lowercasedSearch) ||
          (employee.job_title && employee.job_title.toLowerCase().includes(lowercasedSearch)) ||
          (employee.department && employee.department.toLowerCase().includes(lowercasedSearch))
        );
      });
    }
    
    if (filterDepartment) {
      results = results.filter(employee => 
        employee.department === filterDepartment
      );
    }
    
    setFilteredEmployees(results);
  }, [searchTerm, filterDepartment, employees]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost/employee-management-system/backend/api.php?action=fetch', {
        timeout: 5000
      });
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Failed to fetch employees. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setCurrentEmployee(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    const formattedEmployee = {
      id: employee.id,
      employee_id: employee.employee_id || '',
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      email: employee.email || '',
      password: '',
      department: employee.department || '',
      job_title: employee.job_title || '',
      role: employee.role || 'employee',
      hire_date: employee.hire_date || '',
      age: employee.age || ''
    };
    
    setCurrentEmployee(formattedEmployee);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const storeLogs = async (action, details) => {
    try {
      const currentAdminId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id') || 'unknown';
      await axios.post('http://localhost/employee-management-system/backend/api.php?action=store_logs', {
        action,
        user_id: currentAdminId,
        details: JSON.stringify(details),
        timestamp: new Date().toISOString()
      }, { timeout: 5000 });
    } catch (error) {
      console.error('Error storing log:', error);
    }
  };

  const handleEmployeeSubmit = async (formData, files) => {
    setIsLoading(true);
    try {
      let response;
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSubmit.append(key, formData[key]);
      });
      
      files.forEach((file, index) => {
        formDataToSubmit.append(`file_${index}`, file);
        formDataToSubmit.append(`file_type_${index}`, 'other');
        formDataToSubmit.append(`file_description_${index}`, file.name);
      });

      if (editMode && currentEmployee) {
        formDataToSubmit.append('id', currentEmployee.id);
        response = await axios.post(
          'http://localhost/employee-management-system/backend/api.php?action=update',
          formDataToSubmit,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 5000
          }
        );
        
        if (response.data && response.data.error) {
          throw new Error(response.data.message || 'Failed to update employee');
        }
        
        await storeLogs('Update Employee', {
          employee_id: currentEmployee.id,
          employee_name: `${formData.first_name} ${formData.last_name}`,
          updated_fields: Object.keys(formData),
          admin_id: localStorage.getItem('user_id') || sessionStorage.getItem('user_id')
        });
        
        alert('Employee updated successfully!');
      } 
    } catch (error) {
      console.error('Error saving employee:', error);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        alert('Error: No response from server. Please try again.');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('id', id);

        const response = await axios.post(
          'http://localhost/employee-management-system/backend/api.php?action=delete',
          formData,
          { timeout: 5000 }
        );

        if (response.data.error) {
          throw new Error(response.data.message || 'Failed to delete employee');
        }

        const deletedEmployee = employees.find(emp => emp.id === id);
        await storeLogs('Admin Delete A Employee', {
          employee_id: id,
          employee_name: deletedEmployee ? `${deletedEmployee.first_name} ${deletedEmployee.last_name}` : 'unknown',
          admin_id: localStorage.getItem('user_id') || sessionStorage.getItem('user_id')
        });

        alert(response.data.message || 'Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        const message = error.response
          ? `Server error: ${error.response.data.message || 'Unknown error'}`
          : 'Network error: Could not connect to server';
        alert(message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
    setEditMode(false);
  };

  return (
    <div className="p-8 mx-auto mt-1.5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text" 
            placeholder="Search employees..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="w-full md:w-64">
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            disabled={isLoading}
          >
            <option value="">All Departments</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-6 text-center">Loading employees...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{`${employee.first_name} ${employee.last_name}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.job_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        disabled={isLoading}
                        title="Edit employee"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isLoading}
                        title="Delete employee"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No employees found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <AdminAddEmployee 
              onCancel={handleCloseModal}
              onSubmit={handleEmployeeSubmit}
              initialData={currentEmployee}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployee;