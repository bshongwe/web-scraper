import React, { useState, useEffect } from 'react';

interface Job {
  id: string;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  url?: string;
  progress?: number;
  result?: any;
  error?: string;
  createdAt: Date;
  processedAt?: Date;
}

export default function JobStatus() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'waiting' | 'active' | 'completed' | 'failed'>('all');

  // Mock data for demonstration - in real app this would come from API
  useEffect(() => {
    // Simulate fetching job status from API
    const mockJobs: Job[] = [
      {
        id: '1',
        status: 'completed',
        url: 'https://example.com',
        progress: 100,
        result: { id: 'result_1', content: 'Sample content...' },
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        processedAt: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
      },
      {
        id: '2',
        status: 'active',
        url: 'https://httpbin.org/html',
        progress: 65,
        createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        id: '3',
        status: 'waiting',
        url: 'https://quotes.toscrape.com/',
        progress: 0,
        createdAt: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
      },
      {
        id: '4',
        status: 'failed',
        url: 'https://invalid-domain-example-404.com',
        progress: 0,
        error: 'Failed to connect to host',
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        processedAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      },
    ];

    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'waiting':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'active':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
        );
      case 'completed':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getJobCounts = () => {
    return {
      all: jobs.length,
      waiting: jobs.filter(j => j.status === 'waiting').length,
      active: jobs.filter(j => j.status === 'active').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const counts = getJobCounts();

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Job Status Monitor</h2>
            <p className="text-gray-600">Track the progress of your scraping jobs</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'waiting', label: 'Waiting', count: counts.waiting },
            { key: 'active', label: 'Active', count: counts.active },
            { key: 'completed', label: 'Completed', count: counts.completed },
            { key: 'failed', label: 'Failed', count: counts.failed },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`${
                filter === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              } px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2`}
            >
              <span>{label}</span>
              <span className={`${
                filter === key ? 'bg-gray-200' : 'bg-gray-300'
              } px-2 py-0.5 rounded-full text-xs`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? "Schedule a scraping job to see it here."
              : `No jobs with status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Status Icon */}
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="capitalize">{job.status}</span>
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Job #{job.id}
                      </p>
                      {job.url && (
                        <p className="text-sm text-gray-600 truncate">
                          {job.url}
                        </p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {job.status === 'active' && job.progress !== undefined && (
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500">
                      Created {formatTimeAgo(job.createdAt)}
                    </p>
                    {job.processedAt && (
                      <p className="text-xs text-gray-500">
                        Processed {formatTimeAgo(job.processedAt)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {job.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">
                      <span className="font-medium">Error:</span> {job.error}
                    </p>
                  </div>
                )}

                {/* Success Result Preview */}
                {job.status === 'completed' && job.result && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">✓ Completed:</span> Content scraped successfully
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">ℹ️ Job Status Information</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Waiting:</strong> Job is queued and waiting to be processed</li>
          <li>• <strong>Active:</strong> Job is currently being processed by a worker</li>
          <li>• <strong>Completed:</strong> Job finished successfully - check Results tab</li>
          <li>• <strong>Failed:</strong> Job encountered an error during processing</li>
        </ul>
      </div>
    </div>
  );
}
