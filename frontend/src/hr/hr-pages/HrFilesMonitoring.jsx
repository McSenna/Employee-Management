import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { File, Calendar, FileText, Search, Eye } from 'lucide-react';

const HrFilesMonitoring = () => {
    const [files, setFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const ref = useRef([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const apiUrl = 'http://localhost/employee-management-system/backend/api.php?action=';

    const fetchFiles = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${apiUrl}fetchfiles`);
            ref.current = response.data;
            setFiles(response.data);
        } 
        catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewFile = (file) => {
        console.log('View file details:', file);
    };

    const filteredFiles = files.filter(file =>
        file.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getFileIcon = (fileType) => {
        if (!fileType) return <File className="text-gray-400" />;
        
        if (fileType.includes('image')) return <File className="text-blue-500" />;
        if (fileType.includes('pdf')) return <FileText className="text-red-500" />;
        if (fileType.includes('document')) return <FileText className="text-blue-500" />;
        if (fileType.includes('spreadsheet')) return <FileText className="text-green-500" />;
        
        return <File className="text-gray-400" />;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-md">
                    <div className="space-y-4">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                        </div>
                        <div className="text-gray-500 text-center">Loading files...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">HR Employee Files Repository</h1>
                    <p className="text-gray-600">View all uploaded files and documents of Carlo's Emoployeez</p>
                </div>

                {/* Search Bar */}
                <div className="mb-10">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <Search className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Files Grid */}
                {filteredFiles.length === 0 ? (
                    <div className="bg-white p-8 rounded shadow-md text-center">
                        <File className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No files found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFiles.map((file, index) => (
                            <div
                                key={file.id || index}
                                className="bg-white p-5 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="mr-3">
                                        {getFileIcon(file.file_type)}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800 truncate">
                                        {file.file_name}
                                    </h3>
                                </div>

                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex items-center text-gray-500">
                                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{file.file_type || 'Unknown type'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <File className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="truncate">{file.description || 'No description'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{file.uploaded_at || 'Unknown date'}</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleViewFile(file)}
                                        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm flex items-center justify-center transition-colors duration-200"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        <span>View Details</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HrFilesMonitoring;