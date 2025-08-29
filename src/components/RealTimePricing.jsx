import React, { useState, useEffect } from 'react';
import { pricingService } from '../data/realTimePricing';

const RealTimePricing = ({ symbol, onPriceUpdate }) => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!symbol) return;

    const handlePriceUpdate = (priceData) => {
      setCurrentPrice(priceData);
      setPriceHistory(prev => [...prev.slice(-19), priceData]); // Keep last 20 prices
      if (onPriceUpdate) {
        onPriceUpdate(priceData);
      }
    };

    // Subscribe to price updates
    pricingService.subscribe(symbol, handlePriceUpdate);

    // Start real-time updates if not already running
    if (!pricingService.isConnected) {
      pricingService.startRealTimeUpdates();
    }
    setIsLive(true);

    // Initial price fetch
    const initialPrice = {
      price: pricingService.getCurrentPrice(symbol),
      timestamp: Date.now(),
      change: 0,
      changePercent: 0
    };
    handlePriceUpdate(initialPrice);

    return () => {
      pricingService.unsubscribe(symbol, handlePriceUpdate);
      setIsLive(false);
    };
  }, [symbol, onPriceUpdate]);

  const formatPrice = (price) => {
    if (!price) return '0.00000';
    
    if (symbol && symbol.includes('JPY')) return price.toFixed(3);
    if (symbol && (symbol.includes('BTC') || symbol.includes('ETH'))) return price.toFixed(2);
    if (symbol && symbol.includes('USD') && symbol.length === 6) return price.toFixed(5);
    return price.toFixed(2);
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '➡️';
  };

  if (!symbol) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center text-gray-500">
          <span className="text-4xl mb-2 block">💱</span>
          <p>Select an asset to see real-time pricing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-2">💱</span>
          <h3 className="text-lg font-semibold text-gray-800">Real-Time Price Feed</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">{isLive ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      {currentPrice && (
        <div>
          {/* Current Price Display */}
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-gray-800">{symbol}</h4>
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(currentPrice.price)}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${getChangeColor(currentPrice.change)}`}>
                  {getChangeIcon(currentPrice.change)} {currentPrice.change >= 0 ? '+' : ''}{formatPrice(Math.abs(currentPrice.change))}
                </div>
                <div className={`text-sm ${getChangeColor(currentPrice.change)}`}>
                  ({currentPrice.changePercent >= 0 ? '+' : ''}{currentPrice.changePercent.toFixed(2)}%)
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(currentPrice.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Price History Chart (Simple) */}
          {priceHistory.length > 1 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Price Movement (Last 20 ticks)</h5>
              <div className="flex items-end space-x-1 h-16 bg-gray-50 p-2 rounded">
                {priceHistory.map((price, index) => {
                  const minPrice = Math.min(...priceHistory.map(p => p.price));
                  const maxPrice = Math.max(...priceHistory.map(p => p.price));
                  const range = maxPrice - minPrice || 1;
                  const height = ((price.price - minPrice) / range) * 48 + 4; // 4px minimum height
                  
                  return (
                    <div
                      key={index}
                      className={`w-2 rounded-t ${
                        index === priceHistory.length - 1 
                          ? 'bg-blue-500' 
                          : price.change >= 0 
                            ? 'bg-green-400' 
                            : 'bg-red-400'
                      }`}
                      style={{ height: `${height}px` }}
                      title={`${formatPrice(price.price)} at ${new Date(price.timestamp).toLocaleTimeString()}`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-600">High (20 ticks)</div>
              <div className="font-bold text-green-600">
                {priceHistory.length > 0 ? formatPrice(Math.max(...priceHistory.map(p => p.price))) : formatPrice(currentPrice.price)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Low (20 ticks)</div>
              <div className="font-bold text-red-600">
                {priceHistory.length > 0 ? formatPrice(Math.min(...priceHistory.map(p => p.price))) : formatPrice(currentPrice.price)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Avg Price</div>
              <div className="font-bold text-blue-600">
                {priceHistory.length > 0 
                  ? formatPrice(priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length)
                  : formatPrice(currentPrice.price)
                }
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Volatility</div>
              <div className="font-bold text-purple-600">
                {priceHistory.length > 1 
                  ? ((Math.max(...priceHistory.map(p => p.price)) - Math.min(...priceHistory.map(p => p.price))) / 
                     (priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length) * 100).toFixed(2) + '%'
                  : '0.00%'
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimePricing;
