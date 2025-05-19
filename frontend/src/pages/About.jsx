import React from 'react';
import { Users, Briefcase, Globe, Award, Clock, CheckCircle, Linkedin, Mail, Twitter } from 'lucide-react';

const About = () => {
    const Team = [
        {
            id: 1,
            name: "John Carlo Apuyan",
            role: "CEO & Founder",
            bio: "Visionary leader with 15+ years in HR technology and operations management.",
            color: "bg-blue-600",
            image: "/10.jpeg"
        },
        {
            id: 2,
            name: "Airah Vibar",
            role: "CTO",
            bio: "Tech innovator with expertise in scalable enterprise solutions and AI integration.",
            color: "bg-indigo-600",
            image: "/airah.jpg"
        },
        {
            id: 3,
            name: "Gian Mirandilla",
            role: "Design Lead",
            bio: "Award-winning UX/UI designer focused on creating intuitive user experiences.",
            color: "bg-purple-600",
            image: "/Gian.jpeg"
        },
        {
            id: 4,
            name: "A-Jay Espiritu",
            role: "Head of Customer Success",
            bio: "Dedicated to ensuring clients achieve their workforce management goals.",
            color: "bg-teal-600",
            image: "/ajay.jpg"
        },
        {
            id: 5,
            name: "Noel Abordo",
            role: "Head of Marketing",
            bio: "Strategic marketer with a passion for communicating innovative solutions.",
            color: "bg-cyan-600",
            image: "/bonel.jpg"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 rounded-lg mb-16 shadow-xl">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">About Employee Portal</h1>
                    <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
                    <p className="text-xl max-w-2xl mx-auto leading-relaxed">
                        An innovative solution for managing your organization's workforce efficiently and effectively.
                    </p>
                </div>
            </div>

            {/* Mission Statement */}
            <div className="mb-16">
                <div className="flex flex-col items-center text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                    <div className="w-16 h-1 bg-blue-600 mb-6"></div>
                    <p className="text-lg text-gray-600 max-w-3xl">
                        We aim to simplify employee management by providing tools that increase productivity, improve 
                        communication, and enhance overall workplace satisfaction through intuitive digital solutions.
                    </p>
                </div>
            </div>

            {/* Company Story */}
            <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                    <div className="w-16 h-1 bg-blue-600 mb-6"></div>
                    <p className="text-gray-600 mb-4">
                        Founded in 2022, Employee Portal was created by a team of HR professionals and software engineers 
                        who recognized the challenges of modern workforce management.
                    </p>
                    <p className="text-gray-600 mb-4">
                        After experiencing firsthand the inefficiencies of outdated employee management systems, 
                        our founders set out to build a solution that would streamline administrative tasks and 
                        create a better experience for both HR managers and employees.
                    </p>
                    <p className="text-gray-600">
                        Today, our platform serves organizations of all sizes across various industries, 
                        helping them manage their most valuable asset - their people.
                    </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-200 p-10 rounded-lg shadow-lg">
                    <div className="flex items-center mb-8 border-b border-blue-300 pb-6">
                        <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mr-6 shadow-md">
                            <Clock size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-blue-800">2022</h3>
                            <p className="text-gray-700 font-medium">Company founded</p>
                        </div>
                    </div>
                    <div className="flex items-center mb-8 border-b border-blue-300 pb-6">
                        <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mr-6 shadow-md">
                            <Users size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-blue-800">2023</h3>
                            <p className="text-gray-700 font-medium">First 100 clients</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mr-6 shadow-md">
                            <Globe size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-blue-800">2024</h3>
                            <p className="text-gray-700 font-medium">International expansion</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Core Values</h2>
                    <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-300">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto transform transition-transform duration-300 hover:rotate-12">
                            <CheckCircle size={28} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Simplicity</h3>
                        <p className="text-gray-600 text-center">
                            We believe in creating intuitive interfaces that make complex tasks easy to accomplish.
                        </p>
                    </div>
                    
                    <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-300">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto transform transition-transform duration-300 hover:rotate-12">
                            <Users size={28} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">People-First</h3>
                        <p className="text-gray-600 text-center">
                            We design with the human experience in mind, focusing on what makes work life better.
                        </p>
                    </div>
                    
                    <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-300">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto transform transition-transform duration-300 hover:rotate-12">
                            <Award size={28} className="text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">Excellence</h3>
                        <p className="text-gray-600 text-center">
                            We strive for quality in every feature we develop and every service we provide.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Leadership Team</h2>
                    <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
                        The passionate professionals behind Employee Portal who are dedicated to transforming 
                        workforce management.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-8">
                    {Team.map((member) => (
                        <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            <div className={`${member.color} h-3 w-full`}></div>
                            <div className="p-6">
                                <div className="relative mb-6">
                                    {member.image ? (
                                        <div className="w-24 h-24 mx-auto overflow-hidden rounded-full border-4 border-white shadow-lg">
                                            <img 
                                                src={member.image} 
                                                alt={`${member.name} profile`} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${member.color} text-white text-2xl font-bold shadow-lg`}>
                                            {member.name.split(' ').map(name => name[0]).join('')}
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                                    <div className="flex justify-center space-x-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                            <Linkedin size={18} />
                                        </a>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                            <Mail size={18} />
                                        </a>
                                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                                            <Twitter size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;