import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Edit, Trash2, File, Calendar, FileText, Search, User } from 'lucide-react';

const AdminEmployeeFiles = () => {
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                const response = await axios.post(`${apiUrl}deletefile`, {
                    file_id: id
                });
                if (response.data.success) {
                    setFiles(files.filter((file) => file.id !== id));
                } else {
                    alert('Failed to delete the file');
                }
            } catch (error) {
                console.error('Error deleting file:', error);
                alert('An error occurred while deleting the file');
            }
        }
    };

    const handleEdit = (file) => {
        console.log('Edit file:', file);
    };

    const filteredFiles = files.filter(file =>
        file.file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getFileIcon = (fileType) => {
        if (!fileType) return <File className="text-gray-400" />;
        
        if (fileType.includes('image')) return <File className="text-blue-500" />;
        if (fileType.includes('pdf')) return <FileText className="text-red-500" />;
        if (fileType.includes('document')) return <FileText className="text-blue-500" />;
        if (fileType.includes('spreadsheet')) return <FileText className="text-green-500" />;
        
        return <File className="text-gray-400" />;
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Employee Files</h1>
                    <p className="text-gray-600 mt-1">Manage and track all employee files</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search files by name, description, or employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <Search className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Files Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {filteredFiles.length === 0 ? (
                        <div className="p-8 text-center">
                            <File className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No files found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredFiles.map((file, index) => (
                                        <tr key={file.id || index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        {getFileIcon(file.file_type)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {file.file_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <User className="w-4 h-4 text-gray-400 mr-2" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {file.employee_name || 'Unknown'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {file.employee_department} • {file.employee_job_title}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {file.file_type.charAt(0).toUpperCase() + file.file_type.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatFileSize(file.size)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                                    {file.description || 'No description'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(file.uploaded_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(file)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                    title="Edit file"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete file"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminEmployeeFiles;