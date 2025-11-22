import { useState } from 'react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useTheme } from '../components/ThemeProvider';

export default function Home() {
  const [url, setUrl] = useState('');
  const [res, setRes] = useState(null as any);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'scrape' | 'results' | 'status' | 'about'>('scrape');
  const [results, setResults] = useState<any[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  async function submit() {
    if (!url.trim()) return;
    
    setLoading(true);
    try {
      const r = await fetch('http://localhost:4000/api/jobs/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        credentials: 'include'
      });
      const j = await r.json();
      setRes(j);
      setUrl(''); // Clear form on success
    } catch (error) {
      setRes({ error: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  }

  async function fetchResults() {
    try {
      const r = await fetch('http://localhost:4000/api/jobs/results');
      const data = await r.json();
      setResults(data);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    }
  }

  // Load results when switching to results tab
  const handleTabChange = (tab: 'scrape' | 'results' | 'status' | 'about') => {
    setActiveTab(tab);
    if (tab === 'results') {
      fetchResults();
    }
  };

  const sidebarItems = [
    { id: 'scrape', label: 'New Scrape', icon: '🚀', description: 'Schedule new scraping jobs' },
    { id: 'results', label: 'Results', icon: '📊', description: 'View scraped content' },
    { id: 'status', label: 'Job Status', icon: '⏱️', description: 'Monitor job progress' },
    { id: 'about', label: 'About', icon: 'ℹ️', description: 'System information' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">🕷️ Web Scraper</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={sidebarCollapsed ? "M13 7l5 5-5 5M6 12h12" : "M11 17l-5-5 5-5M18 12H6"} />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-8">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                className={`${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                } group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-sm`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                  </div>
                )}
                {sidebarCollapsed && activeTab === item.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p><strong>Status:</strong> All systems operational</p>
              <p><strong>Queue:</strong> {results.length} jobs processed</p>
              <p><strong>Version:</strong> 1.0.0</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16">
          <div className="h-full px-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {sidebarItems.find(item => item.id === activeTab)?.description || ''}
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Playwright & Next.js
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto fade-in">
          {/* Content based on active tab */}

        {/* Tab Content */}
        {activeTab === 'scrape' && (
          <Card className="shadow-lg">
            <CardContent className="py-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Scraping Job</h2>
                <p className="text-gray-600">Enter a URL to scrape web content</p>
              </div>

              <div className="space-y-6">
              <Input
                id="url"
                label="Website URL"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="text-lg"
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                icon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                }
              />

              {/* Quick Examples */}
              <div>
                <p className="text-sm text-gray-700 mb-2">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {['https://example.com', 'https://httpbin.org/html', 'https://quotes.toscrape.com/'].map(example => (
                    <button
                      key={example}
                      onClick={() => setUrl(example)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={submit}
                disabled={loading || !url.trim()}
                loading={loading}
                size="lg"
                className="w-full"
              >
                {loading ? 'Scheduling Job...' : 'Schedule Scraping Job'}
              </Button>
              </div>

              {/* Result Display */}
              {res && (
                <div className={`mt-6 p-4 rounded-md ${res.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                  <h3 className={`text-sm font-medium ${res.error ? 'text-red-800' : 'text-green-800'}`}>
                    {res.error ? 'Error' : 'Success!'}
                  </h3>
                  <pre className={`mt-2 text-sm ${res.error ? 'text-red-700' : 'text-green-700'}`}>
                    {JSON.stringify(res, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'results' && (
          <Card className="shadow-lg">
            <CardContent className="py-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Scraping Results</h2>
                  <p className="text-gray-600">{results.length} total results</p>
                </div>
                <Button onClick={fetchResults} variant="primary">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No results yet. Schedule some scraping jobs!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result: any) => (
                  <div key={result.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:shadow-md hover:border-gray-300 transition-all duration-200 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{result.url}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(result.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {result.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-500">
                        View Full Content
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-64">
                        {result.content}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            )}
            </CardContent>
          </Card>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <Card className="shadow-lg">
            <CardContent className="py-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Status Monitor</h2>
                <p className="text-gray-600">Track the progress of your scraping jobs</p>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800">Total Jobs</h3>
                <p className="text-2xl font-bold text-blue-900">12</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800">Completed</h3>
                <p className="text-2xl font-bold text-green-900">10</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800">Processing</h3>
                <p className="text-2xl font-bold text-yellow-900">2</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Job #10</p>
                    <p className="text-sm text-gray-600">https://example.com</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Job #11</p>
                    <p className="text-sm text-gray-600">https://httpbin.org/html</p>
                  </div>
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Processing</span>
                  </div>
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <Card className="shadow-lg">
            <CardContent className="py-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">About Web Scraper</h2>
                <p className="text-gray-600">System information and architecture details</p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Technology Stack</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <strong>Frontend:</strong> Next.js + React + TypeScript
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <strong>Backend:</strong> Express.js + Prisma + PostgreSQL
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    <strong>Queue:</strong> BullMQ + Redis
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <strong>Scraper:</strong> Python + Playwright + FastAPI
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                    <strong>Infrastructure:</strong> Docker + Docker Compose
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-sm">
                  <li>✅ JavaScript-heavy site support via Playwright</li>
                  <li>✅ Background job processing with queues</li>
                  <li>✅ Real-time job status monitoring</li>
                  <li>✅ Containerized deployment</li>
                  <li>✅ RESTful API with authentication</li>
                  <li>✅ Modern responsive UI</li>
                  <li>✅ Database persistence</li>
                  <li>✅ CI/CD pipeline integration</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Data Flow</h4>
              <p className="text-sm text-gray-700">
                Frontend → API → Redis Queue → Worker → Python Scraper → Database → Results
              </p>
            </div>
            </CardContent>
          </Card>
        )}

        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .transition-colors {
          transition-property: color, background-color, border-color;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </div>
  );
}
