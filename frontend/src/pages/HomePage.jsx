import { useState } from 'react';
import { Info, User, Briefcase, Plus, Search, Trash2, Edit } from 'lucide-react';
import SignInModal from '../auth/SignIn'; 

const HomePage = () => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const handleSignIn = () => {
    setIsSignInModalOpen(true);
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