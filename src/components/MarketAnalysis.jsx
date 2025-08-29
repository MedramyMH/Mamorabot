import React from 'react';

const MarketAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  const { marketInfo, technicalOverview } = analysis;
  const isPositiveChange = parseFloat(technicalOverview.priceChange) >= 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Market Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-2">📡</span>
            <h3 className="text-lg font-semibold text-gray-800">Market Info</h3>
          </div>
          <div className="text-xs text-gray-500">
            Last Update: {marketInfo.lastUpdate}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Volatility:</span>
            <span className={`font-medium px-2 py-1 rounded text-sm ${
              marketInfo.volatility === 'High' ? 'bg-red-100 text-red-700' : 
              marketInfo.volatility === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
            }`}>
              {marketInfo.volatility}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Asset strength by volume:</span>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${marketInfo.assetStrength}%` }}
                ></div>
              </div>
              <span className="font-medium text-blue-600">{marketInfo.assetStrength}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Volume result:</span>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="h-2 bg-purple-500 rounded-full"
                  style={{ width: `${marketInfo.volumeResult}%` }}
                ></div>
              </div>
              <span className="font-medium text-purple-600">{marketInfo.volumeResult}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Sentiment:</span>
            <span className={`font-medium px-2 py-1 rounded text-sm ${
              marketInfo.sentiment.includes('Bullish') ? 'bg-green-100 text-green-700' : 
              marketInfo.sentiment.includes('Bearish') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {marketInfo.sentiment}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">💵</span>
          <h3 className="text-lg font-semibold text-gray-800">Technical Overview</h3>
        </div>
        
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Current price:</span>
              <span className="font-bold text-xl text-gray-800">{technicalOverview.currentPrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Change:</span>
              <div className="flex items-center">
                <span className={`font-medium text-sm mr-2 ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                  {technicalOverview.priceChange}
                </span>
                <span className={`text-xs px-1 py-0.5 rounded ${isPositiveChange ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {technicalOverview.priceChangePercent}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">R2:</span>
              <span className="font-medium text-red-600">{technicalOverview.resistance2}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">S2:</span>
              <span className="font-medium text-green-600">{technicalOverview.support2}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">R1:</span>
              <span className="font-medium text-red-600">{technicalOverview.resistance1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">S1:</span>
              <span className="font-medium text-green-600">{technicalOverview.support1}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">RSI:</span>
            <span className={`font-medium ${
              technicalOverview.rsiStatus === 'Overbought' ? 'text-red-600' : 
              technicalOverview.rsiStatus === 'Oversold' ? 'text-green-600' : 'text-blue-600'
            }`}>
              {technicalOverview.rsi} ({technicalOverview.rsiStatus})
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">MACD:</span>
            <span className={`font-medium text-xs px-2 py-1 rounded ${
              technicalOverview.macd.includes('Bullish') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {technicalOverview.macd}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Moving Average:</span>
            <span className={`font-medium text-xs px-2 py-1 rounded ${
              technicalOverview.movingAverage.includes('Above') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {technicalOverview.movingAverage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;