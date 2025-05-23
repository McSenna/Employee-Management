import { useState, useRef, useEffect } from 'react';
import { Calendar, Upload, Trash2, Eye, EyeOff, Plus, X, Mail, CheckCircle, AlertCircle, User } from 'lucide-react';
import axios from 'axios';

const AdminAddEmployee = ({ onCancel, onSubmit, initialData = null }) => {
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
    age: '',
    profile_picture: null
  });

  const [files, setFiles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const fileInputRef = useRef(null);
  const profilePicInputRef = useRef(null);

  const departments = ['Administration', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales', 'HR'];
  const roles = ['hr', 'employee'];

  useEffect(() => {
    if (!formData.hire_date) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, hire_date: today }));
    }
  }, []);

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

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, profile_picture: file }));
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveProfilePic = () => {
    setFormData(prev => ({ ...prev, profile_picture: null }));
    if (profilePicInputRef.current) {
      profilePicInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const triggerProfilePicInput = () => {
    profilePicInputRef.current.click();
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const storeLogs = async (action) => {
    try {
      await axios.post('http://localhost/employee-management-system/backend/api.php?action=store_logs', { action });
    } catch (error) {
      console.error('Error storing logs', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
      Object.entries(employeeData).forEach(([key, value]) => {
        if (key !== 'user_id' && key !== 'profile_picture') {
          formDataToSubmit.append(key, value);
        }
      });

      if (formData.profile_picture) {
        formDataToSubmit.append('profile_picture', formData.profile_picture);
      }

      files.forEach((file, index) => {
        formDataToSubmit.append(`file_${index}`, file);
        formDataToSubmit.append(`file_type_${index}`, 'other');
        formDataToSubmit.append(`file_description_${index}`, file.name);
      });

      const apiUrl = 'http://localhost/employee-management-system/backend/api.php?action=add';

      const response = await axios.post(apiUrl, formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
        validateStatus: status => status < 500,
      });

      if (response.status === 409 || (response.data && response.data.message === "Email already registered")) {
        throw new Error("Email already registered");
      }

      if (response.data && response.data.error) {
        throw new Error(response.data.message || 'Failed to add employee');
      }

      showAlert('success', 'Employee added successfully!');
      await storeLogs(`Admin Created a New User`);

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
          age: '',
          profile_picture: null
        });
        setFiles([]);
      }, 1500);

    } catch (error) {
      console.error('Error in form submission:', error);
      await storeLogs(`Admin Failed to Create a New User`);

      const errMsg =
        error.message === "Email already registered"
          ? "This email is already in use. Please use a different one."
          : error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred.";

      showAlert('error', `Error: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4 max-w-2xl mx-auto border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Add Employee</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600" aria-label="Close">
          <X size={20} />
        </button>
      </div>

      {alert.show && (
        <div
          className={`mb-4 p-3 rounded-md flex items-center gap-2 ${
            alert.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            'bg-red-50 text-red-800 border border-red-200'
          }`}
          role="alert"
        >
          {alert.type === 'success' ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <AlertCircle size={16} className="text-red-500" />
          )}
          <span className="text-sm">{alert.message}</span>
          <button
            onClick={() => setAlert({ show: false, type: '', message: '' })}
            className="ml-auto text-gray-500 hover:text-gray-700"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile Picture */}
          <div className="space-y-1 col-span-2">
            <label className="text-xs font-medium text-gray-600">Profile Picture (Optional)</label>
            <div className="border border-dashed border-gray-300 p-4 rounded-md text-center">
              <input
                type="file"
                ref={profilePicInputRef}
                onChange={handleProfilePicChange}
                accept="image/*"
                className="hidden"
              />
              {!formData.profile_picture ? (
                <div className="space-y-1">
                  <User className="mx-auto h-8 w-8 text-gray-400" />
                  <button
                    type="button"
                    onClick={triggerProfilePicInput}
                    className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Upload profile picture
                  </button>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <img
                      src={URL.createObjectURL(formData.profile_picture)}
                      alt="Profile preview"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="text-xs truncate max-w-[200px]">
                      {formData.profile_picture.name}
                      <span className="text-gray-400 ml-2">
                        ({(formData.profile_picture.size / 1024).toFixed(1)}KB)
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveProfilePic}
                    className="text-red-400 hover:text-red-600"
                    aria-label="Remove profile picture"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
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
                aria-label={showPassword ? "Hide password" : "Show password"}
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
        
        {/* File Upload Section */}
        <div className="mt-4">
          <label className="text-xs font-medium text-gray-600">Documents (Optional)</label>
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
          </div>
          
          {files.length > 0 && (
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
                      aria-label={`Remove ${file.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
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

export default AdminAddEmployee;