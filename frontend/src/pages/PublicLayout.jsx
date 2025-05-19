import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import SignInModal from '../auth/SignIn'; 
import PublicHeader from './components/PublicHeader'; 

const PublicLayout = () => {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* SignIn Modal */}
            <SignInModal 
                isOpen={isSignInModalOpen}
                onClose={() => setIsSignInModalOpen(false)}
            />
            
            {/* Sticky Header */}
            <header className="sticky top-0 z-50">
                <PublicHeader setIsSignInModalOpen={setIsSignInModalOpen} />
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>
            
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