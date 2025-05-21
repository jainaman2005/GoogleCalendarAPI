import React, { useEffect, useState } from 'react';
import { initClient, handleSignedIn, handleSignedOut, getAuthInstance } from '../services/gapiService';

const AuthButton = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAuthClick = () => {
    setLoading(true);
    if (!isSignedIn) {
      handleSignedIn();
    } else {
      handleSignedOut();
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await initClient();
        const auth = getAuthInstance();

        if (!auth) {
          throw new Error("Authentication service not available");
        }

        // Set initial state
        const updateSignInStatus = (status) => {
          setIsSignedIn(status);
        };

        const currentStatus = auth.isSignedIn.get();
        updateSignInStatus(currentStatus);

        // Listen for changes
        auth.isSignedIn.listen(updateSignInStatus);
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message || "Failed to initialize authentication");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="text-xl font-semibold text-gray-700">
        {isSignedIn ? 'Welcome!' : 'Google Authentication'}
      </div>

      <button
        onClick={handleAuthClick}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white text-md font-medium transition-colors
          ${isSignedIn
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-blue-600 hover:bg-blue-700'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : isSignedIn ? (
          'Sign Out'
        ) : (
          'Sign In with Google'
        )}
      </button>

      {isSignedIn && (
        <div className="text-sm text-green-600">
          You're signed in successfully!
        </div>
      )}
    </div>
  );
};


export default AuthButton;