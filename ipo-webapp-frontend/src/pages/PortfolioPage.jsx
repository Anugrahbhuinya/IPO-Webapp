import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RiLoader4Line, RiErrorWarningLine, RiWallet3Line, RiStockLine, RiDeleteBinLine } from '@remixicon/react';

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellError, setSellError] = useState(null);
  const [sellLoading, setSellLoading] = useState(null); // Track which holding is being sold
  const { user } = useAuth(); // Get user info if needed

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSellError(null);
      const response = await apiClient.get('/portfolio');
      if (response.data && response.data.success) {
        setPortfolio(response.data.data);
      } else {
        setError(response.data?.error || 'Failed to fetch portfolio.');
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError(err.response?.data?.error || 'An error occurred while fetching portfolio.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleSell = async (holdingId, sharesToSell, symbol) => {
    // Basic validation - ensure sharesToSell is a positive number
    const numShares = parseInt(sharesToSell, 10);
    if (isNaN(numShares) || numShares <= 0) {
      setSellError(`Invalid number of shares to sell for ${symbol}.`);
      return;
    }

    if (window.confirm(`Are you sure you want to sell ${numShares} share(s) of ${symbol}?`)) {
      setSellLoading(holdingId);
      setSellError(null);
      try {
        const response = await apiClient.post(`/portfolio/sell/${holdingId}`, { shares: numShares });
        if (response.data && response.data.success) {
          // Refresh portfolio data after successful sale
          fetchPortfolio(); 
          // Optionally show a success message
        } else {
          setSellError(response.data?.error || `Failed to sell ${symbol}.`);
        }
      } catch (err) {
        console.error("Error selling holding:", err);
        setSellError(err.response?.data?.error || `An error occurred while selling ${symbol}.`);
      } finally {
        setSellLoading(null);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Portfolio</h1>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <RiLoader4Line size={32} className="animate-spin text-blue-500" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading Portfolio...</span>
        </div>
      )}

      {error && (
        <div className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-md text-sm mb-6 flex items-center">
          <RiErrorWarningLine className="inline mr-2" size={20}/> Error loading portfolio: {error}
        </div>
      )}

      {!loading && !error && portfolio && (
        <div>
          {/* Balance Section */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <RiWallet3Line className="mr-2 text-green-500" size={24}/> Virtual Balance
            </h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{portfolio.virtualBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>

          {/* Holdings Section */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <RiStockLine className="mr-2 text-blue-500" size={24}/> My Holdings
            </h2>
            
            {sellError && (
              <div className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-sm mb-4 flex items-center">
                <RiErrorWarningLine className="inline mr-2" size={18}/> Error: {sellError}
              </div>
            )}

            {portfolio.holdings && portfolio.holdings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shares Held</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Price/Share</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {portfolio.holdings.map((holding) => (
                      <tr key={holding._id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{holding.ipoCompanyName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{holding.ipoSymbol}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{holding.shares}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{holding.purchasePrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="number" 
                              min="1" 
                              max={holding.shares} 
                              defaultValue="1" 
                              id={`sell-shares-${holding._id}`} 
                              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                              aria-label={`Shares to sell for ${holding.ipoSymbol}`}
                            />
                            <button 
                              onClick={() => handleSell(holding._id, document.getElementById(`sell-shares-${holding._id}`).value, holding.ipoSymbol)}
                              disabled={sellLoading === holding._id}
                              className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {sellLoading === holding._id ? <RiLoader4Line size={14} className="animate-spin mr-1" /> : <RiDeleteBinLine size={14} className="mr-1"/>}
                              Sell
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6">You do not have any holdings yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;

