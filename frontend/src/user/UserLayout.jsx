import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from './components/UserHeader';

const HrLayout = () => {
    return (
        <div>
            <header>
                <UserHeader />
            </header>
            <main>
                <Outlet /> 
            </main>
        </div>
    );
};

export default HrLayout;