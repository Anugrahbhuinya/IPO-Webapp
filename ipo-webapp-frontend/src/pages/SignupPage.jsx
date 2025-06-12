import React from 'react';
import Signup from '../components/Auth/Signup';

const SignupPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)' }}> {/* Adjust height based on header */}
      <Signup />
    </div>
  );
};

export default SignupPage;

