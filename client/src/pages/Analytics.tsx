import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { AnalyticsData, Threat } from '@shared/schema';

export function Analytics() {
  const { data: analyticsData = [], isLoading: analyticsLoading } = useQuery<AnalyticsData[]>({
    queryKey: ['/api/analytics']
  });

  const { data: threats = [], isLoading: threatsLoading } = useQuery<Threat[]>({
    queryKey: ['/api/threats']
  });

  if (analyticsLoading || threatsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate summary metrics
  const totalThreats = analyticsData.reduce((sum, item) => sum + item.threats, 0);
  const totalIncidents = analyticsData.reduce((sum, item) => sum + item.incidents, 0);
  const totalResolved = analyticsData.reduce((sum, item) => sum + item.resolved, 0);
  const totalPending = analyticsData.reduce((sum, item) => sum + item.pending, 0);
  const resolutionRate = totalIncidents > 0 ? ((totalResolved / totalIncidents) * 100).toFixed(1) : '0';

  // Prepare chart data
  const monthlyData = analyticsData.map(item => ({
    ...item,
    month: new Date(item.date + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }));

  // Threat severity distribution
  const severityData = [
    { name: 'Critical', value: threats.filter(t => t.severity === 'critical').length, color: '#dc2626' },
    { name: 'High', value: threats.filter(t => t.severity === 'high').length, color: '#ea580c' },
    { name: 'Medium', value: threats.filter(t => t.severity === 'medium').length, color: '#ca8a04' },
    { name: 'Low', value: threats.filter(t => t.severity === 'low').length, color: '#16a34a' },
  ];

  // Category distribution
  const categoryData = Object.entries(
    threats.reduce((acc, threat) => {
      acc[threat.category] = (acc[threat.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const stats = [
    {
      name: 'Total Threats',
      value: totalThreats,
      change: '+12%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      name: 'Incidents',
      value: totalIncidents,
      change: '+8%',
      trend: 'up',
      icon: Activity,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      name: 'Resolved',
      value: totalResolved,
      change: '+15%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      name: 'Resolution Rate',
      value: `${resolutionRate}%`,
      change: '+3%',
      trend: 'up',
      icon: Shield,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <BarChart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Security Analytics</h1>
              <p className="text-purple-100 mt-2">
                Comprehensive insights into your cybersecurity posture
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Security Trends
            </h2>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs text-gray-600 dark:text-gray-400"
                />
                <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  name="Threats"
                />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#ea580c" 
                  strokeWidth={2}
                  name="Incidents"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Threat Severity Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Threat Severity Distribution
            </h2>
            <AlertTriangle className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Incident Resolution Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Incident Resolution
            </h2>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs text-gray-600 dark:text-gray-400"
                />
                <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="resolved" fill="#16a34a" name="Resolved" />
                <Bar dataKey="pending" fill="#ea580c" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Threat Categories
            </h2>
            <Shield className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-blue-${(index % 3 + 3) * 200}`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-blue-${(index % 3 + 3) * 200} h-2 rounded-full`}
                      style={{ width: `${(category.value / Math.max(...categoryData.map(c => c.value))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white w-8 text-right">
                    {category.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Security Score</h3>
              <p className="text-3xl font-bold mt-2">87%</p>
              <p className="text-green-100 text-sm mt-1">
                Based on threat resolution and prevention
              </p>
            </div>
            <Shield className="w-12 h-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Average Response Time</h3>
              <p className="text-3xl font-bold mt-2">2.4h</p>
              <p className="text-blue-100 text-sm mt-1">
                From detection to initial response
              </p>
            </div>
            <Activity className="w-12 h-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Risk Reduction</h3>
              <p className="text-3xl font-bold mt-2">45%</p>
              <p className="text-purple-100 text-sm mt-1">
                Compared to last quarter
              </p>
            </div>
            <TrendingDown className="w-12 h-12 text-purple-200" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}