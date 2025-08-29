import React, { useState, useEffect } from 'react';
import MarketSelector from './MarketSelector';
import MarketAnalysis from './MarketAnalysis';
import TradingSignal from './TradingSignal';
import PocketOptionConnection from './PocketOptionConnection';
import StrategySelector from './StrategySelector';
import RealTimePricing from './RealTimePricing';
import TradingExecutor from './TradingExecutor';
import { generateMarketData } from '../data/tradingData';
import { pricingService } from '../data/realTimePricing';

const TradingAssistant = () => {
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnectedToPO, setIsConnectedToPO] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh && analysis && selectedMarket && selectedSymbol && selectedTimeframe) {
      interval = setInterval(() => {
        const marketData = generateMarketData(selectedMarket, selectedSymbol, selectedTimeframe);
        setAnalysis(marketData);
        setLastUpdate(new Date().toLocaleTimeString());
      }, 3000); // Update every 3 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, analysis, selectedMarket, selectedSymbol, selectedTimeframe]);

  // Start real-time pricing when symbol is selected
  useEffect(() => {
    if (selectedSymbol) {
      pricingService.startRealTimeUpdates();
    }
    return () => {
      if (!selectedSymbol) {
        pricingService.stopRealTimeUpdates();
      }
    };
  }, [selectedSymbol]);

  const handleMarketChange = (market) => {
    setSelectedMarket(market);
    setSelectedSymbol('');
    setAnalysis(null);
    setAutoRefresh(false);
    setSelectedStrategy(null);
    setCurrentPrice(null);
  };

  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol);
    setAnalysis(null);
    setAutoRefresh(false);
    setSelectedStrategy(null);
    setCurrentPrice(null);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    setAnalysis(null);
    setAutoRefresh(false);
    setSelectedStrategy(null);
  };

  const handlePriceUpdate = (priceData) => {
    setCurrentPrice(priceData);
    
    // Update analysis with new price if analysis exists
    if (analysis) {
      const updatedAnalysis = {
        ...analysis,
        technicalOverview: {
          ...analysis.technicalOverview,
          currentPrice: priceData.price.toFixed(5),
          priceChange: (priceData.change >= 0 ? '+' : '') + priceData.change.toFixed(5),
          priceChangePercent: priceData.changePercent.toFixed(2)
        },
        marketInfo: {
          ...analysis.marketInfo,
          lastUpdate: new Date(priceData.timestamp).toLocaleTimeString()
        }
      };
      setAnalysis(updatedAnalysis);
    }
  };

  const analyzeMarket = () => {
    if (!selectedMarket || !selectedSymbol || !selectedTimeframe) {
      alert('Please select market, symbol, and timeframe first.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const marketData = generateMarketData(selectedMarket, selectedSymbol, selectedTimeframe);
      setAnalysis(marketData);
      setIsAnalyzing(false);
      setLastUpdate(new Date().toLocaleTimeString());
    }, 1500);
  };

  const refreshAnalysis = () => {
    if (selectedMarket && selectedSymbol && selectedTimeframe) {
      analyzeMarket();
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleConnectionChange = (connected) => {
    setIsConnectedToPO(connected);
  };

  const handleStrategyChange = (strategy) => {
    setSelectedStrategy(strategy);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 Advanced Pocket Option Trading Assistant
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Real-time pricing • AI strategies • Direct trading integration
          </p>
          
          {/* Live Status Indicators */}
          <div className="flex justify-center items-center space-x-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {autoRefresh ? 'Live Analysis' : 'Manual Mode'}
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${pricingService.isConnected ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {pricingService.isConnected ? 'Real-time Pricing' : 'Static Pricing'}
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isConnectedToPO ? 'bg-green-500' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnectedToPO ? 'Pocket Option Connected' : 'Pocket Option Offline'}
              </span>
            </div>
            {lastUpdate && (
              <div className="text-sm text-gray-500">
                Last Update: {lastUpdate}
              </div>
            )}
          </div>
        </div>

        {/* Pocket Option Connection */}
        <PocketOptionConnection onConnectionChange={handleConnectionChange} />

        {/* Market Selection */}
        <MarketSelector
          selectedMarket={selectedMarket}
          selectedSymbol={selectedSymbol}
          selectedTimeframe={selectedTimeframe}
          onMarketChange={handleMarketChange}
          onSymbolChange={handleSymbolChange}
          onTimeframeChange={handleTimeframeChange}
        />

        {/* Real-time Pricing */}
        {selectedSymbol && (
          <RealTimePricing 
            symbol={selectedSymbol} 
            onPriceUpdate={handlePriceUpdate}
          />
        )}

        {/* AI Strategy Selection */}
        <StrategySelector
          marketType={selectedMarket}
          symbol={selectedSymbol}
          timeframe={selectedTimeframe}
          marketData={analysis}
          onStrategyChange={handleStrategyChange}
        />

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={analyzeMarket}
            disabled={!selectedMarket || !selectedSymbol || !selectedTimeframe || isAnalyzing}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Market...
              </span>
            ) : (
              '🔍 Analyze Market'
            )}
          </button>

          {analysis && (
            <>
              <button
                onClick={refreshAnalysis}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                🔄 Refresh
              </button>
              
              <button
                onClick={toggleAutoRefresh}
                disabled={isAnalyzing}
                className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                  autoRefresh 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {autoRefresh ? '⏹️ Stop Live' : '▶️ Start Live'}
              </button>
            </>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            <MarketAnalysis analysis={analysis} />
            <TradingSignal 
              signalData={analysis.signalStrength} 
              recommendation={analysis.recommendation}
            />
            
            {/* Trading Executor */}
            <TradingExecutor
              symbol={selectedSymbol}
              strategy={selectedStrategy}
              currentPrice={currentPrice}
              isConnected={isConnectedToPO}
            />
          </div>
        )}

        {/* No Analysis State */}
        {!analysis && !isAnalyzing && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Advanced Trading Assistant Ready
            </h3>
            <p className="text-gray-500 mb-4">
              Connect to Pocket Option, select your market and asset, then let AI guide your trading decisions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-gray-600">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold">Real-time Analysis</div>
                <div>Live price feeds and market data</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl mb-2">🧠</div>
                <div className="font-semibold">AI Strategies</div>
                <div>Machine learning powered recommendations</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold">Direct Trading</div>
                <div>Execute trades directly on Pocket Option</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingAssistant;