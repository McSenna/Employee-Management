import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, LayoutDashboard, User, Bell, Search, Settings, FileArchive, FileBarChart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isActive = (path) => location.pathname.includes(path);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            navigate('/');
        }
    };

    return (
        <nav className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Briefcase size={24} className="text-indigo-400" />
                    <span className="font-bold text-xl tracking-tight">Carlo's Admin Portal</span>
                </div>

                <div className="flex items-center space-x-8">
                    {/* Search Input */}
                   

                    {/* Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            to="/admin-layout/admin-employee"
                            className={`flex items-center space-x-2 hover:text-indigo-300 transition-colors ${isActive('admin-add-employee') ? 'text-indigo-300 border-b-2 border-indigo-300 pb-1' : ''}`}
                        >
                            <User size={20} />
                            <span className="font-medium">Employees</span>
                        </Link>
                        <Link
                            to="/admin-layout/admin-files"
                            className={`flex items-center space-x-2 hover:text-indigo-300 transition-colors ${isActive('admin-add-employee') ? 'text-indigo-300 border-b-2 border-indigo-300 pb-1' : ''}`}
                        >
                            <FileBarChart size={20} />
                            <span className="font-medium">Employee Files</span>
                        </Link>
                        <Link
                            to="/admin-layout/admin-dashboard"
                            className={`flex items-center space-x-2 hover:text-indigo-300 transition-colors ${isActive('admin-dashboard') ? 'text-indigo-300 border-b-2 border-indigo-300 pb-1' : ''}`}
                        >
                            <LayoutDashboard size={20} />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        {/* Notification Bell */}
                        <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                                    A
                                </div>
                                <span className="hidden md:inline font-medium">Admin</span>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                                    >
                                        <LogOut size={16} className="mr-2" />
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

export default AdminHeader;