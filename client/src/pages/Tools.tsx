import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Search, 
  Activity, 
  AlertTriangle, 
  Eye, 
  Lock,
  Zap,
  CheckCircle,
  XCircle,
  Copy,
  Download
} from 'lucide-react';
import { Tool } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';

export function Tools() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [scanTarget, setScanTarget] = useState('');
  const [passwordResult, setPasswordResult] = useState<any>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  const { data: tools = [], isLoading } = useQuery<Tool[]>({
    queryKey: ['/api/tools']
  });

  const passwordCheckMutation = useMutation({
    mutationFn: (password: string) => apiRequest('/api/tools/password-check', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
    onSuccess: (data) => setPasswordResult(data),
  });

  const vulnerabilityScanMutation = useMutation({
    mutationFn: (target: string) => apiRequest('/api/tools/vulnerability-scan', {
      method: 'POST',
      body: JSON.stringify({ target }),
    }),
    onSuccess: (data) => setScanResult(data),
  });

  const iconMap: { [key: string]: any } = {
    Shield,
    Search,
    Activity,
    AlertTriangle,
    Eye,
    Lock,
    Zap,
  };

  const handlePasswordCheck = () => {
    if (passwordInput.trim()) {
      passwordCheckMutation.mutate(passwordInput);
    }
  };

  const handleVulnerabilityScan = () => {
    if (scanTarget.trim()) {
      vulnerabilityScanMutation.mutate(scanTarget);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Security Tools</h1>
            <p className="text-green-100 mt-2">
              Comprehensive cybersecurity tools for threat detection and analysis
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => {
          const IconComponent = iconMap[tool.icon] || Shield;
          const isActive = activeToolId === tool.id;
          
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-2 transition-all cursor-pointer ${
                isActive 
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setActiveToolId(isActive ? null : tool.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${tool.isActive ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <IconComponent className={`w-6 h-6 ${tool.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tool.category}
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${tool.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {tool.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Features:</h4>
                <ul className="space-y-1">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Strength Checker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Password Strength Checker
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Password to Analyze
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your password..."
              />
            </div>
            
            <button
              onClick={handlePasswordCheck}
              disabled={passwordCheckMutation.isPending || !passwordInput.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {passwordCheckMutation.isPending ? 'Analyzing...' : 'Check Password Strength'}
            </button>
            
            {passwordResult && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900 dark:text-white">Strength:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    passwordResult.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    passwordResult.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    passwordResult.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {passwordResult.strength}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {Object.entries(passwordResult.checks).map(([check, passed]) => (
                    <div key={check} className="flex items-center">
                      {passed ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {check.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
                
                {passwordResult.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {passwordResult.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Vulnerability Scanner */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Vulnerability Scanner
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target URL or IP Address
              </label>
              <input
                type="text"
                value={scanTarget}
                onChange={(e) => setScanTarget(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com or 192.168.1.1"
              />
            </div>
            
            <button
              onClick={handleVulnerabilityScan}
              disabled={vulnerabilityScanMutation.isPending || !scanTarget.trim()}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {vulnerabilityScanMutation.isPending ? 'Scanning...' : 'Start Vulnerability Scan'}
            </button>
            
            {scanResult && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Scan Results</h4>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {scanResult.summary.total}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {scanResult.summary.high}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {scanResult.summary.medium}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {scanResult.summary.low}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Low</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {scanResult.vulnerabilities.map((vuln: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white dark:bg-gray-600 rounded border-l-4 border-red-500">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {vuln.title}
                        </h5>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          vuln.severity === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          vuln.severity === 'Medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {vuln.description}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        CVE: {vuln.id} | Risk Score: {vuln.risk}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}