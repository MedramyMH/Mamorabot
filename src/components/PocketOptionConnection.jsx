import React, { useState } from 'react';
import { pocketOptionService } from '../data/pocketOptionIntegration';

const PocketOptionConnection = ({ onConnectionChange }) => {
  const [credentials, setCredentials] = useState({
    apiKey: '',
    secretKey: '',
    accountId: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [accountInfo, setAccountInfo] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleConnect = async () => {
    const validation = pocketOptionService.validateCredentials(credentials);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    setIsConnecting(true);
    try {
      const result = await pocketOptionService.connect(credentials);
      if (result.success) {
        setConnectionStatus('connected');
        setAccountInfo(result.accountInfo);
        onConnectionChange(true);
        alert('Successfully connected to Pocket Option!');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Connection failed: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    pocketOptionService.disconnect();
    setConnectionStatus('disconnected');
    setAccountInfo(null);
    onConnectionChange(false);
    setCredentials({ apiKey: '', secretKey: '', accountId: '' });
  };

  const instructions = pocketOptionService.getConnectionInstructions();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-2">🔗</span>
          <h3 className="text-lg font-semibold text-gray-800">Pocket Option Integration</h3>
        </div>
        <div className={`px-3 py-1 rounded text-sm font-medium ${
          connectionStatus === 'connected' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {connectionStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      {connectionStatus === 'disconnected' && (
        <div>
          {/* Instructions Toggle */}
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="mb-4 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            {showInstructions ? 'Hide' : 'Show'} Connection Instructions
          </button>

          {showInstructions && (
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">How to Connect:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                {instructions.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <div className="mt-3 text-xs text-blue-600">
                <p><strong>Note:</strong> {instructions.note}</p>
                <p><strong>Security:</strong> {instructions.security}</p>
              </div>
            </div>
          )}

          {/* Credentials Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={credentials.apiKey}
                onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
                placeholder="Enter your API Key"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key
              </label>
              <input
                type="password"
                value={credentials.secretKey}
                onChange={(e) => setCredentials({...credentials, secretKey: e.target.value})}
                placeholder="Enter your Secret Key"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account ID
              </label>
              <input
                type="text"
                value={credentials.accountId}
                onChange={(e) => setCredentials({...credentials, accountId: e.target.value})}
                placeholder="Enter your Account ID"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={isConnecting || !credentials.apiKey || !credentials.secretKey || !credentials.accountId}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isConnecting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting to Pocket Option...
              </span>
            ) : (
              '🔗 Connect to Pocket Option'
            )}
          </button>
        </div>
      )}

      {connectionStatus === 'connected' && accountInfo && (
        <div>
          {/* Account Information */}
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <h4 className="font-semibold text-green-800 mb-2">Account Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-green-600">Balance:</span>
                <div className="font-bold text-green-800">${accountInfo.balance}</div>
              </div>
              <div>
                <span className="text-green-600">Currency:</span>
                <div className="font-bold text-green-800">{accountInfo.currency}</div>
              </div>
              <div>
                <span className="text-green-600">Account Type:</span>
                <div className="font-bold text-green-800">{accountInfo.accountType}</div>
              </div>
              <div>
                <span className="text-green-600">Leverage:</span>
                <div className="font-bold text-green-800">{accountInfo.leverage}</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDisconnect}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            🔌 Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default PocketOptionConnection;