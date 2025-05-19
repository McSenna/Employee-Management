import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Briefcase, Calendar, Clock, Award, Building, Phone, MapPin } from 'lucide-react';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Get the user ID from localStorage (set during login)
                const userId = localStorage.getItem('employee_id');
                
                if (!userId) {
                    setError('Not logged in. Please log in to view your profile.');
                    setLoading(false);
                    return;
                }
                
                const response = await axios.get(
                    `http://localhost/employee-management-system/backend/api.php?action=get_profile&user_id=${userId}`
                );
                
                if (response.data.error) {
                    setError(response.data.message || 'Failed to load profile');
                } else {
                    setUserData(response.data.user);
                    
                    // Store updated profile data in localStorage
                    localStorage.setItem('username', `${response.data.user.first_name} ${response.data.user.last_name}`);
                    localStorage.setItem('userDepartment', response.data.user.department);
                    localStorage.setItem('userJobTitle', response.data.user.job_title);
                    localStorage.setItem('userProfilePic', response.data.user.profile_picture || '');
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Error loading profile: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-blue-600 text-lg font-light">Loading profile data...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg border border-red-300 shadow-lg max-w-md">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                        <span className="text-red-500 text-xl">!</span>
                    </div>
                    <p className="text-red-500 text-center">{error}</p>
                </div>
            </div>
        );
    }
    
    if (!userData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg border border-yellow-300 shadow-lg max-w-md">
                    <p className="text-yellow-500 text-center">No profile data found.</p>
                </div>
            </div>
        );
    }

    // Function to check if the profile picture URL is valid
    const isValidUrl = (url) => {
        if (!url) return false;
        // Check if it's a valid URL format (very basic check)
        return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
    };

    // Get profile picture or use default
    const profilePicture = isValidUrl(userData.profile_picture) ? userData.profile_picture : null;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Profile header with name and job title */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-t-xl p-6 text-white">
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <p className="text-blue-200">Manage your personal information</p>
                </div>

                <div className="bg-white shadow-lg rounded-b-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                        {/* Profile picture and basic info card */}
                        <div className="lg:col-span-1 bg-gray-50 p-6 border-r border-gray-200">
                            <div className="flex flex-col items-center">
                                {profilePicture ? (
                                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-blue-400 to-indigo-500 mb-4">
                                        <img 
                                            src={profilePicture} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover rounded-full border-2 border-white"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/default-profile.png'; // Fallback to default image if loading fails
                                                // If no default image available, show initial instead
                                                if (!e.target.complete || e.target.naturalWidth === 0) {
                                                    e.target.style.display = 'none';
                                                    e.target.parentNode.innerHTML = `
                                                        <div class="w-full h-full rounded-full bg-blue-500 flex items-center justify-center">
                                                            <span class="text-4xl font-bold text-white">
                                                                ${userData.first_name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    `;
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center mb-4">
                                        <span className="text-4xl font-bold text-white">
                                            {userData.first_name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {userData.first_name} {userData.last_name}
                                </h2>
                                <p className="text-blue-600 font-medium">{userData.job_title}</p>
                                <p className="text-gray-500 mt-1">{userData.department}</p>
                                
                                <div className="mt-6 w-full space-y-3">
                                    <div className="flex items-center text-gray-700">
                                        <Mail size={16} className="mr-3 text-blue-500" />
                                        <span>{userData.email}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-700">
                                        <Award size={16} className="mr-3 text-blue-500" />
                                        <span>{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-700">
                                        <Calendar size={16} className="mr-3 text-blue-500" />
                                        <span>ID: {userData.employee_id}</span>
                                    </div>
                                </div>
                                
                                <button className="mt-8 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center">
                                    <span className="mr-2">Edit Profile</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Detailed info section */}
                        <div className="lg:col-span-2 p-6">
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                    Employment Information
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Department
                                        </label>
                                        <p className="text-gray-800 font-medium">{userData.department}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Position
                                        </label>
                                        <p className="text-gray-800 font-medium">{userData.job_title}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Employee ID
                                        </label>
                                        <p className="text-gray-800 font-medium">{userData.employee_id}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Role
                                        </label>
                                        <p className="text-gray-800 font-medium">
                                            {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                    Timeline
                                </h3>
                                
                                <div className="space-y-4 relative before:content-[''] before:absolute before:left-3 before:top-2 before:w-0.5 before:h-full before:bg-gray-200">
                                    <div className="flex">
                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center z-10">
                                            <div className="w-3 h-3 rounded-full bg-white"></div>
                                        </div>
                                        <div className="ml-6">
                                            <p className="font-medium text-gray-800">Joined Company</p>
                                            <p className="text-gray-500 text-sm">{userData.hire_date}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center z-10">
                                            <div className="w-3 h-3 rounded-full bg-white"></div>
                                        </div>
                                        <div className="ml-6">
                                            <p className="font-medium text-gray-800">Profile Created</p>
                                            <p className="text-gray-500 text-sm">{new Date(userData.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex">
                                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center z-10">
                                            <div className="w-3 h-3 rounded-full bg-white"></div>
                                        </div>
                                        <div className="ml-6">
                                            <p className="font-medium text-gray-800">Last Updated</p>
                                            <p className="text-gray-500 text-sm">{new Date(userData.updated_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;