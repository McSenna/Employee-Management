import React, { useState, useEffect } from 'react';
import { Filter, Eye, EyeOff, Calendar, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HrDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
  });
  const [detailsVisible, setDetailsVisible] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [theme, setTheme] = useState('blue');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost/employee-management-system/backend/api.php?action=fetch_logs';
      if (dateFilter.startDate) {
        url += `&start_date=${dateFilter.startDate}`;
      }
      if (dateFilter.endDate) {
        url += `&end_date=${dateFilter.endDate}`;
      }
      const response = await axios.get(url);
      const logData = Array.isArray(response.data) ? response.data : [];
      setLogs(logData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch logs. Please try again later.');
      setLoading(false);
      console.error('Error fetching logs:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getActionCategories = () => {
    const categories = new Set();
    logs.forEach((log) => {
      const actionParts = log.action.toLowerCase().split(' ');
      if (actionParts.length > 0) {
        categories.add(actionParts[0]);
      }
    });
    return ['all', ...Array.from(categories)];
  };

  const filterLogsByAction = (logs) => {
    if (filter === 'all') return logs;
    return logs.filter((log) => {
      const actionLower = log.action.toLowerCase();
      return (
        actionLower.startsWith(filter.toLowerCase()) ||
        actionLower.includes(filter.toLowerCase())
      );
    });
  };

  const toggleDetails = (logId) => {
    setDetailsVisible((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }));
  };

  const renderDetails = (details) => {
    if (!details) return null;
    if (typeof details === 'string') {
      return <p className="text-sm text-gray-600">{details}</p>;
    } else if (typeof details === 'object') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase">{key.replace(/_/g, ' ')}</span>
              <span className="text-sm">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return <p className="text-sm text-gray-600">{JSON.stringify(details)}</p>;
  };

  const applyDateFilters = () => {
    fetchLogs();
  };

  const resetFilters = () => {
    setFilter('all');
    setDateFilter({
      startDate: '',
      endDate: '',
    });
    fetchLogs();
  };

  const getActionBadgeClass = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return 'bg-emerald-100 text-emerald-800';
    if (actionLower.includes('add') || actionLower.includes('creat')) return 'bg-blue-100 text-blue-800';
    if (actionLower.includes('delete')) return 'bg-red-100 text-red-800';
    if (actionLower.includes('fail')) return 'bg-amber-100 text-amber-800';
    if (actionLower.includes('update')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'blue':
        return {
          primary: 'bg-blue-600',
          secondary: 'bg-blue-500',
          header: 'bg-gradient-to-r from-blue-700 to-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700',
          accent: 'text-blue-600',
        };
      case 'purple':
        return {
          primary: 'bg-purple-600',
          secondary: 'bg-purple-500',
          header: 'bg-gradient-to-r from-purple-700 to-purple-500',
          button: 'bg-purple-600 hover:bg-purple-700',
          accent: 'text-purple-600',
        };
      case 'green':
        return {
          primary: 'bg-emerald-600',
          secondary: 'bg-emerald-500',
          header: 'bg-gradient-to-r from-emerald-700 to-emerald-500',
          button: 'bg-emerald-600 hover:bg-emerald-700',
          accent: 'text-emerald-600',
        };
      default:
        return {
          primary: 'bg-blue-600',
          secondary: 'bg-blue-500',
          header: 'bg-gradient-to-r from-blue-700 to-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700',
          accent: 'text-blue-600',
        };
    }
  };

  const themeClasses = getThemeClasses();

  // Prepare data for the bar chart
  const getChartData = () => {
    const filteredLogs = filterLogsByAction(logs);
    const actionCounts = {
      login: 0,
      add: 0,
      update: 0,
      delete: 0,
    };

    filteredLogs.forEach((log) => {
      const actionLower = log.action.toLowerCase();
      if (actionLower.includes('login')) actionCounts.login++;
      else if (actionLower.includes('add') || actionLower.includes('creat')) actionCounts.add++;
      else if (actionLower.includes('update')) actionCounts.update++;
      else if (actionLower.includes('delete')) actionCounts.delete++;
    });

    return {
      labels: ['Login', 'Add', 'Update', 'Delete'],
      datasets: [
        {
          label: 'Log Actions',
          data: [actionCounts.login, actionCounts.add, actionCounts.update, actionCounts.delete],
          backgroundColor: [
            'rgba(16, 185, 129, 0.5)', // emerald
            'rgba(59, 130, 246, 0.5)', // blue
            'rgba(168, 85, 247, 0.5)', // purple
            'rgba(239, 68, 68, 0.5)', // red
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Log Action Distribution', font: { size: 16 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Actions' },
      },
      x: {
        title: { display: true, text: 'Action Type' },
      },
    },
  };

  const filteredLogs = filterLogsByAction(logs);

  return (
    <div className="font-sans bg-gray-50 max-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-medium text-gray-700">Log Filters</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
            >
              {showFilters ? <EyeOff size={16} /> : <Eye size={16} />}
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          {showFilters && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="action-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Action Type
                </label>
                <select
                  id="action-filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {getActionCategories().map((category, index) => (
                    <option key={index} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3 items-end">
                <button
                  onClick={applyDateFilters}
                  className={`${themeClasses.button} text-white py-2 px-4 rounded-md shadow-sm text-sm`}
                >
                  Apply
                </button>
                <button
                  onClick={resetFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
            <div className="flex items-center">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content: Graph and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-15">
          {/* Left: Graph Section */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Log Action Distribution</h2>
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className={`w-8 h-8 rounded-full border-4 border-gray-200 ${themeClasses.primary} border-t-transparent animate-spin`}></div>
                </div>
              ) : logs.length > 0 ? (
                <Bar data={getChartData()} options={chartOptions} />
              ) : (
                <p className="text-center text-gray-500">No data available</p>
              )}
            </div>
          </div>

          {/* Right: System Logs Section */}
          <div className="bg-white rounded-lg shadow lg:col-span-2">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">System Logs</h2>
              <button
                onClick={fetchLogs}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border-4 border-gray-200 ${themeClasses.primary} border-t-transparent animate-spin`}></div>
                    <p className="mt-4 text-gray-600">Loading logs...</p>
                  </div>
                </div>
              ) : filteredLogs.length > 0 ? (
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeClass(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(log.created_at)}</span>
                        </div>
                        {log.details && (
                          <button
                            onClick={() => toggleDetails(log.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 border border-gray-300 text-xs rounded-md hover:bg-gray-50 ${
                              detailsVisible[log.id] ? `${themeClasses.accent} border-current` : 'text-gray-700'
                            }`}
                          >
                            {detailsVisible[log.id] ? (
                              <>
                                <EyeOff size={12} />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye size={12} />
                                View
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      {log.details && detailsVisible[log.id] && (
                        <div className="mt-3 bg-gray-50 p-4 rounded-md border border-gray-200">
                          {renderDetails(log.details)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <AlertCircle size={24} className="text-gray-400 mx-auto mb-2" />
                  <p>No logs available for the selected filters</p>
                  <button
                    onClick={resetFilters}
                    className={`mt-4 ${themeClasses.button} text-white py-1 px-4 text-sm rounded-md shadow-sm`}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;