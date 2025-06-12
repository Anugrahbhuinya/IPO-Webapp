import React, { useState  } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Remix Icons
import { RiBarChartLine, RiUserStarLine, RiLineChartLine, RiRadarLine } from '@remixicon/react';

// Data based on Forbes India research (March 2025)
const topIndianBrokers = [
  { 
    name: 'Groww Invest Tech Private Limited', 
    clients: '13.02 million', 
    clientsValue: 13.02,
    rank: 1,
    tradingFees: 4.8,
    userInterface: 4.9,
    customerSupport: 4.5,
    researchTools: 4.6,
    mobileApp: 4.9
  },
  { 
    name: 'Zerodha Broking Limited', 
    clients: '7.96 million', 
    clientsValue: 7.96,
    rank: 2,
    tradingFees: 4.9,
    userInterface: 4.7,
    customerSupport: 4.3,
    researchTools: 4.5,
    mobileApp: 4.8
  },
  { 
    name: 'Angel One Limited', 
    clients: '7.65 million', 
    clientsValue: 7.65,
    rank: 3,
    tradingFees: 4.5,
    userInterface: 4.4,
    customerSupport: 4.6,
    researchTools: 4.7,
    mobileApp: 4.5
  },
  { 
    name: 'Upstox Securities Private Limited', 
    clients: '2.79 million', 
    clientsValue: 2.79,
    rank: 4,
    tradingFees: 4.7,
    userInterface: 4.3,
    customerSupport: 4.2,
    researchTools: 4.3,
    mobileApp: 4.4
  },
  { 
    name: 'ICICI Securities Limited', 
    clients: '1.94 million', 
    clientsValue: 1.94,
    rank: 5,
    tradingFees: 4.0,
    userInterface: 4.2,
    customerSupport: 4.7,
    researchTools: 4.8,
    mobileApp: 4.3
  },
  { 
    name: 'HDFC Securities Limited', 
    clients: '1.52 million', 
    clientsValue: 1.52,
    rank: 6,
    tradingFees: 3.9,
    userInterface: 4.1,
    customerSupport: 4.8,
    researchTools: 4.7,
    mobileApp: 4.2
  },
  { 
    name: 'Kotak Securities Limited', 
    clients: '1.49 million', 
    clientsValue: 1.49,
    rank: 7,
    tradingFees: 3.8,
    userInterface: 4.0,
    customerSupport: 4.6,
    researchTools: 4.6,
    mobileApp: 4.1
  },
  { 
    name: 'Motilal Oswal Financial Services Limited', 
    clients: '1.02 million', 
    clientsValue: 1.02,
    rank: 8,
    tradingFees: 3.7,
    userInterface: 3.9,
    customerSupport: 4.4,
    researchTools: 4.9,
    mobileApp: 3.9
  },
  { 
    name: 'SBICAP Securities Limited', 
    clients: '0.98 million', 
    clientsValue: 0.98,
    rank: 9,
    tradingFees: 3.6,
    userInterface: 3.8,
    customerSupport: 4.5,
    researchTools: 4.4,
    mobileApp: 3.8
  },
  { 
    name: 'Paytm Money Limited', 
    clients: '0.66 million', 
    clientsValue: 0.66,
    rank: 10,
    tradingFees: 4.6,
    userInterface: 4.5,
    customerSupport: 4.0,
    researchTools: 4.0,
    mobileApp: 4.7
  },
];

