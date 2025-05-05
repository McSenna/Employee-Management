import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import About from '../pages/About';
import Features from '../pages/Features';
import PublicLayout from '../pages/PublicLayout';
import UserLayout from '../user/UserLayout';
import AdminLayout from '../admin/AdminLayout';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Nested routes inside PublicLayout */}
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<About />} />
                    <Route path="features" element={<Features />} />
                </Route>

                {/* User Route */}
                <Route path="/user-layout" element={<UserLayout />}>

                </Route>

                {/* Admin Route */}
                <Route path="/admin-layout" element={<AdminLayout />}>

                </Route>


            </Routes>
        </BrowserRouter>
    );
};

export default Router;