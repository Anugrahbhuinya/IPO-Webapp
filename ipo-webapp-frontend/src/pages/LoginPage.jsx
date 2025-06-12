import React from 'react';
import Login from '../components/Auth/Login';

const LoginPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)' }}> {/* Adjust height based on header */}
      <Login />
    </div>
  );
};

export default LoginPage;

