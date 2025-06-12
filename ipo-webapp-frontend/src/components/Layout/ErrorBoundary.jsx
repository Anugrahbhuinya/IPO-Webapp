import React, { Component } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            <AlertTitle>Something went wrong</AlertTitle>
            <p>An unexpected error occurred in this part of the application.</p>
            {/* Optional: Display error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </details>
            )}
          </Alert>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

