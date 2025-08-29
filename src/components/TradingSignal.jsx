import React from 'react';

const TradingSignal = ({ signalData, recommendation }) => {
  if (!signalData || !recommendation) return null;

  const { strength, conditions, verdict } = signalData;
  const { action, confidence, icon, color, estimatedTime, reason } = recommendation;

  const getVerdictConfig = (verdict) => {
    switch (verdict) {
      case 'buy':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: '🟢',
          text: 'Trade ASAP',
          description: 'Strong opportunity detected'
        };
      case 'risk':
        return {
          color: 'bg-orange-500',
          textColor: 'text-orange-700',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          icon: '🟠',
          text: 'Risk - Be Careful',
          description: 'Mixed signals detected'
        };
      case 'sell':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: '🔴',
          text: 'Do Not Trade',
          description: 'High risk conditions'
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: '⚪',
          text: 'No Signal',
          description: 'Insufficient data'
        };
    }
  };

  const config = getVerdictConfig(verdict);

  const getRecommendationColor = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-500 text-white border-green-600';
      case 'red':
        return 'bg-red-500 text-white border-red-600';
      case 'orange':
        return 'bg-orange-500 text-white border-orange-600';
      case 'gray':
        return 'bg-gray-500 text-white border-gray-600';
      default:
        return 'bg-blue-500 text-white border-blue-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Signal Strength */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">📇</span>
          <h3 className="text-lg font-semibold text-gray-800">Signal Strength</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Strength:</span>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${config.color}`}
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
              <span className="font-bold text-lg">{strength}/100</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Market conditions:</span>
            <span className={`font-medium px-2 py-1 rounded text-sm ${config.textColor} ${config.bgColor}`}>
              {conditions}
            </span>
          </div>
        </div>

        {/* Trading Verdict */}
        <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-4 mt-6`}>
          <div className="text-center">
            <div className="text-3xl mb-2">{config.icon}</div>
            <h4 className={`text-lg font-bold ${config.textColor} mb-1`}>
              Verdict: {config.text}
            </h4>
            <p className={`text-sm ${config.textColor} opacity-80`}>
              {config.description}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Recommendation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🎯</span>
          <h3 className="text-lg font-semibold text-gray-800">Live Trading Signal</h3>
        </div>

        {/* Main Recommendation */}
        <div className={`${getRecommendationColor(color)} rounded-lg p-4 mb-4 border-2`}>
          <div className="text-center">
            <div className="text-4xl mb-2">{icon}</div>
            <h4 className="text-2xl font-bold mb-1">{action}</h4>
            <div className="flex justify-center items-center space-x-4 text-sm opacity-90">
              <span>⏱️ {estimatedTime}</span>
              <span>🎯 {confidence}</span>
            </div>
          </div>
        </div>

        {/* Recommendation Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Confidence Level:</span>
            <span className={`font-medium px-2 py-1 rounded text-sm ${
              confidence === 'Very High' ? 'bg-green-100 text-green-700' :
              confidence === 'High' ? 'bg-blue-100 text-blue-700' :
              confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {confidence}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estimated Time:</span>
            <span className="font-medium text-blue-600">{estimatedTime}</span>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-600 mb-1">Analysis Reason:</div>
            <div className="text-sm font-medium text-gray-800">{reason}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium">
            📈 Execute Buy
          </button>
          <button className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium">
            📉 Execute Sell
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="lg:col-span-2 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <span className="text-yellow-600 mr-2">⚠️</span>
          <div className="text-sm text-yellow-800">
            <strong>Risk Disclaimer:</strong> This analysis is for educational purposes only and should not be considered as financial advice. 
            Trading involves substantial risk and may result in loss of capital. Always conduct your own research and consider your risk tolerance before making trading decisions.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSignal;
