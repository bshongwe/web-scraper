import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = isLogin 
        ? await login(email, password)
        : await register(email, password);

      if (!success) {
        setError(isLogin ? 'Invalid credentials' : 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          {isLogin ? 'Welcome back!' : 'Get started with web scraping'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isLogin ? 'Signing in...' : 'Creating account...'}
            </div>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setEmail('');
            setPassword('');
          }}
          className="mt-3 w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          {isLogin ? 'Create new account' : 'Sign in instead'}
        </button>
      </div>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600 mb-2">
          <strong>Demo credentials:</strong>
        </p>
        <p className="text-xs text-gray-600">
          Email: demo@example.com<br />
          Password: demo123
        </p>
      </div>
    </div>
  );
}
