import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './admin-components/AdminHeader';

const AdminLayout = () => {
    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <header>
                <AdminHeader />
            </header>

            {/* Main Content */}
            <main className="flex-grow bg-gray-50 mt-2">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white shadow-inner py-4">
                <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Enterprise Admin Portal. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default AdminLayout;