import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

// Remix Icons
import { RiLoader4Line, RiAlertLine, RiCheckboxCircleLine, RiRefreshLine } from '@remixicon/react';

const IPOSyncControl = () => {
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch the current sync status
  const fetchSyncStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/ipos/sync/status');
      if (response.data && response.data.success) {
        setSyncStatus(response.data.data);
      } else {
        setError(response.data?.error || 'Failed to fetch IPO sync status');
      }
    } catch (err) {
      console.error("Error fetching IPO sync status:", err);
      setError(err.response?.data?.error || err.message || 'An error occurred while fetching sync status.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger a sync with the IPOAlerts.in API
  const triggerSync = async () => {
    setSyncLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiClient.post('/ipos/sync');
      if (response.data && response.data.success) {
        setSuccess(`IPO data synchronized successfully! Added: ${response.data.stats?.added || 0}, Updated: ${response.data.stats?.updated || 0}`);
        // Refresh the status after successful sync
        fetchSyncStatus();
      } else {
        setError(response.data?.error || 'Failed to sync IPO data');
      }
    } catch (err) {
      console.error("Error syncing IPO data:", err);
      setError(err.response?.data?.error || err.message || 'An error occurred while syncing IPO data.');
    } finally {
      setSyncLoading(false);
    }
  };

  // Fetch status on component mount
  useEffect(() => {
    fetchSyncStatus();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real-Time IPO Data Sync</h2>
      
      {loading && (
        <div className="flex justify-center items-center py-4">
          <RiLoader4Line size={24} className="animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading sync status...</span>
        </div>
      )}
      
      {error && (
        <div className="mt-2 p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-md flex items-center" role="alert">
          <RiAlertLine size={20} className="mr-2"/>
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-2 p-3 text-sm text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded-md flex items-center" role="alert">
          <RiCheckboxCircleLine size={20} className="mr-2"/>
          {success}
        </div>
      )}
      
      {!loading && syncStatus && (
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Provider</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{syncStatus.provider}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Sync</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{syncStatus.status}</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <button 
          onClick={triggerSync} 
          disabled={syncLoading}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {syncLoading ? (
            <>
              <RiLoader4Line size={20} className="animate-spin mr-2" />
              Syncing...
            </>
          ) : (
            <>
              <RiRefreshLine size={20} className="mr-2" />
              Sync IPO Data
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default IPOSyncControl;
