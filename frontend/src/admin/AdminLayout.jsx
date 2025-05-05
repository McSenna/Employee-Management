import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const AdminLayout = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        if(window.confirm('are you sure you want to logout?')) {
            navigate('/')
        } 
    }

    return (
        <div>
            Hello Admin

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default AdminLayout;