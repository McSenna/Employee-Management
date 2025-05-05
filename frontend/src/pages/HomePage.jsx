import { useState, useEffect } from 'react';
import { Info, User, Briefcase, Plus, Search, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignInModal from '../auth/SignIn'; 

const HomePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  const api = 'http://localhost/employee-management-system/backend/api.php?action=';
  
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api}fetch`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees. Please try again later.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredEmployees = Array.isArray(employees) ? employees.filter(employee => 
    (employee?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee?.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleSignIn = () => {
    setIsSignInModalOpen(true);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`${api}delete&id=${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete: ${response.status}`);
        }
        
        // Refresh the employee list
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        setError('Failed to delete employee. Please try again later.');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  return (
    <div>
      {/* Sign In Modal */}
      <SignInModal 
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />

      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to Employee Portal</h1>
          <p className="text-xl mb-8">Manage your company's workforce efficiently</p>
          <button 
            onClick={() => handleSignIn()}
            className="bg-white text-blue-700 px-6 py-2 rounded-md font-medium hover:bg-blue-50 flex items-center"
          >
            <User size={18} className="mr-2" />
            Get Started
          </button>
        </div>
      </div>

      {/* Employee Management Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Employee Directory</h2>
          <button 
            onClick={() => handleNavigate('/add-employee')}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add Employee
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees by name or position..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Employee Table */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading employees...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded text-center">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                              {(employee?.name || '?').charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee?.name || 'Unknown'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee?.position || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee?.salary ? `$${Number(employee.salary).toLocaleString()}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(employee.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? 'No employees match your search criteria' : 'No employees found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 mb-4">
                <User size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
              <p className="text-gray-600">Add, edit, and remove employees with ease. Keep track of all your workforce information in one place.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 mb-4">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Position Tracking</h3>
              <p className="text-gray-600">Monitor job positions, departments, and organizational structure with our intuitive interface.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 mb-4">
                <Info size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
              <p className="text-gray-600">Generate comprehensive reports and analytics about your workforce demographics and performance.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;