import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import HrHeader from './components/HrHeader';

const HrLayout = () => {
    return (
        <div>
            <header>
                <HrHeader />
            </header>
            <main>
                <Outlet /> 
            </main>
        </div>
    );
};

export default HrLayout;