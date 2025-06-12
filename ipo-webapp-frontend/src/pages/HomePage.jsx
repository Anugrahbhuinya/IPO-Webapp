import React from 'react';
import UpcomingIPOList from '../components/IPOs/UpcomingIPOList';
import BrokerComparison from '../components/Brokers/BrokerComparison';
// Import other components like InvestorInfo etc.

const HomePage = () => {
  return (
    <div>
      <h2>Dashboard / Home</h2>
      <p>Welcome to the IPO application dashboard.</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <UpcomingIPOList />
        <BrokerComparison />
        {/* Add other dashboard components here */}
      </div>
    </div>
  );
};

export default HomePage;

