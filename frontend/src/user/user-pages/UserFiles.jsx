import React, { useState, useEffect } from 'react';
import { File, AlertCircle, Check, Upload, Eye } from 'lucide-react';
import axios from 'axios';
import UserFileUploadModal from '../components/UserFileUploadModal';
import UserFilePreviewModal from '../components/UserFilePreviewModal';
import { useNavigate } from 'react-router-dom';

const UserFiles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usedStorage, setUsedStorage] = useState(0);
  const [totalStorage, setTotalStorage] = useState(150);
  const [userFiles, setUserFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('employee_id');
    if (!userId) {
      setErrorMessage('You must be logged in to view files');
      navigate('/login'); // Redirect to login page if not logged in
      return;
    }
    fetchUserFiles();
    fetchStorageInfo();
  }, [navigate]);

  const fetchUserFiles = async () => {
    try {
      const userId = localStorage.getItem('employee_id');
      if (!userId) {
        setErrorMessage('You must be logged in to view files');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost/employee-management-system/backend/api.php?action=fetch_files&employee_id=${userId}`);
      
      if (!response.data.error) {
        setUserFiles(response.data.files || []);
      } else {
        console.error('Error fetching files:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchStorageInfo = async () => {
    try {
      const userId = localStorage.getItem('employee_id');
      if (!userId) return;

      const response = await axios.get(`http://localhost/employee-management-system/backend/api.php?action=get_storage_info&employee_id=${userId}`);
      
      if (!response.data.error) {
        setUsedStorage(response.data.used_storage || 0);
        setTotalStorage(response.data.total_storage || 150);
      }
    } catch (error) {
      console.error('Error fetching storage info:', error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const response = await axios.post(
        'http://localhost/employee-management-system/backend/api.php?action=delete_file',
        { file_id: fileId }
      );
      
      if (!response.data.error) {
        setSuccessMessage('File deleted successfully');
        fetchUserFiles();
        fetchStorageInfo();
      } else {
        setErrorMessage(response.data.message || 'Error deleting file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setErrorMessage('Error deleting file. Please try again.');
    }
  };

  const handleUploadSuccess = () => {
    setSuccessMessage('Files uploaded successfully');
    fetchUserFiles();
    fetchStorageInfo();
    setIsModalOpen(false);
  };

  const handlePreviewFile = (file) => {
    setSelectedFile(file);
    setIsPreviewModalOpen(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isViewableFile = (mimeType) => {
    if (!mimeType) return false;
    
    const viewableTypes = [
      'image/',
      'text/',
      'application/pdf',
      'application/json',
      'application/xml'
    ];
    
    return viewableTypes.some(type => mimeType.startsWith(type));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">File Management</h2>
          <div className="h-2 bg-gray-200 rounded-full mb-2">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${Math.min(100, (usedStorage/totalStorage) * 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {usedStorage.toFixed(1)}MB of {totalStorage}MB used
            <span className="ml-2 text-xs text-gray-500">
              (Max file size: 40MB)
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Upload className="mr-2" size={16} />
          Upload Files
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
          <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={20} />
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 flex items-start">
          <Check className="text-green-500 mr-2 flex-shrink-0" size={20} />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Your Files</h3>
        {userFiles.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <File className="text-gray-400" size={48} />
            </div>
            <p className="text-gray-500 mb-4">You haven't uploaded any files yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Upload Your First File
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <File className="text-blue-500 mr-2" size={16} />
                        <div className="text-sm font-medium text-gray-900">{file.file_name}</div>
                      </div>
                      {file.description && (
                        <div className="text-xs text-gray-500 mt-1">{file.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {file.file_type.charAt(0).toUpperCase() + file.file_type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(file.uploaded_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isViewableFile(file.mime_type) && (
                        <button
                          onClick={() => handlePreviewFile(file)}
                          className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </button>
                      )}
                      <a
                        href={file.file_path}
                        download={file.file_name}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserFileUploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        usedStorage={usedStorage}
        totalStorage={totalStorage}
        onError={(msg) => setErrorMessage(msg)}
      />

      <UserFilePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        file={selectedFile}
      />
    </div>
  );
};

export default UserFiles;