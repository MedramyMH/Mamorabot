import React from 'react';
import { markets, timeframes } from '../data/tradingData';

const MarketSelector = ({ selectedMarket, selectedSymbol, selectedTimeframe, onMarketChange, onSymbolChange, onTimeframeChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Market Selection</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Market Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Market Type</label>
          <select
            value={selectedMarket}
            onChange={(e) => onMarketChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Market</option>
            <option value="forex">Forex ({markets.forex.length} pairs)</option>
            <option value="crypto">Cryptocurrency ({markets.crypto.length} coins)</option>
            <option value="stocks">Stocks ({markets.stocks.length} stocks)</option>
            <option value="indices">Indices ({markets.indices.length} indices)</option>
            <option value="commodities">Commodities ({markets.commodities.length} commodities)</option>
          </select>
        </div>

        {/* Symbol/Asset */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asset/Symbol</label>
          <select
            value={selectedSymbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            disabled={!selectedMarket}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Select Asset</option>
            {selectedMarket && markets[selectedMarket]?.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>

        {/* Timeframe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
          <select
            value={selectedTimeframe}
            onChange={(e) => onTimeframeChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Timeframe</option>
            {timeframes.map(tf => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedMarket && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Market:</strong> {selectedMarket.charAt(0).toUpperCase() + selectedMarket.slice(1)} | 
            <strong> Available Assets:</strong> {markets[selectedMarket].length} | 
            <strong> Timeframes:</strong> {timeframes.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketSelector;