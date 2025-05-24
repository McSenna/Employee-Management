import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, User, Bell, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDashboard = () => {
  const [userStats, setUserStats] = useState({
    totalFiles: 0,
    pendingRequests: 0,
    completedTasks: 0,
    upcomingEvents: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('employee_id');
      if (!userId) {
        setError('You must be logged in to view dashboard');
        setLoading(false);
        return;
      }

      // Fetch files count
      const filesResponse = await axios.get(`http://localhost/employee-management-system/backend/api.php?action=fetch_files&employee_id=${userId}`);
      const totalFiles = filesResponse.data.files ? filesResponse.data.files.length : 0;

      // Fetch other user data
      const userDataResponse = await axios.get(`http://localhost/employee-management-system/backend/api.php?action=fetch_user_data&employee_id=${userId}`);
      const userData = userDataResponse.data;
      
      setUserStats({
        totalFiles: totalFiles,
        pendingRequests: userData.pendingRequests || 0,
        completedTasks: userData.completedTasks || 0,
        upcomingEvents: userData.upcomingEvents || 0
      });
      
      setRecentActivities(userData.recentActivities || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user data. Please try again later.');
      setLoading(false);
      console.error('Error fetching user data:', err);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'file':
        return FileText;
      case 'request':
        return Clock;
      case 'task':
        return CheckCircle2;
      case 'event':
        return Calendar;
      default:
        return Bell;
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, User!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your account today.</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FileText}
            title="Total Files"
            value={userStats.totalFiles}
            color="bg-blue-500"
          />
          <StatCard
            icon={Clock}
            title="Pending Requests"
            value={userStats.pendingRequests}
            color="bg-amber-500"
          />
          <StatCard
            icon={CheckCircle2}
            title="Completed Tasks"
            value={userStats.completedTasks}
            color="bg-green-500"
          />
          <StatCard
            icon={Calendar}
            title="Upcoming Events"
            value={userStats.upcomingEvents}
            color="bg-purple-500"
          />
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading activities...</p>
                </div>
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 rounded-full bg-gray-100">
                        <Icon size={20} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Bell size={24} className="mx-auto mb-4 text-gray-400" />
                <p>No recent activities to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;