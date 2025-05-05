import React from 'react';
import { 
    User, 
    Briefcase, 
    Search, 
    BarChart, 
    Calendar, 
    FileText, 
    Bell, 
    Clock, 
    ShieldCheck, 
    RefreshCw 
} from 'lucide-react';

const Features = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="bg-blue-700 text-white py-16 rounded-lg mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Features & Capabilities</h1>
                    <p className="text-xl max-w-2xl mx-auto">
                        Discover how our comprehensive suite of tools can transform your employee management experience.
                    </p>
                </div>
            </div>

            {/* Main Features */}
            <div className="mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Core Features</h2>
                    <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Our platform offers a complete set of tools designed to streamline your HR processes and improve workforce management.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <User size={24} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Employee Profiles</h3>
                        <p className="text-gray-600">
                            Comprehensive profiles with all essential employee information in one place. Track personal details, contact information, position history, and more.
                        </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Briefcase size={24} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Position Management</h3>
                        <p className="text-gray-600">
                            Easily manage roles, departments, and organizational structure. Track position changes, promotions, and reporting relationships.
                        </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Search size={24} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Advanced Search</h3>
                        <p className="text-gray-600">
                            Find any employee information instantly with powerful search capabilities. Filter by name, position, department, or any custom field.
                        </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <BarChart size={24} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
                        <p className="text-gray-600">
                            Gain valuable insights with visual representations of workforce data. Track key metrics and identify trends for informed decision-making.
                        </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Calendar size={24} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Time Off Management</h3>
                        <p className="text-gray-600">
                            Simplify leave requests and approvals. Track vacation time, sick days, and other absences with a user-friendly calendar interface.
                        </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <FileText size={24} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Document Management</h3>
                        <p className="text-gray-600">
                            Securely store and organize employee documents. Keep contracts, certifications, and other important files easily accessible.
                        </p>
                    </div>
                </div>
            </div>

            {/* Highlighted Feature */}
            <div className="bg-blue-50 p-8 rounded-lg mb-16">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <span className="text-blue-600 font-medium">FEATURED</span>
                        <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">Real-time Notifications</h2>
                        <p className="text-gray-600 mb-6">
                            Stay informed about important updates with our advanced notification system. Receive alerts for new hires, position changes, approaching deadlines, and more.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full mr-4">
                                    <Bell size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Customizable Alerts</h4>
                                    <p className="text-sm text-gray-600">Choose what notifications matter most to you</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full mr-4">
                                    <Clock size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Real-time Updates</h4>
                                    <p className="text-sm text-gray-600">Get immediate notifications when changes occur</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-2 rounded-full mr-4">
                                    <RefreshCw size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Delivery Options</h4>
                                    <p className="text-sm text-gray-600">Receive alerts via email, SMS, or in-app notifications</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="border-b pb-4 mb-4">
                            <h3 className="font-bold mb-2">Recent Notifications</h3>
                        </div>
                        {[
                            "New employee John Doe joined the team",
                            "Sarah Smith promoted to Senior Developer",
                            "Team meeting scheduled for Friday at 2 PM",
                            "Performance review deadline approaching"
                        ].map((notification, index) => (
                            <div key={index} className="flex items-start py-3 border-b last:border-b-0">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                    <Bell size={16} className="text-blue-600" />
                                </div>
                                <div className="text-sm">{notification}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
                    <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Our platform offers unique advantages that set us apart from traditional employee management systems.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <ShieldCheck size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Enterprise-Grade Security</h3>
                            <p className="text-gray-600">
                                Your employee data is protected with the highest level of encryption and security protocols. Rest assured that sensitive information remains confidential.
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <RefreshCw size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Regular Updates</h3>
                            <p className="text-gray-600">
                                We continuously improve our platform with new features and enhancements based on customer feedback and industry best practices.
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <Clock size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Time-Saving Automation</h3>
                            <p className="text-gray-600">
                                Reduce manual work with automated workflows for common HR processes, allowing your team to focus on strategic tasks.
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <User size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">User-Friendly Experience</h3>
                            <p className="text-gray-600">
                                Our intuitive interface makes it easy for both HR professionals and employees to navigate and utilize the platform's features.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;