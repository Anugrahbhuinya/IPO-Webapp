import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { RiLoader4Line, RiPencilLine, RiDeleteBinLine, RiErrorWarningLine } from '@remixicon/react'; // Import icons

// Placeholder for Edit Modal - to be implemented later
// const EditIPOModal = ({ ipo, onClose, onSave }) => { ... };

const AdminIPOList = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useAuth(); // Get token for authenticated requests
  // const [editingIPO, setEditingIPO] = useState(null); // State for edit modal

  const fetchIPOs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/ipos'); // Fetch all IPOs
      if (response.data && response.data.success) {
        setIpos(response.data.data);
      } else {
        setError(response.data?.error || 'Failed to fetch IPOs.');
      }
    } catch (err) {
      console.error("Error fetching IPOs:", err);
      setError(err.response?.data?.error || 'An error occurred while fetching IPOs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIPOs();
    // Add Socket.IO listener if needed to refresh list on updates from other admins
    // socket.on('ipoUpdate', fetchIPOs);
    // return () => socket.off('ipoUpdate', fetchIPOs);
  }, [fetchIPOs]);

  const handleDelete = async (ipoId, ipoName) => {
    if (window.confirm(`Are you sure you want to delete the IPO: ${ipoName}?`)) {
      try {
        setError(null);
        // Ensure API client has the auth token set
        const response = await apiClient.delete(`/ipos/${ipoId}`);
        if (response.data && response.data.success) {
          // Refresh the list after successful deletion
          fetchIPOs(); 
          // Optionally show a success message
        } else {
          setError(response.data?.error || 'Failed to delete IPO.');
        }
      } catch (err) {
        console.error("Error deleting IPO:", err);
        setError(err.response?.data?.error || 'An error occurred while deleting the IPO.');
      }
    }
  };

  // const handleEdit = (ipo) => {
  //   setEditingIPO(ipo);
  // };

  // const handleSaveEdit = async (updatedData) => {
  //   // Call PUT /api/ipos/:id endpoint
  //   // ... handle response ...
  //   setEditingIPO(null);
  //   fetchIPOs();
  // };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Manage IPOs</h2>
      {loading && (
        <div className="flex justify-center items-center py-4">
          <RiLoader4Line size={24} className="animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading IPOs...</span>
        </div>
      )}
      {error && (
        <div className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-sm mb-4 flex items-center">
          <RiErrorWarningLine className="inline mr-2" size={18}/> Error: {error}
        </div>
      )}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {ipos.length > 0 ? (
                ipos.map((ipo) => (
                  <tr key={ipo._id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{ipo.companyName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ipo.symbol}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(ipo.ipoDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ipo.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : ipo.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'}`}>
                        {ipo.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        // onClick={() => handleEdit(ipo)}
                        title="Edit IPO" 
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 disabled:opacity-50"
                        disabled // Enable when edit functionality is added
                      >
                        <RiPencilLine size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(ipo._id, ipo.companyName)}
                        title="Delete IPO"
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No IPOs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* {editingIPO && <EditIPOModal ipo={editingIPO} onClose={() => setEditingIPO(null)} onSave={handleSaveEdit} />} */}
    </div>
  );
};

export default AdminIPOList;

