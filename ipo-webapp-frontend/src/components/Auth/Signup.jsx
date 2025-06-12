import React, { useState } from 'react';
import apiClient from '../../services/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      if (response.data && response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        navigate('/'); // Redirect on success
      } else {
        setError(response.data?.errors?.[0]?.msg || response.data?.error || 'Signup failed');
      }
    } catch (err) {
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error;
      setError(backendError || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create your account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-md" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your name
            </label>
            <input
              type="text"
              id="name"
              className={`bg-gray-50 border ${error?.toLowerCase().includes('name') ? 'border-red-500' : 'border-gray-300'} 
              text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your email
            </label>
            <input
              type="email"
              id="signup-email"
              className={`bg-gray-50 border ${error?.toLowerCase().includes('email') ? 'border-red-500' : 'border-gray-300'} 
              text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <input
              type="password"
              id="signup-password"
              placeholder="••••••••"
              className={`bg-gray-50 border ${error?.toLowerCase().includes('password') ? 'border-red-500' : 'border-gray-300'} 
              text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Must be at least 6 characters long.</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              className={`bg-gray-50 border ${error?.toLowerCase().includes('password') ? 'border-red-500' : 'border-gray-300'} 
              text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300
            font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800
            disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Create account'
            )}
          </button>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
            Already have an account?{' '}
            <RouterLink
              to="/login"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Login here
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
