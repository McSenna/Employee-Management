import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, UserCog, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignInModal = ({ isOpen, onClose }) => {
  const [isAdmin, setIsAdmin] = useState(false);
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

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    try {
      if (isAdmin) {
        if (email === adminEmail && password === adminPassword) {
          setSuccessMessage(alert('admin successfully logged in!!'));
          navigate('/admin-layout')
          
          setTimeout(() => {
            if (onClose) onClose();
          }, 1500);
        } else {
          setErrorMessage("Invalid admin credentials!");
        }
      } else {
        if (!email || password.length < 6) {
          setErrorMessage(alert("Invalid email or password (must be at least 6 characters)"));
          setIsLoading(false);
          return;
        }

        try {
          const response = await axios.get('api.php?action=login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            data: JSON.stringify({
              email: email,
              password: password
            })
          });
  
          if (response.data.error) {
            setErrorMessage(response.data.message);
          } else {
            setSuccessMessage(alert("User login successful!"));
            navigate('/user-layout')
            setTimeout(() => {
              if (onClose) onClose();
            }, 1500);
          }
        } catch (error) {
          setErrorMessage(`Login failed: ${error.message}`);
        }
      }
    } catch (error) {
      setErrorMessage(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserType = () => {
    setIsAdmin(!isAdmin);
    setEmail("");
    setPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className=" bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
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

        <div className="flex border-b">
          <button
            onClick={() => toggleUserType()}
            className={`flex-1 py-3 flex items-center justify-center gap-2 ${
              !isAdmin ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600'
            }`}
          >
            <User size={18} />
            <span>User</span>
          </button>
          <button
            onClick={() => toggleUserType()}
            className={`flex-1 py-3 flex items-center justify-center gap-2 ${
              isAdmin ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600'
            }`}
          >
            <UserCog size={18} />
            <span>Admin</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="text-red-600 bg-red-50 p-3 rounded text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="text-green-600 bg-green-50 p-3 rounded text-sm">
              {successMessage}
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

          {/* {!isAdmin && (
            <div className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <button className="text-blue-600 hover:text-blue-500">
                Sign up
              </button>
            </div>
          )} */}
          
        </div>
      </div>
    </div>
  );
}

export default SignInModal;