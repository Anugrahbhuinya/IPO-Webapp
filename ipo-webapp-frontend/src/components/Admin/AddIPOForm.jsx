import React, { useState } from 'react';
import apiClient from '../../services/api';

// Remix Icons
import { RiLoader4Line, RiAlertLine, RiCheckboxCircleLine } from '@remixicon/react';

const AddIPOForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    symbol: '',
    ipoDate: '',
    priceRangeLow: '',
    priceRangeHigh: '',
    sharesOffered: '',
    status: 'upcoming', // Default status
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Retrieve token (assuming it's stored after login)
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      // Prepare data, converting numbers and date
      const dataToSend = {
        ...formData,
        priceRangeLow: parseFloat(formData.priceRangeLow) || 0,
        priceRangeHigh: parseFloat(formData.priceRangeHigh) || 0,
        sharesOffered: parseInt(formData.sharesOffered, 10) || 0,
        ipoDate: formData.ipoDate ? new Date(formData.ipoDate).toISOString() : null,
      };

      const response = await apiClient.post('/ipos', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        setSuccess('IPO added successfully!');
        // Clear form
        setFormData({
          companyName: '',
          symbol: '',
          ipoDate: '',
          priceRangeLow: '',
          priceRangeHigh: '',
          sharesOffered: '',
          status: 'upcoming',
          description: '',
        });
      } else {
        setError(response.data?.errors?.[0]?.msg || response.data?.error || 'Failed to add IPO');
      }
    } catch (err) {
      console.error("Error adding IPO:", err);
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error;
      setError(backendError || err.message || 'An error occurred while adding the IPO.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Add New IPO</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-md flex items-center" role="alert">
            <RiAlertLine size={20} className="mr-2"/>
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded-md flex items-center" role="alert">
            <RiCheckboxCircleLine size={20} className="mr-2"/>
            {success}
          </div>
        )}

        {/* Form Fields */} 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
            <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label htmlFor="symbol" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Symbol</label>
            <input type="text" name="symbol" id="symbol" value={formData.symbol} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label htmlFor="ipoDate" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">IPO Date</label>
            <input type="date" name="ipoDate" id="ipoDate" value={formData.ipoDate} onChange={handleChange} required className="input-field" />
          </div>
           <div>
            <label htmlFor="status" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} required className="input-field">
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="past">Past</option>
            </select>
          </div>
          <div>
            <label htmlFor="priceRangeLow" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Price Range (Low)</label>
            <input type="number" step="0.01" name="priceRangeLow" id="priceRangeLow" value={formData.priceRangeLow} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label htmlFor="priceRangeHigh" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Price Range (High)</label>
            <input type="number" step="0.01" name="priceRangeHigh" id="priceRangeHigh" value={formData.priceRangeHigh} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label htmlFor="sharesOffered" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Shares Offered</label>
            <input type="number" name="sharesOffered" id="sharesOffered" value={formData.sharesOffered} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className="input-field"></textarea>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <RiLoader4Line size={20} className="animate-spin mr-2" />
                Adding...
              </>
            ) : 'Add IPO'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper CSS for input fields (add to index.css or keep here if specific)
const styles = `
.input-field {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
}
`;
// Inject styles (or move to index.css and import @tailwind components)
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default AddIPOForm;

