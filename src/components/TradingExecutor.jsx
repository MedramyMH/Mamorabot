import React, { useState } from 'react';
import { pocketOptionService } from '../data/pocketOptionIntegration';

const TradingExecutor = ({ symbol, strategy, currentPrice, isConnected }) => {
  const [tradeAmount, setTradeAmount] = useState(10);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');
  const [isExecuting, setIsExecuting] = useState(false);
  const [tradeHistory, setTradeHistory] = useState([]);

  const timeframeOptions = ['30s', '1m', '2m', '5m', '15m', '30m', '1h'];

  const executeTrade = async (action) => {
    if (!isConnected) {
      alert('Please connect to Pocket Option first');
      return;
    }

    if (!symbol || !strategy) {
      alert('Please select a symbol and strategy first');
      return;
    }

    setIsExecuting(true);
    try {
      const tradeParams = {
        symbol,
        action,
        amount: tradeAmount,
        timeframe: selectedTimeframe,
        strategy: strategy.strategy
      };

      const result = await pocketOptionService.executeTrade(tradeParams);
      
      if (result.success) {
        setTradeHistory(prev => [result.trade, ...prev.slice(0, 9)]); // Keep last 10 trades
        alert(`${action} trade executed successfully! Trade ID: ${result.trade.tradeId}`);
      } else {
        alert('Trade execution failed: ' + result.message);
      }
    } catch (error) {
      alert('Trade execution error: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const calculatePotentialReturn = () => {
    const payout = 0.85; // 85% payout rate
    return (tradeAmount * payout).toFixed(2);
  };

  const getStrategyRecommendation = () => {
    if (!strategy || !strategy.signals) return null;
    
    const signals = strategy.signals;
    const entryBuy = signals.entryPoints.buy;
    const entrySell = signals.entryPoints.sell;
    const price = currentPrice?.price || 0;

    if (price <= entryBuy) return { action: 'BUY', reason: 'Price at or below buy entry point' };
    if (price >= entrySell) return { action: 'SELL', reason: 'Price at or above sell entry point' };
    return { action: 'WAIT', reason: 'Price not at optimal entry points' };
  };

  const recommendation = getStrategyRecommendation();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">⚡</span>
        <h3 className="text-lg font-semibold text-gray-800">Trade Execution</h3>
        <div className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
          isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className="text-sm text-yellow-800">
              Connect to Pocket Option to enable live trading
            </span>
          </div>
        </div>
      )}

      {/* Trading Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trade Amount ($)
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={tradeAmount}
            onChange={(e) => setTradeAmount(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Potential return: ${calculatePotentialReturn()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Time
          </label>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {timeframeOptions.map(tf => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Strategy Recommendation */}
      {recommendation && (
        <div className={`p-3 rounded-md mb-4 ${
          recommendation.action === 'BUY' ? 'bg-green-50 border border-green-200' :
          recommendation.action === 'SELL' ? 'bg-red-50 border border-red-200' :
          'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className={`font-medium ${
                recommendation.action === 'BUY' ? 'text-green-700' :
                recommendation.action === 'SELL' ? 'text-red-700' :
                'text-yellow-700'
              }`}>
                AI Recommendation: {recommendation.action}
              </span>
              <div className="text-sm text-gray-600 mt-1">{recommendation.reason}</div>
            </div>
            <div className="text-2xl">
              {recommendation.action === 'BUY' ? '📈' :
               recommendation.action === 'SELL' ? '📉' : '⏳'}
            </div>
          </div>
        </div>
      )}

      {/* Trading Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => executeTrade('BUY')}
          disabled={!isConnected || isExecuting}
          className="px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isExecuting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Executing...
            </span>
          ) : (
            <>📈 BUY ({selectedTimeframe})</>
          )}
        </button>

        <button
          onClick={() => executeTrade('SELL')}
          disabled={!isConnected || isExecuting}
          className="px-6 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isExecuting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Executing...
            </span>
          ) : (
            <>📉 SELL ({selectedTimeframe})</>
          )}
        </button>
      </div>

      {/* Trade History */}
      {tradeHistory.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Recent Trades</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {tradeHistory.map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.action === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {trade.action}
                  </span>
                  <span className="font-medium">{trade.symbol}</span>
                  <span className="text-gray-600">${trade.amount}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{trade.status}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingExecutor;
