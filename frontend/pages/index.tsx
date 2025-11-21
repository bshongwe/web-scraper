import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [res, setRes] = useState(null as any);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'scrape' | 'results'>('scrape');
  const [results, setResults] = useState<any[]>([]);

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
  const handleTabChange = (tab: 'scrape' | 'results') => {
    setActiveTab(tab);
    if (tab === 'results') {
      fetchResults();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">🕷️ Web Scraper</h1>
            <div className="text-sm text-gray-600">
              Powered by Playwright & Next.js
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('scrape')}
                className={`${
                  activeTab === 'scrape'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>🚀</span>
                <span>New Scrape</span>
              </button>
              <button
                onClick={() => handleTabChange('results')}
                className={`${
                  activeTab === 'results'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>📊</span>
                <span>Results</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'scrape' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Scraping Job</h2>
              <p className="text-gray-600">Enter a URL to scrape web content</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  id="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
              </div>

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

              <button
                onClick={submit}
                disabled={loading || !url.trim()}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Scheduling Job...
                  </>
                ) : (
                  'Schedule Scraping Job'
                )}
              </button>
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
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Scraping Results</h2>
                <p className="text-gray-600">{results.length} total results</p>
              </div>
              <button
                onClick={fetchResults}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No results yet. Schedule some scraping jobs!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result: any) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
          </div>
        )}
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
