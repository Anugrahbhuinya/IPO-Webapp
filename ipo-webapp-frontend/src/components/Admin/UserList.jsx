import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { RiLoader4Line } from '@remixicon/react'; // Import loader icon

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useAuth(); // Get token for authenticated request

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authToken) {
        setError('Authentication required.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // Use apiClient which should have the token set in headers via AuthContext
        const response = await apiClient.get('/users'); 
        if (response.data && response.data.success) {
          setUsers(response.data.data);
        } else {
          setError(response.data?.error || 'Failed to fetch users.');
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.error || 'An error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authToken]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Registered Users</h2>
      {loading && (
        <div className="flex justify-center items-center py-4">
          <RiLoader4Line size={24} className="animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading users...</span>
        </div>
      )}
      {error && (
        <div className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-sm">
          Error: {error}
        </div>
      )}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                        {user.role}
                      </span>
                    </td>
                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {user._id}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;

