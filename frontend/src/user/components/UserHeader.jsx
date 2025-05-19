import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, LayoutDashboard, User, Bell, Files } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const UserHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        initial: 'U',
        profilePicture: null,
        department: '',
        jobTitle: ''
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Try to get user info from localStorage first
        const userId = localStorage.getItem('employee_id');
        
        if (userId) {
            fetchUserData(userId);
        } else {
            setLoading(false);
        }
    }, []);
    
    const fetchUserData = async (userId) => {
        try {
            const response = await axios.get(
                `http://localhost/employee-management-system/backend/api.php?action=get_profile&user_id=${userId}`
            );
            
            if (!response.data.error && response.data.user) {
                const user = response.data.user;
                
                setUserData({
                    firstName: user.first_name,
                    lastName: user.last_name,
                    initial: user.first_name.charAt(0).toUpperCase(),
                    profilePicture: user.profile_picture,
                    department: user.department,
                    jobTitle: user.job_title
                });
                
                // Store in localStorage for future use
                localStorage.setItem('username', `${user.first_name} ${user.last_name}`);
                localStorage.setItem('userDepartment', user.department);
                localStorage.setItem('userJobTitle', user.job_title);
                localStorage.setItem('userProfilePic', user.profile_picture || '');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isActive = (path) => location.pathname.includes(path);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            // Clear user data from localStorage
            localStorage.removeItem('employee_id');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userDepartment');
            localStorage.removeItem('userJobTitle');
            localStorage.removeItem('userProfilePic');
            
            navigate('/');
        }
    };

    // Function to check if the profile picture URL is valid
    const isValidUrl = (url) => {
        if (!url) return false;
        // Check if it's a valid URL format (very basic check)
        return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
    };

    return (
        <nav className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Briefcase size={24} className="text-indigo-400" />
                    <span className="font-bold text-xl tracking-tight">Carlo's Employee Portal</span>
                </div>

                <div className="flex items-center space-x-8">
                    {/* Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            to="/user-layout/user-files"
                            className={`flex items-center space-x-2 hover:text-indigo-300 transition-colors ${isActive('user-files') ? 'text-indigo-300 border-b-2 border-indigo-300 pb-1' : ''}`}
                        >
                            <Files size={20} />
                            <span className="font-medium">My Files</span>
                        </Link>
                        <Link
                            to="/user-layout/user-dashboard"
                            className={`flex items-center space-x-2 hover:text-indigo-300 transition-colors ${isActive('user-dashboard') ? 'text-indigo-300 border-b-2 border-indigo-300 pb-1' : ''}`}
                        >
                            <LayoutDashboard size={20} />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Dropdown Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                {isValidUrl(userData.profilePicture) ? (
                                    <div className="w-10 h-10 rounded-full border-2 border-indigo-400 overflow-hidden">
                                        <img 
                                            src={userData.profilePicture} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = `
                                                    <div class="w-full h-full bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                                                        ${userData.initial}
                                                    </div>
                                                `;
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                                        {userData.initial}
                                    </div>
                                )}
                                <div className="hidden md:block">
                                    <span className="font-medium text-sm block">
                                        {userData.firstName || 'User'}
                                    </span>
                                    <span className="text-xs text-indigo-300">
                                        {userData.jobTitle || 'Employee'}
                                    </span>
                                </div>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm text-gray-900 font-medium">{userData.firstName} {userData.lastName}</p>
                                        <p className="text-xs text-gray-600">{userData.department}</p>
                                    </div>
                                    
                                    {/* Options */}
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            navigate('/user-layout/user-profile');
                                        }}
                                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                                    >
                                        <User size={16} className="mr-2 text-blue-600" />
                                        <span>View Profile</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                                    >
                                        <LogOut size={16} className="mr-2 text-blue-600" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UserHeader;