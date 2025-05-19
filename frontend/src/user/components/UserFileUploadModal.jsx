import React, { useState } from 'react';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

const UserFileUploadModal = ({ isOpen, onClose, onUploadSuccess, usedStorage, totalStorage, onError }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [fileType, setFileType] = useState('other');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    
    const oversizedFiles = newFiles.filter(file => file.size > 40 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrorMessage(`Files cannot exceed 40MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    const totalNewSize = newFiles.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);
    const wouldExceedLimit = (usedStorage + totalNewSize) > totalStorage;
    
    if (wouldExceedLimit) {
      setErrorMessage(`Uploading these files would exceed your ${totalStorage}MB limit`);
      return;
    }
    
    setFiles([...files, ...newFiles]);
    setErrorMessage('');
    e.target.value = null;
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMessage('Please select files to upload');
      return;
    }

    setUploading(true);
    setErrorMessage('');
    
    try {
      const userId = localStorage.getItem('employee_id'); // Fixed from 'userId' to 'employee_id'
      if (!userId) {
        setErrorMessage('You must be logged in to upload files');
        onError('You must be logged in to upload files');
        setUploading(false);
        return;
      }

      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('employee_id', userId);
        formData.append('file_type', fileType);
        formData.append('description', description);

        try {
          const response = await axios.post(
            'http://localhost/employee-management-system/backend/api.php?action=upload_file',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(prev => ({
                  ...prev,
                  [index]: percentCompleted
                }));
              }
            }
          );
          alert(`File ${file.name} uploaded successfully!`);
          return response.data;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          throw error;
        }
      });

      await Promise.all(uploadPromises);
      
      setFiles([]);
      setDescription('');
      setFileType('other');
      
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      setDescription('');
      setFileType('other');
      setErrorMessage('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Upload Files</h3>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
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

          {errorMessage && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
              <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={20} />
              <p className="text-red-700">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="file-type" className="block text-sm font-medium text-gray-700 mb-1">
                File Type
              </label>
              <select
                id="file-type"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
              >
                <option value="resume">Resume/CV</option>
                <option value="contract">Contract</option>
                <option value="certificate">Certificate</option>
                <option value="other">Other Document</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Brief description of the file(s)"
                disabled={uploading}
              ></textarea>
            </div>

            <div className="mb-4">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="text-gray-400 mb-2" size={36} />
                <p className="text-sm text-gray-500 mb-2">Drag files here or click to browse</p>
                <input
                  type="file"
                  id="file-input-modal"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('file-input-modal').click()}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={uploading}
                >
                  Select Files
                </button>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <div className="flex items-center overflow-hidden">
                        <File className="text-blue-500 mr-2 flex-shrink-0" size={20} />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="ml-2 text-xs text-gray-500 flex-shrink-0">({formatFileSize(file.size)})</span>
                      </div>
                      {uploading ? (
                        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${uploadProgress[index] || 0}%` }}
                          ></div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                disabled={uploading || files.length === 0}
              >
                {uploading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFileUploadModal;