import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if(window.confirm('are you sure you want to logout?')) {
            navigate('/')
        }
    }

    return (
        <div>
            Hello!! User

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default UserLayout;