import React, { useState, useEffect } from 'react';
import { mlEngine } from '../data/mlStrategies';

const StrategySelector = ({ marketType, symbol, timeframe, marketData, onStrategyChange }) => {
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [availableStrategies, setAvailableStrategies] = useState([]);
  const [autoSelect, setAutoSelect] = useState(true);
  const [strategyDetails, setStrategyDetails] = useState(null);

  useEffect(() => {
    if (marketType && timeframe) {
      const strategies = mlEngine.getAvailableStrategies(marketType, timeframe);
      setAvailableStrategies(strategies);

      if (autoSelect && marketData && symbol) {
        const optimal = mlEngine.selectOptimalStrategy(marketType, symbol, timeframe, marketData);
        setSelectedStrategy(optimal);
        
        const signals = mlEngine.generateStrategySignals(optimal, marketData);
        setStrategyDetails(signals);
        onStrategyChange(signals);
      }
    }
  }, [marketType, symbol, timeframe, marketData, autoSelect]);

  const handleManualStrategySelect = (strategyName) => {
    const strategy = availableStrategies.find(s => s.name === strategyName);
    if (strategy && marketData) {
      const selectedOpt = { strategy: strategyName, details: strategy, score: 75 };
      setSelectedStrategy(selectedOpt);
      
      const signals = mlEngine.generateStrategySignals(selectedOpt, marketData);
      setStrategyDetails(signals);
      onStrategyChange(signals);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-2">🧠</span>
          <h3 className="text-lg font-semibold text-gray-800">AI Strategy Selection</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Auto ML:</span>
          <button
            onClick={() => setAutoSelect(!autoSelect)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoSelect ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoSelect ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {availableStrategies.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {autoSelect ? 'AI-Selected Strategy' : 'Manual Strategy Selection'}
          </label>
          
          {autoSelect ? (
            selectedStrategy && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-800">{selectedStrategy.details.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(selectedStrategy.details.riskLevel)}`}>
                      {selectedStrategy.details.riskLevel} Risk
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      Score: {Math.round(selectedStrategy.score)}/100
                    </span>
                  </div>
                </div>
                <p className="text-sm text-blue-700 mb-2">{selectedStrategy.details.description}</p>
                <div className="text-xs text-blue-600">
                  <strong>Indicators:</strong> {selectedStrategy.details.indicators.join(', ')} | 
                  <strong> Win Rate:</strong> {Math.round(selectedStrategy.details.winRate * 100)}%
                </div>
              </div>
            )
          ) : (
            <select
              onChange={(e) => handleManualStrategySelect(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Strategy Manually</option>
              {availableStrategies.map((strategy) => (
                <option key={strategy.name} value={strategy.name}>
                  {strategy.name} - {strategy.riskLevel} Risk ({Math.round(strategy.winRate * 100)}% Win Rate)
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {strategyDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Strategy Signals */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-semibold text-gray-800 mb-3">Trading Signals</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Entry Buy:</span>
                <span className="font-medium text-green-600">{strategyDetails.signals.entryPoints.buy.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entry Sell:</span>
                <span className="font-medium text-red-600">{strategyDetails.signals.entryPoints.sell.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Take Profit Buy:</span>
                <span className="font-medium text-green-600">{strategyDetails.signals.takeProfit.buyTakeProfit.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stop Loss Buy:</span>
                <span className="font-medium text-red-600">{strategyDetails.signals.stopLoss.buyStopLoss.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Position Size:</span>
                <span className="font-medium text-blue-600">{Math.round(strategyDetails.signals.positionSize * 100)}% of account</span>
              </div>
            </div>
          </div>

          {/* Strategy Reasoning */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-semibold text-gray-800 mb-3">AI Analysis</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {strategyDetails.reasoning}
            </p>
            <div className="mt-3 text-xs text-gray-500">
              <strong>Confidence:</strong> {Math.round(strategyDetails.signals.confidence)}/100
            </div>
          </div>
        </div>
      )}

      {!marketType || !timeframe ? (
        <div className="text-center py-4 text-gray-500">
          <span className="text-4xl mb-2 block">🤖</span>
          <p>Select market and timeframe to see AI strategy recommendations</p>
        </div>
      ) : availableStrategies.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <span className="text-4xl mb-2 block">⚠️</span>
          <p>No strategies available for selected market and timeframe</p>
        </div>
      ) : null}
    </div>
  );
};

export default StrategySelector;