const BrokerComparison = () => {
  const [selectedBrokers, setSelectedBrokers] = useState([1, 2]); // Default to comparing top 2 brokers
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'radar'
  
  // Get the selected broker data for charts
  const selectedBrokerData = topIndianBrokers.filter(broker => 
    selectedBrokers.includes(broker.rank)
  );
  
  // Prepare data for bar chart comparison
  const barChartData = [
    { name: 'Trading Fees', broker1: selectedBrokerData[0]?.tradingFees || 0, broker2: selectedBrokerData[1]?.tradingFees || 0 },
    { name: 'User Interface', broker1: selectedBrokerData[0]?.userInterface || 0, broker2: selectedBrokerData[1]?.userInterface || 0 },
    { name: 'Customer Support', broker1: selectedBrokerData[0]?.customerSupport || 0, broker2: selectedBrokerData[1]?.customerSupport || 0 },
    { name: 'Research Tools', broker1: selectedBrokerData[0]?.researchTools || 0, broker2: selectedBrokerData[1]?.researchTools || 0 },
    { name: 'Mobile App', broker1: selectedBrokerData[0]?.mobileApp || 0, broker2: selectedBrokerData[1]?.mobileApp || 0 },
  ];
  
  // Prepare data for radar chart
  const radarChartData = [
    { subject: 'Trading Fees', A: selectedBrokerData[0]?.tradingFees || 0, B: selectedBrokerData[1]?.tradingFees || 0, fullMark: 5 },
    { subject: 'User Interface', A: selectedBrokerData[0]?.userInterface || 0, B: selectedBrokerData[1]?.userInterface || 0, fullMark: 5 },
    { subject: 'Customer Support', A: selectedBrokerData[0]?.customerSupport || 0, B: selectedBrokerData[1]?.customerSupport || 0, fullMark: 5 },
    { subject: 'Research Tools', A: selectedBrokerData[0]?.researchTools || 0, B: selectedBrokerData[1]?.researchTools || 0, fullMark: 5 },
    { subject: 'Mobile App', A: selectedBrokerData[0]?.mobileApp || 0, B: selectedBrokerData[1]?.mobileApp || 0, fullMark: 5 },
  ];
  
  // Handle broker selection change
  const handleBrokerChange = (position, event) => {
    const value = parseInt(event.target.value, 10);
    const newSelectedBrokers = [...selectedBrokers];
    newSelectedBrokers[position] = value;
    setSelectedBrokers(newSelectedBrokers);
  };
  
  // Toggle chart type
  const toggleChartType = () => {
    setChartType(chartType === 'bar' ? 'radar' : 'bar');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6 flex-grow min-w-[300px]">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Brokers in India (by Active Clients - Mar 2025)</h3>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Source: Forbes India (Data as of March 2025)
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-md">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Broker Name</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active Clients</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {topIndianBrokers.map((broker) => (
              <tr key={broker.rank}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{broker.rank}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{broker.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <RiUserStarLine className="inline mr-1 h-4 w-4 text-yellow-500"/>
                  {broker.clients}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Broker Comparison Chart Section */}
      <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">Broker Comparison Chart</h4>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label htmlFor="broker1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Broker 1</label>
              <select 
                id="broker1" 
                value={selectedBrokers[0]} 
                onChange={(e) => handleBrokerChange(0, e)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {topIndianBrokers.map(broker => (
                  <option key={`broker1-${broker.rank}`} value={broker.rank}>
                    {broker.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="broker2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Broker 2</label>
              <select 
                id="broker2" 
                value={selectedBrokers[1]} 
                onChange={(e) => handleBrokerChange(1, e)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {topIndianBrokers.map(broker => (
                  <option key={`broker2-${broker.rank}`} value={broker.rank}>
                    {broker.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={toggleChartType}
              className="mt-4 sm:mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {chartType === 'bar' ? (
                <>
                  <RiRadarLine className="mr-2" />
                  Switch to Radar
                </>
              ) : (
                <>
                  <RiBarChartLine className="mr-2" />
                  Switch to Bar
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="h-80 mt-4">
          {chartType === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="broker1" 
                  name={selectedBrokerData[0]?.name || 'Broker 1'} 
                  fill="#8884d8" 
                />
                <Bar 
                  dataKey="broker2" 
                  name={selectedBrokerData[1]?.name || 'Broker 2'} 
                  fill="#82ca9d" 
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="80%" data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 5]} />
                <Radar 
                  name={selectedBrokerData[0]?.name || 'Broker 1'} 
                  dataKey="A" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6} 
                />
                <Radar 
                  name={selectedBrokerData[1]?.name || 'Broker 2'} 
                  dataKey="B" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6} 
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p className="font-medium">Rating Scale: 1-5</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Trading Fees: Lower fees = Higher rating</li>
            <li>User Interface: Ease of use and design quality</li>
            <li>Customer Support: Response time and issue resolution</li>
            <li>Research Tools: Quality and variety of analysis tools</li>
            <li>Mobile App: Performance and features on mobile devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BrokerComparison;
