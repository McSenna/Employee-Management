import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignInModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
      return () => {
        window.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      // Validation
      if (!email) {
        alert("Email is required");
        setIsLoading(false);
        return;
      }
      
      if (!password || password.length < 6) {
        alert("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      const response = await axios.post('http://localhost/employee-management-system/backend/api.php?action=login', 
        {
          email: email,
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      // alert("Login successful");
      console.log("Login response:", response.data);

      if (response.data.error) {
        alert(response.data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      if (response.data.employee) {
        const { employee } = response.data;
        
        if (!employee.id || !employee.role) {
          alert("Invalid user data received");
          console.error("Invalid user data:", employee);
          setIsLoading(false);
          return;
        }
        
        localStorage.setItem("employee_id", employee.id);
        localStorage.setItem("userRole", employee.role);
        localStorage.setItem("username", employee.full_name || employee.first_name || "User");
        localStorage.setItem("isLoggedIn", "true");

        let dashboardRoute = '/user-layout'; 
        switch(employee.role) {
          case "admin":
            dashboardRoute = '/admin-layout';
            break;
          case "hr":
            dashboardRoute = '/hr-layout';
            break;
        }

        if (onClose) onClose();
        
        setTimeout(() => {
          navigate(dashboardRoute);
        }, 100);
      } else {
        alert("Unexpected response from server");
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert (error.response?.data?.message || 
                       error.message || 
                       "Login failed. Please try again.");
      setErrorMessage(alert);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Sign In</h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-white hover:text-blue-200 p-1 rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="flex justify-center border-b bg-blue-50 py-3">
          <div className="flex items-center gap-2 text-blue-600">
            <User size={20} />
            <span className="font-medium">Account Login</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          
          {/* Display error message if exists */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {errorMessage}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.getElementById('password').focus();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button className="text-blue-600 hover:text-blue-500">
                Forgot password?
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default SignInModal;