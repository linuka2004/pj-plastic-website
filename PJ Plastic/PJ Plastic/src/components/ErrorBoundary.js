import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Optional: reload the app
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          marginTop: '2rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          <h2>Something went wrong</h2>
          
          {/* Safe error details display */}
          <div style={{ 
            textAlign: 'left',
            margin: '1rem 0',
            padding: '1rem',
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            <strong>Error Details:</strong>
            <div style={{ marginTop: '0.5rem' }}>
              {this.state.error && this.state.error.toString()}
            </div>
            
            {/* Only show component stack if available */}
            {this.state.errorInfo && this.state.errorInfo.componentStack && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Component Stack:</strong>
                <pre style={{ 
                  whiteSpace: 'pre-wrap',
                  marginTop: '0.5rem',
                  fontSize: '0.8rem'
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>

          <button 
            onClick={this.handleRetry}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '1rem'
            }}
          >
            Try Again
          </button>

          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '1rem',
              marginLeft: '0.5rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;