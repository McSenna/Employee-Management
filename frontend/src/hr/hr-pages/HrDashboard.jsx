import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, RefreshCw, Users, Briefcase, Award, Database, HardDrive, FileCheck, Building } from 'lucide-react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const HrDashboard = () => {
  const [stats, setStats] = useState({
    total_employees: 0,
    department_stats: [],
    recent_hires: [],
    upcoming_anniversaries: [],
    role_stats: [],
    recent_activities: [],
    file_stats: {
      total_files: 0,
      total_size: 0,
      employees_with_files: 0
    },
    file_type_stats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost/employee-management-system/backend/api.php?action=fetch_hr_stats');
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

  const getFileTypeChartData = () => {
    return {
      labels: stats.file_type_stats.map(type => type.file_type || 'Other'),
      datasets: [
        {
          data: stats.file_type_stats.map(type => type.count),
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
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

  const fileTypeChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'File Type Distribution' },
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">HR Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of employee statistics and activities</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold mt-2 text-blue-600">{stats.total_employees}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-full">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-3xl font-bold mt-2 text-emerald-600">{stats.file_stats.total_files}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-full">
                <FileText size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-3xl font-bold mt-2 text-purple-600">{stats.file_stats.total_size} MB</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-full">
                <HardDrive size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Employees with Files</p>
                <p className="text-3xl font-bold mt-2 text-amber-600">{stats.file_stats.employees_with_files}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-full">
                <FileCheck size={24} className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Department Stats Grid */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Department Statistics</h2>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stats.department_stats.map((dept, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800">{dept.department}</h3>
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">{dept.count}</p>
                    <p className="text-sm text-gray-500">Employees</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    {((dept.count / stats.total_employees) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Department Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Department Distribution</h2>
            <div className="h-[300px] flex items-center justify-center">
              {stats.department_stats.length > 0 ? (
                <Doughnut data={getDepartmentChartData()} options={departmentChartOptions} />
              ) : (
                <p className="text-gray-500">No department data available</p>
              )}
            </div>
          </div>

          {/* File Type Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">File Type Distribution</h2>
            <div className="h-[300px] flex items-center justify-center">
              {stats.file_type_stats.length > 0 ? (
                <Doughnut data={getFileTypeChartData()} options={fileTypeChartOptions} />
              ) : (
                <p className="text-gray-500">No file type data available</p>
              )}
            </div>
          </div>

          {/* Recent Hires */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Recent Hires</h2>
            </div>
            <div className="p-6">
              {stats.recent_hires.length > 0 ? (
                <div className="space-y-6">
                  {stats.recent_hires.map((hire, index) => (
                    <div key={hire.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users size={20} className="text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {hire.first_name} {hire.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {hire.department} - {hire.job_title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Joined {formatDate(hire.hire_date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No recent hires</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
            <button
              onClick={fetchStats}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading activities...</p>
                </div>
              </div>
            ) : stats.recent_activities.length > 0 ? (
              <div className="space-y-6">
                {stats.recent_activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <FileText size={16} className="text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.employee_name || 'System'}
                      </p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(activity.created_at)}</p>
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

export default HrDashboard;