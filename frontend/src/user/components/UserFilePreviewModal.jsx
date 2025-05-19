import React, { useState, useEffect } from 'react';
import { X, Download, AlertCircle, File as FileIcon } from 'lucide-react';

const UserFilePreviewModal = ({ isOpen, onClose, file }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isOpen && file) {
      loadFileContent();
    }
    // Clean up when modal closes
    return () => {
      setContent(null);
      setError('');
    };
  }, [isOpen, file]);
  
  const loadFileContent = async () => {
    if (!file || !file.file_path) return;
    
    setLoading(true);
    setError('');
    
    try {
      // For image files, we don't need to fetch content
      if (isImageFile(file.mime_type)) {
        setContent(file.file_path);
        setLoading(false);
        return;
      }
      
      // For PDFs, we'll use the file path directly
      if (isPdfFile(file.mime_type)) {
        setContent(file.file_path);
        setLoading(false);
        return;
      }
      
      // For text-based files, fetch the content
      if (isTextFile(file.mime_type)) {
        const response = await fetch(file.file_path);
        if (!response.ok) {
          throw new Error('Failed to load file content');
        }
        const text = await response.text();
        setContent(text);
        setLoading(false);
        return;
      }
      
      // For unsupported file types
      setError('Preview not available for this file type. Please download the file.');
      setLoading(false);
    } catch (err) {
      console.error('Error loading file:', err);
      setError('Failed to load file content. Please try downloading instead.');
      setLoading(false);
    }
  };
  
  const isImageFile = (mimeType) => {
    return mimeType && mimeType.startsWith('image/');
  };
  
  const isPdfFile = (mimeType) => {
    return mimeType === 'application/pdf';
  };
  
  const isTextFile = (mimeType) => {
    const textTypes = [
      'text/plain', 
      'text/html', 
      'text/css', 
      'text/javascript', 
      'application/json',
      'application/xml',
      'text/csv',
      'text/markdown'
    ];
    return textTypes.includes(mimeType);
  };
  
  const renderFileContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading file content...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center p-4">
          <AlertCircle className="text-amber-500 mb-2" size={32} />
          <p className="text-gray-700 mb-4">{error}</p>
          <a 
            href={file.file_path} 
            download={file.file_name}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Download size={16} className="mr-2" />
            Download File
          </a>
        </div>
      );
    }
    
    if (!content) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No content to display</p>
        </div>
      );
    }
    
    // Handle different file types
    if (isImageFile(file.mime_type)) {
      return (
        <div className="flex justify-center p-4">
          <img 
            src={content} 
            alt={file.file_name} 
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      );
    }
    
    if (isPdfFile(file.mime_type)) {
      return (
        <div className="h-[70vh]">
          <iframe 
            src={`${content}#view=FitH`} 
            title={file.file_name}
            className="w-full h-full border-0" 
          />
        </div>
      );
    }
    
    // Text content
    return (
      <div className="p-4 max-h-[70vh] overflow-auto">
        <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded">{content}</pre>
      </div>
    );
  };
  
  if (!isOpen || !file) return null;
  
  return (
    <div className="fixed inset-0 bg-tranparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FileIcon className="text-blue-500 mr-2" size={20} />
            <h3 className="text-lg font-medium text-gray-900 truncate max-w-lg">
              {file.file_name}
            </h3>
            <span className="ml-2 text-sm text-gray-500">
              ({formatFileSize(file.size)})
            </span>
          </div>
          <div className="flex items-center">
            <a 
              href={file.file_path} 
              download={file.file_name}
              className="text-blue-600 hover:text-blue-800 mr-4"
              title="Download file"
            >
              <Download size={20} />
            </a>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {renderFileContent()}
        </div>
      </div>
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

export default UserFilePreviewModal;