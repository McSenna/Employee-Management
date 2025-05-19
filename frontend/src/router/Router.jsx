import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import About from '../pages/About';
import Features from '../pages/Features';
import PublicLayout from '../pages/PublicLayout';
import UserLayout from '../user/UserLayout';
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/admin-pages/AdminDashboard';
import AdminAddEmployee from '../admin/admin-pages/AdminAddEmployee';
import AdminEmployee from '../admin/admin-pages/AdminEmployee';
import HrLayout from '../hr/HrLayout';
import HrDashboard from '../hr/hr-pages/HrDashboard';
import HrFilesMonitoring from '../hr/hr-pages/HrFilesMonitoring';
import UserDashboard from '../user/user-pages/UserDashboard';
import UserProfile from '../user/user-pages/UserProfile';
import UserFiles from '../user/user-pages/UserFiles';
import HrProfile from '../hr/hr-pages/HrProfile';
import AdminEmployeeFiles from '../admin/admin-pages/AdminEmployeeFiles';

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
                    <Route index element={<UserDashboard />} />
                    <Route path='user-dashboard' element={<UserDashboard />} />
                    <Route path='user-profile' element={<UserProfile />} />
                    <Route path='user-files' element={<UserFiles />} />
                </Route>

                <Route path="/hr-layout" element={<HrLayout />}>
                    <Route index element={<HrDashboard />} />
                    <Route path="hr-dashboard" element= {<HrDashboard />} />
                    <Route path="hr-files" element= {<HrFilesMonitoring />} />
                    <Route path="hr-profile" element= {<HrProfile />} />
                </Route>

                {/* Admin Route */}
                <Route path="/admin-layout" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="admin-dashboard" element= {<AdminDashboard />} />
                    <Route path="admin-add-employee" element= {<AdminAddEmployee />} />
                    <Route path="admin-employee" element= {<AdminEmployee />} />
                    <Route path="admin-files" element= {<AdminEmployeeFiles />} />
                </Route>


            </Routes>
        </BrowserRouter>
    );
};

export default Router;