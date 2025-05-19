import { useState, useRef } from 'react';
import { Calendar, Upload, Trash2, Eye, EyeOff, Plus, X, Mail } from 'lucide-react';
import axios from 'axios';

const HrAddEmployee = ({ onCancel, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(initialData || {
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department: '',
    job_title: '',
    role: 'employee',
    hire_date: '',
    age: ''
  });
  
  const [files, setFiles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
  
  const departments = ['Administration', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales', 'HR'];
  const roles = ['hr', 'employee'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!formData.email || !formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      if (!formData.password || formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const employeeData = { ...formData };
      if (!employeeData.employee_id) {
        const deptPrefix = employeeData.department.substring(0, 3).toUpperCase();
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        employeeData.employee_id = `${deptPrefix}${randomNum}`;
      }

      const formDataToSubmit = new FormData();
      Object.keys(employeeData).forEach(key => {
        formDataToSubmit.append(key, employeeData[key]);
      });
      
      files.forEach((file, index) => {
        formDataToSubmit.append(`file_${index}`, file);
        formDataToSubmit.append(`file_type_${index}`, 'other');
        formDataToSubmit.append(`file_description_${index}`, file.name);
      });

      // Changed from PUT to POST request
      const response = await axios.post('http://localhost/employee-management-system/backend/api.php?action=add', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setMessage({ type: 'success', text: 'Employee added successfully!' });
        
        if (onSubmit) onSubmit(employeeData, files);
        
        setTimeout(() => {
          setFormData({
            employee_id: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            department: '',
            job_title: '',
            role: 'employee',
            hire_date: '',
            age: ''
          });
          setFiles([]);
          setMessage({ type: '', text: '' });
        }, 1500);
      }
      
    } catch (error) {
      if (error.response) {
        alert({ type: 'error', text: `Error: ${error.response.data.message || error.response.statusText}` });
      } else if (error.request) {
        alert({ type: 'error', text: 'Error: No response from server.' });
      } else {
        alert({ type: 'error', text: `Error: ${error.message}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4 max-w-2xl mx-auto border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Add Employee</h2>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee ID */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Employee ID</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Auto-generate if empty"
            />
          </div>
          
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Email *</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-1.5 pl-9 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="employee@company.com"
              />
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
          
          {/* First Name */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">First Name *</label>
            <input
              type="text"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Last Name */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Last Name *</label>
            <input
              type="text"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Age */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Age *</label>
            <input
              type="number"
              name="age"
              required
              min="18"
              max="100"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-1.5 pr-9 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          {/* Hire Date */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Hire Date *</label>
            <div className="relative">
              <input
                type="date"
                name="hire_date"
                required
                value={formData.hire_date}
                onChange={handleChange}
                className="w-full px-3 py-1.5 pl-9 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <Calendar className="absolute left-3 top-2 text-gray-400" size={16} />
            </div>
          </div>
          
          {/* Job Title */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Job Title *</label>
            <input
              type="text"
              name="job_title"
              required
              value={formData.job_title}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Role */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Role *</label>
            <select
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
              ))}
            </select>
          </div>
          
          {/* Department */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Department *</label>
            <select
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* File Upload */}
        {/* <div className="mt-4"> */}
          {/* <label className="text-xs font-medium text-gray-600">Documents</label>
          <div className="border border-dashed border-gray-300 p-4 rounded-md text-center mt-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            
            <div className="space-y-1">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <button
                type="button"
                onClick={triggerFileInput}
                className="text-xs text-blue-600 hover:text-blue-500 font-medium"
              >
                Click to upload
              </button>
              <p className="text-xs text-gray-500">
                PDF, DOC, PNG, JPG up to 10MB
              </p>
            </div>
          </div> */}
          
          {/* {files.length > 0 && (
            <div className="mt-2">
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs">
                    <div className="truncate flex-1">
                      {file.name}
                      <span className="text-gray-400 ml-2">({(file.size / 1024).toFixed(1)}KB)</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-400 hover:text-red-600 ml-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        {/* </div> */}
        
        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-700 bg-gray-100 py-1.5 px-4 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="text-sm bg-blue-600 text-white py-1.5 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-blue-400 flex items-center gap-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Processing</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Add Employee</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HrAddEmployee;