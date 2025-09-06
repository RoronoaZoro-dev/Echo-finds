import React, { useState } from 'react';
import { signInWithGoogle } from '../../firebase/authService';
import { auth } from '../../firebase/config';

const GoogleAuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testGoogleAuth = async () => {
    setIsLoading(true);
    setDebugInfo('Starting Google authentication test...\n');
    
    try {
      // Check if auth is properly initialized
      setDebugInfo(prev => prev + `Auth object: ${auth ? 'Initialized' : 'Not initialized'}\n`);
      setDebugInfo(prev => prev + `Auth app: ${auth.app ? auth.app.name : 'No app'}\n`);
      setDebugInfo(prev => prev + `Auth domain: ${auth.app ? auth.app.options.authDomain : 'No domain'}\n`);
      
      // Test Google sign-in
      setDebugInfo(prev => prev + 'Attempting Google sign-in...\n');
      const result = await signInWithGoogle();
      
      if (result.success) {
        setDebugInfo(prev => prev + `✅ SUCCESS: ${result.message}\n`);
        setDebugInfo(prev => prev + `User: ${result.user.displayName} (${result.user.email})\n`);
      } else {
        setDebugInfo(prev => prev + `❌ FAILED: ${result.error}\n`);
        setDebugInfo(prev => prev + `Error code: ${result.code}\n`);
      }
    } catch (error) {
      setDebugInfo(prev => prev + `❌ EXCEPTION: ${error.message}\n`);
      setDebugInfo(prev => prev + `Stack: ${error.stack}\n`);
    }
    
    setIsLoading(false);
  };

  const clearDebug = () => {
    setDebugInfo('');
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      margin: '20px',
      backgroundColor: '#f9f9f9',
      fontFamily: 'monospace'
    }}>
      <h3>Google Authentication Debug</h3>
      <button 
        onClick={testGoogleAuth} 
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginRight: '10px'
        }}
      >
        {isLoading ? 'Testing...' : 'Test Google Auth'}
      </button>
      <button 
        onClick={clearDebug}
        style={{
          padding: '10px 20px',
          backgroundColor: '#666',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Clear
      </button>
      <div style={{ 
        marginTop: '20px',
        whiteSpace: 'pre-wrap',
        backgroundColor: '#000',
        color: '#0f0',
        padding: '10px',
        borderRadius: '5px',
        minHeight: '200px',
        overflow: 'auto'
      }}>
        {debugInfo || 'Click "Test Google Auth" to start debugging...'}
      </div>
    </div>
  );
};

export default GoogleAuthDebug;
