import React from 'react';
import { Home, Info, LogIn, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';


const PublicHeader = ({ setIsSignInModalOpen }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
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
                    <button 
                        onClick={() => setIsSignInModalOpen(true)}
                        className="flex items-center space-x-1 hover:text-blue-200 cursor-pointer"
                    >
                        <LogIn size={18} />
                        <span>Sign In</span>
                    </button>
                    
                </div>
            </div>
        </nav>
    );
};

export default PublicHeader;