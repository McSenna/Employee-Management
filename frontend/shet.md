import { useState, useRef, useEffect } from 'react';
import { Calendar, Upload, Trash2, Eye, EyeOff, Plus, X, Mail, CheckCircle, AlertCircle, UserCircle } from 'lucide-react';
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
    age: ''
  });
  
  const [files, setFiles] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  const fileInputRef = useRef(null);
  const profileInputRef = useRef(null);
  
  const departments = ['Administration', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales', 'HR'];
  const roles = ['hr', 'employee'];

  // Set default hire date to today when component mounts
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

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePreview(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const triggerProfileInput = () => {
    profileInputRef.current.click();
  };

  // Show alert function
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    
    // Auto hide alert after 5 seconds
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const storeLogs = async (action, details = null) => {
      try {
          const currentAdminId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id') || null;
          
          await axios.post('http://localhost/employee-management-system/backend/api.php?action=store_logs', {
              action,
              user_id: currentAdminId,
              details
          });
      } 
      catch(error) {
          console.error('Error storing logs', error);
      }
  }

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
    
    // Make sure we're adding all fields from our form data
    Object.entries(employeeData).forEach(([key, value]) => {
      if (key !== 'user_id' && value !== null && value !== undefined) {
        formDataToSubmit.append(key, value.toString()); // Ensure all values are strings
      }
    });
    
    // Add profile picture if selected
    if (profilePicture) {
      formDataToSubmit.append('profile_picture', profilePicture);
    }
    
    // Add files to the FormData with proper naming
    files.forEach((file, index) => {
      formDataToSubmit.append(`file_${index}`, file);
      formDataToSubmit.append(`file_type_${index}`, 'other');
      formDataToSubmit.append(`file_description_${index}`, file.name);
    });

    // Make the API request with the correct content type
    const apiUrl = 'http://localhost/employee-management-system/backend/api.php?action=add';
    
    console.log('Sending data to:', apiUrl);
    
    const response = await axios.post(apiUrl, formDataToSubmit, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Server response:', response.data);

    if (response.data && response.data.error) {
      throw new Error(response.data.message || 'Failed to add employee');
    }

    // Show success alert
    const roleText = employeeData.role === 'admin' ? 'Admin' : 'User';
    showAlert('success', `${roleText} added successfully!`);
    
    const newEmployeeDetails = {
      name: `${formData.first_name} ${formData.last_name}`,
      employee_id: employeeData.employee_id,
      role: formData.role,
      department: formData.department,
      email: formData.email
    };
    await storeLogs(
      `Admin Created a New ${roleText}`, 
      JSON.stringify(newEmployeeDetails)
    );
    
    if (onSubmit) onSubmit(employeeData, files);
    
    // Reset form after successful submission
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
      setProfilePicture(null);
      setProfilePreview(null);
    }, 1500);
    
  } catch (error) {
    console.error('Error in form submission:', error);
    
    await storeLogs(
      `Admin Failed to Create a New User`, 
      JSON.stringify({
        attempted_user: `${formData.first_name} ${formData.last_name}`,
        attempted_email: formData.email,
        error: error.message
      })
    );
    
    if (error.response && error.response.data) {
      showAlert('error', `Error: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      showAlert('error', 'Error: No response from server. Please try again.');
    } else {
      showAlert('error', `Error: ${error.message}`);
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="bg-white rounded-md shadow-sm p-4 max-w-2xl mx-auto border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {formData.role === 'admin' ? 'Add Admin User' : 'Add Employee'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Alert notification */}
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
        {/* Profile Picture Upload */}
        <div className="flex justify-center mb-2">
          <div className="relative">
            <input
              type="file"
              ref={profileInputRef}
              onChange={handleProfilePictureChange}
              accept="image/*"
              className="hidden"
            />
            
            {profilePreview ? (
              <div className="relative group">
                <img 
                  src={profilePreview} 
                  alt="Profile Preview" 
                  className="h-20 w-20 rounded-full object-cover border border-gray-200" 
                />
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemoveProfilePicture}
                >
                  <Trash2 className="text-white" size={20} />
                </div>
              </div>
            ) : (
              <div 
                className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
                onClick={triggerProfileInput}
              >
                <UserCircle size={40} className="text-gray-400" />
              </div>
            )}
            
            <button
              type="button"
              onClick={triggerProfileInput}
              className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 -mt-2 mb-2">
          Click to upload profile picture
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className={`text-sm ${formData.role === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-1.5 px-4 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-70 flex items-center gap-1`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Processing</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>{formData.role === 'admin' ? 'Add Admin' : 'Add Employee'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddEmployee;


<?php
require_once 'file_operations.php'; 

function register() {
    global $connect;
    $res = ['error' => false];
    
    try {
        // Get JSON data from request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            $res = ['error' => true, 'message' => 'Invalid request format'];
            echo json_encode($res);
            return;
        }
        
        // Extract and sanitize input data
        $username = isset($data['username']) ? trim($data['username']) : '';
        $email = isset($data['email']) ? trim(strtolower($data['email'])) : '';
        $password = isset($data['password']) ? $data['password'] : '';
        $age = isset($data['age']) ? (int)$data['age'] : 0;
        $firstName = isset($data['first_name']) ? trim($data['first_name']) : '';
        $lastName = isset($data['last_name']) ? trim($data['last_name']) : '';
        $department = isset($data['department']) ? trim($data['department']) : '';
        $jobTitle = isset($data['job_title']) ? trim($data['job_title']) : '';
        $hireDate = isset($data['hire_date']) ? trim($data['hire_date']) : date('Y-m-d');
        $employeeId = isset($data['employee_id']) ? trim($data['employee_id']) : '';
        $role = isset($data['role']) && in_array($data['role'], ['employee', 'hr', 'admin']) ? trim($data['role']) : 'employee';
        
        // Validate required fields
        if (empty($email) || empty($password)) {
            $res = ['error' => true, 'message' => 'Email and password are required'];
            echo json_encode($res);
            return;
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $res = ['error' => true, 'message' => 'Invalid email format'];
            echo json_encode($res);
            return;
        }
        
        // Validate password strength (minimum 8 characters)
        if (strlen($password) < 8) {
            $res = ['error' => true, 'message' => 'Password must be at least 8 characters long'];
            echo json_encode($res);
            return;
        }
        
        // Validate age if provided
        if ($age && ($age < 18 || $age > 100)) {
            $res = ['error' => true, 'message' => 'Age must be between 18 and 100'];
            echo json_encode($res);
            return;
        }
        
        // Validate hire date format
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $hireDate) || !strtotime($hireDate)) {
            $res = ['error' => true, 'message' => 'Invalid hire date format (YYYY-MM-DD)'];
            echo json_encode($res);
            return;
        }
        
        // Check if email already exists
        $checkSql = "SELECT id FROM employees WHERE LOWER(email) = ?";
        $checkStmt = $connect->prepare($checkSql);
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $res = ['error' => true, 'message' => 'Email already registered'];
            echo json_encode($res);
            $checkStmt->close();
            return;
        }
        $checkStmt->close();
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Generate employee ID if not provided
        if (empty($employeeId) && !empty($department)) {
            $deptPrefix = strtoupper(substr($department, 0, 3));
            $randomNum = mt_rand(10000, 99999);
            $employeeId = $deptPrefix . $randomNum;
        }
        
        // Insert new employee
        $sql = "INSERT INTO employees (employee_id, first_name, last_name, email, password, department, job_title, role, hire_date, age) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("sssssssssi", $employeeId, $firstName, $lastName, $email, $hashedPassword, $department, $jobTitle, $role, $hireDate, $age);
        
        if ($stmt->execute()) {
            $userId = $connect->insert_id;
            
            // Log the registration activity
            $action = 'register';
            $details = 'New employee registration';
            $ipAddress = $_SERVER['REMOTE_ADDR'];
            
            $logSql = "INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)";
            $logStmt = $connect->prepare($logSql);
            $logStmt->bind_param("isss", $userId, $action, $details, $ipAddress);
            $logStmt->execute();
            $logStmt->close();
            
            $res['user_id'] = $userId;
            $res['employee_id'] = $employeeId;
            $res['message'] = 'Registration successful';
        } else {
            $res = ['error' => true, 'message' => 'Registration failed: ' . $stmt->error];
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        $res = ['error' => true, 'message' => 'Exception: ' . $e->getMessage()];
    }
    
    echo json_encode($res);
    return;
}

function addEmployee() {
    global $connect;
    $res = ['error' => false];
    
    try {
        // Check for POST data first (FormData from axios)
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = isset($_POST['email']) ? trim(strtolower($_POST['email'])) : '';
            $password = isset($_POST['password']) ? $_POST['password'] : '';
            $age = isset($_POST['age']) ? (int)$_POST['age'] : 0;
            $firstName = isset($_POST['first_name']) ? trim($_POST['first_name']) : '';
            $lastName = isset($_POST['last_name']) ? trim($_POST['last_name']) : '';
            $department = isset($_POST['department']) ? trim($_POST['department']) : '';
            $jobTitle = isset($_POST['job_title']) ? trim($_POST['job_title']) : '';
            $hireDate = isset($_POST['hire_date']) ? trim($_POST['hire_date']) : date('Y-m-d');
            $employeeId = isset($_POST['employee_id']) ? trim($_POST['employee_id']) : '';
            $role = isset($_POST['role']) && in_array($_POST['role'], ['employee', 'hr', 'admin']) ? trim($_POST['role']) : 'employee';
        } else {
            $res = ['error' => true, 'message' => 'Invalid request method. Use POST.'];
            echo json_encode($res);
            return;
        }
        
        // Validate required fields
        if (empty($email) || empty($password) || empty($firstName) || empty($lastName) || empty($department) || empty($jobTitle)) {
            $res = ['error' => true, 'message' => 'Email, password, first name, last name, department, and job title are required'];
            echo json_encode($res);
            return;
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $res = ['error' => true, 'message' => 'Invalid email format'];
            echo json_encode($res);
            return;
        }
        
        // Validate password strength
        if (strlen($password) < 8) {
            $res = ['error' => true, 'message' => 'Password must be at least 8 characters long'];
            echo json_encode($res);
            return;
        }
        
        // Validate age if provided
        if ($age && ($age < 18 || $age > 100)) {
            $res = ['error' => true, 'message' => 'Age must be between 18 and 100'];
            echo json_encode($res);
            return;
        }
        
        // Validate hire date format
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $hireDate) || !strtotime($hireDate)) {
            $res = ['error' => true, 'message' => 'Invalid hire date format (YYYY-MM-DD)'];
            echo json_encode($res);
            return;
        }
        
        // Check if email already exists
        $checkSql = "SELECT id FROM employees WHERE LOWER(email) = ?";
        $checkStmt = $connect->prepare($checkSql);
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $res = ['error' => true, 'message' => 'Email already registered: ' . $email];
            echo json_encode($res);
            $checkStmt->close();
            return;
        }
        $checkStmt->close();
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Generate employee ID if not provided
        if (empty($employeeId) && !empty($department)) {
            $deptPrefix = strtoupper(substr($department, 0, 3));
            $randomNum = mt_rand(10000, 99999);
            $employeeId = $deptPrefix . $randomNum;
        }
        
        // Insert new employee
        $sql = "INSERT INTO employees (employee_id, first_name, last_name, email, password, department, job_title, role, hire_date, age) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("sssssssssi", $employeeId, $firstName, $lastName, $email, $hashedPassword, $department, $jobTitle, $role, $hireDate, $age);
        
        if ($stmt->execute()) {
            $userId = $connect->insert_id;
            
            // Handle profile picture upload
            if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
                $_POST['employee_id'] = $userId;
                $_POST['file_type'] = 'profile_picture';
                $_POST['description'] = 'Profile Picture';
                $_FILES['file'] = $_FILES['profile_picture'];
                
                ob_start();
                uploadFile();
                $uploadResult = json_decode(ob_get_clean(), true);
                
                if (isset($uploadResult['error']) && $uploadResult['error']) {
                    error_log("Profile picture upload failed: " . $uploadResult['message']);
                }
            }
            
            // Handle regular file uploads
            $fileCount = 0;
            while (isset($_FILES["file_{$fileCount}"])) {
                $_POST['employee_id'] = $userId;
                $_POST['file_type'] = isset($_POST["file_type_{$fileCount}"]) ? $_POST["file_type_{$fileCount}"] : 'other';
                $_POST['description'] = isset($_POST["file_description_{$fileCount}"]) ? $_POST["file_description_{$fileCount}"] : '';
                
                $_FILES['file'] = $_FILES["file_{$fileCount}"];
                
                // Validate file type and size
                $allowedTypes = ['application/pdf', 'application/msword', 'image/png', 'image/jpeg'];
                $maxSize = 10 * 1024 * 1024; // 10MB
                if (!in_array($_FILES['file']['type'], $allowedTypes) || $_FILES['file']['size'] > $maxSize) {
                    $res = ['error' => true, 'message' => "Invalid file type or size for file_{$fileCount}"];
                    echo json_encode($res);
                    return;
                }
                
                ob_start();
                uploadFile();
                $uploadResult = json_decode(ob_get_clean(), true);
                
                if (isset($uploadResult['error']) && $uploadResult['error']) {
                    error_log("File upload failed for file_{$fileCount}: " . $uploadResult['message']);
                }
                
                $fileCount++;
            }
            
            // Log the activity
            $action = 'Add Employee';
            $details = 'New employee added: ' . $firstName . ' ' . $lastName;
            $ipAddress = $_SERVER['REMOTE_ADDR'];
            
            $logSql = "INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)";
            $logStmt = $connect->prepare($logSql);
            $logStmt->bind_param("isss", $userId, $action, $details, $ipAddress);
            $logStmt->execute();
            $logStmt->close();
            
            $res['user_id'] = $userId;
            $res['employee_id'] = $employeeId;
            $res['message'] = 'Employee added successfully';
        } else {
            $res = ['error' => true, 'message' => 'Failed to add employee: ' . $stmt->error];
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        $res = ['error' => true, 'message' => 'Exception: ' . $e->getMessage()];
        error_log("Error in addEmployee: " . $e->getMessage());
    }
    
    echo json_encode($res);
    return;
}