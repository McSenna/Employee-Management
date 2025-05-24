import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, RefreshCw, Users, Briefcase, Award, Database, HardDrive, FileCheck, Building, Activity } from 'lucide-react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_employees: 0,
    department_stats: [],
    recent_activities: [],
    logs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost/employee-management-system/backend/api.php?action=fetch_admin_stats');
      if (!response.data.error) {
        setStats(response.data);
      } else {
        setError('Failed to fetch statistics');
      }
      setLoading(false);
    } catch (err) {
      setError('Error fetching statistics');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDepartmentChartData = () => {
    return {
      labels: stats.department_stats.map(dept => dept.department),
      datasets: [
        {
          data: stats.department_stats.map(dept => dept.count),
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(201, 203, 207, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const departmentChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Department Distribution' },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview and employee statistics</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Main Stats */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Employees</p>
                  <p className="text-3xl font-bold mt-2 text-blue-700">{stats.total_employees}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-full">
                  <Users size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Departments</p>
                  <p className="text-3xl font-bold mt-2 text-purple-700">{stats.department_stats.length}</p>
                </div>
                <div className="p-4 bg-purple-100 rounded-full">
                  <Building size={24} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Active Users</p>
                  <p className="text-3xl font-bold mt-2 text-emerald-700">{stats.active_users || 0}</p>
                </div>
                <div className="p-4 bg-emerald-100 rounded-full">
                  <Activity size={24} className="text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">System Logs</p>
                  <p className="text-3xl font-bold mt-2 text-amber-700">{stats.logs.length}</p>
                </div>
                <div className="p-4 bg-amber-100 rounded-full">
                  <Database size={24} className="text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Chart */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Department Distribution</h2>
            <div className="h-[400px] flex items-center justify-center">
              {stats.department_stats.length > 0 ? (
                <Doughnut data={getDepartmentChartData()} options={departmentChartOptions} />
              ) : (
                <p className="text-gray-500">No department data available</p>
              )}
            </div>
          </div>

          {/* Department List */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Department Details</h2>
            <div className="space-y-6">
              {stats.department_stats.map((dept, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{dept.department}</h3>
                      <p className="text-sm text-gray-500 mt-1">Department ID: {dept.department_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{dept.count}</p>
                      <p className="text-sm text-gray-500">Employees</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(dept.count / stats.total_employees) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {((dept.count / stats.total_employees) * 100).toFixed(1)}% of total workforce
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent System Activities</h2>
            <button
              onClick={fetchStats}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          <div className="p-8">
            {stats.recent_activities.length > 0 ? (
              <div className="space-y-6">
                {stats.recent_activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Activity size={20} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user_name || 'System'}
                      </p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;