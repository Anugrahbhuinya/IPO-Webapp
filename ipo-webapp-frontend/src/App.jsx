import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './index.css'; // Import Tailwind CSS base styles
import { io } from 'socket.io-client'; // Import Socket.IO client

// Remix Icons
import { RiSunLine, RiMoonLine, RiAdminLine, RiBriefcaseLine } from '@remixicon/react'; // Added RiAdminLine, RiBriefcaseLine

// Lazy load Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const HomePage = lazy(() => import("./pages/HomePage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage")); // Lazy load Admin Page
const PortfolioPage = lazy(() => import("./pages/PortfolioPage")); // Lazy load Portfolio Page

// Import Layout Components
import ProtectedRoute from './components/Layout/ProtectedRoute';
import ErrorBoundary from './components/Layout/ErrorBoundary';

// Socket.IO connection
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL|| 'http://localhost:5000'; 
const socket = io(SOCKET_SERVER_URL);

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, logout } = useAuth(); // Use useAuth hook
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Use logout from context
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 no-underline">
          IPO Web App
        </Link>
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {/* Show Admin Dashboard link only if user is admin */}
              {isAdmin && (
                <Link to="/admin" title="Admin Dashboard" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                  <RiAdminLine size={20} className="text-gray-700 dark:text-gray-300" />
                </Link>
              )}
              {/* Portfolio Link */}
              <Link to="/portfolio" title="My Portfolio" className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                 <RiBriefcaseLine size={20} className="text-gray-700 dark:text-gray-300" />
              </Link>
              <button 
                onClick={handleLogout} 
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                  Sign Up
                </button>
              </Link>
            </>
          )}
          <button 
            onClick={toggleTheme} 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <RiSunLine size={20} className="text-yellow-400" />
            ) : (
              <RiMoonLine size={20} className="text-gray-700" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

// Loading fallback component for React.lazy
const LoadingFallback = () => (
    <div className="flex justify-center items-center h-[calc(100vh-60px)]"> {/* Adjust height based on header */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

function AppContent() {

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server:', socket.id);
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <Router>
      <Header />
      <main className="container mx-auto px-4 py-4">
        <ErrorBoundary> 
          <Suspense fallback={<LoadingFallback />}> 
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Routes (User) */}
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<HomePage socket={socket} />} /> 
                <Route path="portfolio" element={<PortfolioPage />} /> {/* Add Portfolio Route */}
                {/* Add other user routes here */}
              </Route>

              {/* Protected Routes (Admin) */}
              <Route path="/admin" element={<ProtectedRoute adminOnly={true} />}>
                 <Route index element={<AdminDashboardPage />} />
                 {/* Add other admin routes here, e.g., /admin/users */}
              </Route>

              {/* Optional: Add a 404 Not Found route */}
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider> {/* Wrap AppContent with AuthProvider */} 
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

