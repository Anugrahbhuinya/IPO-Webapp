import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext'; // Import useAuth to check login status

// Remix Icons (Example)
import { RiLoader4Line, RiAlertLine, RiInformationLine, RiShoppingCartLine } from '@remixicon/react';

// Accept socket instance as a prop
const UpcomingIPOList = ({ socket }) => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyError, setBuyError] = useState({}); // Error state per IPO
  const [buyLoading, setBuyLoading] = useState(null); // Track which IPO is being bought
  const [buySuccess, setBuySuccess] = useState({}); // Success state per IPO
  const { isAuthenticated } = useAuth(); // Check if user is logged in

  const fetchUpcomingIPOs = useCallback(async () => {
    // Don't reset loading to true on refetch triggered by socket
    // setLoading(true); 
    setError(null);
    try {
      // Fetch both upcoming and open IPOs for this component now
      const response = await apiClient.get('/ipos?status=upcoming,open'); 
      if (response.data && response.data.success) {
        setIpos(response.data.data);
      } else {
        setError('Failed to fetch upcoming/open IPOs');
      }
    } catch (err) {
      console.error("Error fetching upcoming/open IPOs:", err);
      setError(err.response?.data?.error || err.message || 'An error occurred while fetching IPOs.');
    } finally {
      setLoading(false); // Set loading false after initial fetch or refetch
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchUpcomingIPOs();

    // Set up Socket.IO listener
    if (socket) {
      const handleIPOUpdate = () => {
        console.log('Received ipoUpdate event, refetching IPOs...');
        fetchUpcomingIPOs(); // Refetch data when update event is received
      };

      socket.on('ipoUpdate', handleIPOUpdate);

      // Clean up listener on component unmount
      return () => {
        socket.off('ipoUpdate', handleIPOUpdate);
      };
    }
  }, [socket, fetchUpcomingIPOs]); // Add fetchUpcomingIPOs to dependency array

  const handleBuy = async (ipoId, sharesToBuy, symbol) => {
    const numShares = parseInt(sharesToBuy, 10);
    if (isNaN(numShares) || numShares <= 0) {
      setBuyError(prev => ({ ...prev, [ipoId]: `Invalid number of shares for ${symbol}.` }));
      setBuySuccess(prev => ({ ...prev, [ipoId]: null })); // Clear success message
      return;
    }

    setBuyLoading(ipoId);
    setBuyError(prev => ({ ...prev, [ipoId]: null })); // Clear previous error
    setBuySuccess(prev => ({ ...prev, [ipoId]: null })); // Clear previous success

    try {
      const response = await apiClient.post(`/portfolio/buy/${ipoId}`, { shares: numShares });
      if (response.data && response.data.success) {
        setBuySuccess(prev => ({ ...prev, [ipoId]: `Successfully bought ${numShares} share(s) of ${symbol}!` }));
        // Optionally trigger a portfolio refresh if needed elsewhere
      } else {
        setBuyError(prev => ({ ...prev, [ipoId]: response.data?.error || `Failed to buy ${symbol}.` }));
      }
    } catch (err) {
      console.error("Error buying IPO:", err);
      setBuyError(prev => ({ ...prev, [ipoId]: err.response?.data?.error || `An error occurred while buying ${symbol}.` }));
    } finally {
      setBuyLoading(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6 flex-grow min-w-[300px]">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available IPOs (Upcoming & Open)</h3>
      
      {loading && (
        <div className="flex justify-center items-center py-4">
          <RiLoader4Line size={24} className="animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      )}
      
      {error && (
        <div className="mt-2 p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-md flex items-center" role="alert">
          <RiAlertLine size={20} className="mr-2"/>
          {error}
        </div>
      )}
      
      {!loading && !error && ipos.length === 0 && (
        <div className="mt-2 p-3 text-sm text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-md flex items-center" role="alert">
           <RiInformationLine size={20} className="mr-2"/>
           No upcoming or open IPOs found.
        </div>
      )}
      
      {!loading && !error && ipos.length > 0 && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {ipos.map(ipo => (
            <li key={ipo._id} className="py-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                {/* IPO Info */}
                <div className='mb-3 sm:mb-0'>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{ipo.companyName} ({ipo.symbol})</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Date: {new Date(ipo.ipoDate).toLocaleDateString()} | Price: ₹{ipo.priceRangeLow}{ipo.priceRangeHigh && ipo.priceRangeLow !== ipo.priceRangeHigh ? ` - ₹${ipo.priceRangeHigh}` : ''}
                  </p>
                   <p className="text-xs text-gray-500 dark:text-gray-400">
                     Status: <span className={`capitalize px-1.5 py-0.5 rounded text-xs ${ipo.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>{ipo.status}</span>
                  </p>
                </div>

                {/* Buy Action (Only if logged in and IPO is open/upcoming) */}
                {isAuthenticated && ['upcoming', 'open'].includes(ipo.status) && (
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <input 
                      type="number" 
                      min="1" 
                      defaultValue="1" 
                      id={`buy-shares-${ipo._id}`} 
                      className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                      aria-label={`Shares to buy for ${ipo.symbol}`}
                    />
                    <button 
                      onClick={() => handleBuy(ipo._id, document.getElementById(`buy-shares-${ipo._id}`).value, ipo.symbol)}
                      disabled={buyLoading === ipo._id}
                      className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {buyLoading === ipo._id ? <RiLoader4Line size={16} className="animate-spin mr-1" /> : <RiShoppingCartLine size={16} className="mr-1"/>}
                      Buy
                    </button>
                  </div>
                )}
              </div>
              {/* Buy Feedback Area */}
              {buyError[ipo._id] && (
                 <div className="mt-2 p-2 text-xs text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-md flex items-center">
                    <RiAlertLine size={14} className="mr-1 flex-shrink-0"/> {buyError[ipo._id]}
                 </div>
              )}
              {buySuccess[ipo._id] && (
                 <div className="mt-2 p-2 text-xs text-green-700 bg-green-100 dark:bg-green-900/50 dark:text-green-300 rounded-md flex items-center">
                    <RiInformationLine size={14} className="mr-1 flex-shrink-0"/> {buySuccess[ipo._id]}
                 </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpcomingIPOList;

