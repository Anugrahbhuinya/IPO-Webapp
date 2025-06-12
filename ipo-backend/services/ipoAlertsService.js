const axios = require('axios');
const IPO = require('../models/IPO');

// Base URL for IPOAlerts.in API
const API_BASE_URL = 'https://api.ipoalerts.in/ipos?status=open';

/**
 * Service for interacting with IPOAlerts.in API
 * This service handles fetching real-time IPO data from IPOAlerts.in
 * and synchronizing it with our local database
 */
class IPOAlertsService {
  constructor() {
    // API key should be stored in environment variables
    this.apiKey = process.env.IPO_ALERTS_API_KEY || 'YOUR_API_KEY_HERE';
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Fetch upcoming IPOs from IPOAlerts.in
   * @returns {Promise<Array>} Array of upcoming IPO data
   */
  async fetchUpcomingIPOs() {
    try {
      // This is a placeholder for the actual API endpoint
      // Replace with the correct endpoint based on IPOAlerts.in documentation
      const response = await this.client.get('/ipos/upcoming');
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch upcoming IPOs from IPOAlerts.in');
    } catch (error) {
      console.error('Error fetching from IPOAlerts.in:', error.message);
      
      // If API key is not set or invalid, provide informative error
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid or missing API key for IPOAlerts.in');
      }
      
      // For demo/development, return mock data if API fails
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using mock IPO data as fallback');
        return this.getMockIPOData();
      }
      
      throw error;
    }
  }

  /**
   * Synchronize IPO data from IPOAlerts.in with our database
   * @returns {Promise<Object>} Result of the synchronization
   */
  async syncIPOData() {
    try {
      const externalIPOs = await this.fetchUpcomingIPOs();
      
      // Track statistics for reporting
      const stats = {
        added: 0,
        updated: 0,
        unchanged: 0,
        failed: 0
      };

      // Process each IPO from the external API
      for (const externalIPO of externalIPOs) {
        try {
          // Convert external IPO format to our database format
          const ipoData = this.mapExternalIPOToLocalFormat(externalIPO);
          
          // Check if this IPO already exists in our database (by symbol)
          const existingIPO = await IPO.findOne({ symbol: ipoData.symbol });
          
          if (existingIPO) {
            // Check if data needs updating
            if (this.hasChanges(existingIPO, ipoData)) {
              // Update existing record
              await IPO.findByIdAndUpdate(existingIPO._id, ipoData);
              stats.updated++;
            } else {
              stats.unchanged++;
            }
          } else {
            // Create new IPO record
            await IPO.create(ipoData);
            stats.added++;
          }
        } catch (err) {
          console.error(`Failed to process IPO: ${externalIPO.symbol || 'unknown'}`, err);
          stats.failed++;
        }
      }
      
      return {
        success: true,
        message: 'IPO data synchronized with IPOAlerts.in',
        stats
      };
    } catch (error) {
      console.error('Error synchronizing IPO data:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }

  /**
   * Compare existing IPO record with new data to check for changes
   * @param {Object} existingIPO - Existing IPO document from database
   * @param {Object} newData - New IPO data from external API
   * @returns {Boolean} True if there are changes that need to be updated
   */
  hasChanges(existingIPO, newData) {
    // Compare relevant fields to determine if an update is needed
    return (
      existingIPO.status !== newData.status ||
      existingIPO.ipoDate?.toISOString() !== new Date(newData.ipoDate).toISOString() ||
      existingIPO.priceRangeLow !== newData.priceRangeLow ||
      existingIPO.priceRangeHigh !== newData.priceRangeHigh ||
      existingIPO.sharesOffered !== newData.sharesOffered ||
      existingIPO.description !== newData.description
    );
  }

  /**
   * Map external IPO data format to our database schema
   * @param {Object} externalIPO - IPO data from IPOAlerts.in
   * @returns {Object} IPO data formatted for our database
   */
  mapExternalIPOToLocalFormat(externalIPO) {
    // This mapping should be adjusted based on the actual API response format
    return {
      companyName: externalIPO.company_name || externalIPO.companyName,
      symbol: externalIPO.symbol,
      ipoDate: externalIPO.ipo_date || externalIPO.ipoDate,
      priceRangeLow: externalIPO.price_range_low || externalIPO.priceRangeLow || 0,
      priceRangeHigh: externalIPO.price_range_high || externalIPO.priceRangeHigh || 0,
      sharesOffered: externalIPO.shares_offered || externalIPO.sharesOffered || 0,
      status: this.mapExternalStatus(externalIPO.status),
      description: externalIPO.description || ''
    };
  }

  /**
   * Map external status values to our status values
   * @param {String} externalStatus - Status from IPOAlerts.in
   * @returns {String} Status for our database
   */
  mapExternalStatus(externalStatus) {
    // Map external status values to our status values
    // This mapping should be adjusted based on the actual API status values
    const statusMap = {
      'upcoming': 'upcoming',
      'open': 'open',
      'active': 'open',
      'closed': 'past',
      'listed': 'past'
    };
    
    return statusMap[externalStatus?.toLowerCase()] || 'upcoming';
  }

  /**
   * Get mock IPO data for development/testing
   * @returns {Array} Array of mock IPO data
   */
  getMockIPOData() {
    // Mock data for development/testing when API is unavailable
    return [
      {
        company_name: "TechInnovate Solutions Ltd",
        symbol: "TECHINO",
        ipo_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        price_range_low: 450,
        price_range_high: 500,
        shares_offered: 35000000,
        status: "upcoming",
        description: "TechInnovate Solutions is a leading provider of AI-driven enterprise solutions."
      },
      {
        company_name: "GreenEnergy Power Corp",
        symbol: "GREENPWR",
        ipo_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        price_range_low: 300,
        price_range_high: 350,
        shares_offered: 25000000,
        status: "upcoming",
        description: "GreenEnergy Power specializes in renewable energy solutions and sustainable power generation."
      },
      {
        company_name: "HealthPlus Pharmaceuticals",
        symbol: "HLTHPLUS",
        ipo_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
        price_range_low: 600,
        price_range_high: 650,
        shares_offered: 15000000,
        status: "open",
        description: "HealthPlus develops innovative pharmaceutical products and healthcare solutions."
      },
      {
        company_name: "FinSecure Banking Ltd",
        symbol: "FINSEC",
        ipo_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        price_range_low: 250,
        price_range_high: 275,
        shares_offered: 40000000,
        status: "listed",
        description: "FinSecure provides secure digital banking and financial technology services."
      }
    ];
  }
}

module.exports = new IPOAlertsService();
