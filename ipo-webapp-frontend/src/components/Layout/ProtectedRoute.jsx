import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Added adminOnly prop
const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    // Show a loading indicator while checking auth status
    return (
        <div className="flex justify-center items-center h-[calc(100vh-60px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the route requires admin and the user is not an admin, redirect to home
  if (adminOnly && !isAdmin) {
    // Optionally show an 'Unauthorized' message or redirect to home
    console.warn("Admin access required for this route.");
    return <Navigate to="/" replace />;
  }

  // If authenticated (and admin if required), render the child routes
  return <Outlet />;
};

export default ProtectedRoute;

