import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Home, Info, LogIn, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SignInModal from '../auth/SignIn'; // Make sure the path matches your project structure

const PublicLayout = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SignInModal 
                isOpen={isSignInModalOpen}
                onClose={() => setIsSignInModalOpen(false)}
            />

            <nav className="bg-blue-600 text-white shadow-md">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center ">
                    <div className="flex items-center space-x-1">
                        <Briefcase size={24} />
                        <span className="font-bold text-xl">Employee Portal</span>
                    </div>
                    
                    <div className="flex space-x-6">
                        <Link 
                            to="/" 
                            className={`flex items-center space-x-1 hover:text-blue-200 ${isActive('/') ? 'border-b-2 border-white' : ''}`}
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                        <Link 
                            to="/about" 
                            className={`flex items-center space-x-1 hover:text-blue-200 ${isActive('/about') ? 'border-b-2 border-white' : ''}`}
                        >
                            <Info size={18} />
                            <span>About</span>
                        </Link>
                        {/* Change the Sign In link to open the modal instead of navigating */}
                        <button 
                            onClick={() => setIsSignInModalOpen(true)}
                            className={`flex items-center space-x-1 hover:text-blue-200 cursor-pointer`}
                        >
                            <LogIn size={18} />
                            <span>Sign In</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content - Outlet renders the child route components */}
            <div className="flex-grow">
                <Outlet />
            </div>
            
            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-xl font-bold flex items-center">
                                <Briefcase size={20} className="mr-2" />
                                Employee Portal
                            </h3>
                            <p className="text-gray-400 mt-2">Managing your workforce made simple</p>
                        </div>
                        
                        <div className="flex gap-6">
                            <Link to="/" className="hover:text-blue-300">Home</Link>
                            <Link to="/about" className="hover:text-blue-300">About</Link>
                            {/* Change the Sign In link in footer to open the modal instead of navigating */}
                            <button 
                                onClick={() => setIsSignInModalOpen(true)}
                                className="hover:text-blue-300 cursor-pointer"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Employee Portal. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;