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
import { mlEngine } from '../data/mlStrategies';
import { signalProcessor } from '../data/enhancedSignalProcessor';

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
  const [liveSignals, setLiveSignals] = useState(null);
  const [enhancedAccuracy, setEnhancedAccuracy] = useState(true);

  // Enhanced auto-refresh functionality with improved signal processing
  useEffect(() => {
    let interval;
    if (autoRefresh && analysis && selectedMarket && selectedSymbol && selectedTimeframe) {
      interval = setInterval(() => {
        // Generate new market data
        const marketData = generateMarketData(selectedMarket, selectedSymbol, selectedTimeframe);
        
        // Update analysis
        setAnalysis(marketData);
        
        // Regenerate strategy and signals if strategy is selected
        if (selectedStrategy) {
          const updatedStrategy = mlEngine.selectOptimalStrategy(
            selectedMarket, 
            selectedSymbol, 
            selectedTimeframe, 
            marketData
          );
          
          const strategyWithSignals = mlEngine.generateStrategySignals(updatedStrategy, marketData);
          setSelectedStrategy(strategyWithSignals);
          
          // Enhanced signal processing
          let processedSignals;
          if (enhancedAccuracy) {
            processedSignals = signalProcessor.processSignal(
              selectedSymbol,
              marketData,
              strategyWithSignals,
              currentPrice
            );
            
            // Convert processed signals to expected format
            const enhancedRecommendation = {
              action: processedSignals.action,
              confidence: processedSignals.confidence > 75 ? 'Very High' : 
                         processedSignals.confidence > 60 ? 'High' :
                         processedSignals.confidence > 45 ? 'Medium' : 'Low',
              icon: processedSignals.action.includes('BUY') ? '🚀' :
                    processedSignals.action.includes('SELL') ? '⬇️' :
                    processedSignals.action === 'HOLD' ? '⏸️' : '⏳',
              color: processedSignals.action.includes('BUY') ? 'green' :
                     processedSignals.action.includes('SELL') ? 'red' :
                     processedSignals.action === 'HOLD' ? 'orange' : 'gray',
              estimatedTime: calculateEstimatedTime(marketData, strategyWithSignals),
              reason: processedSignals.recommendation
            };
            
            const enhancedSignalStrength = {
              strength: Math.round(processedSignals.confidence),
              conditions: processedSignals.confidence > 70 ? 'Favorable' : 
                         processedSignals.confidence > 40 ? 'Risky' : 'Unfavorable',
              verdict: processedSignals.confidence > 70 ? 'buy' : 
                      processedSignals.confidence > 40 ? 'risk' : 'sell'
            };
            
            setLiveSignals({
              signalData: enhancedSignalStrength,
              recommendation: enhancedRecommendation,
              strategy: strategyWithSignals,
              enhanced: true,
              accuracy: processedSignals.accuracy,
              timestamp: new Date().toISOString()
            });
          } else {
            // Standard signal processing
            setLiveSignals({
              signalData: marketData.signalStrength,
              recommendation: marketData.recommendation,
              strategy: strategyWithSignals,
              enhanced: false,
              timestamp: new Date().toISOString()
            });
          }
        }
        
        setLastUpdate(new Date().toLocaleTimeString());
      }, 1500); // Update every 1.5 seconds for more responsive signals
    }
    return () => clearInterval(interval);
  }, [autoRefresh, analysis, selectedMarket, selectedSymbol, selectedTimeframe, selectedStrategy, currentPrice, enhancedAccuracy]);

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
    setLiveSignals(null);
  };

  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol);
    setAnalysis(null);
    setAutoRefresh(false);
    setSelectedStrategy(null);
    setCurrentPrice(null);
    setLiveSignals(null);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    setAnalysis(null);
    setAutoRefresh(false);
    setSelectedStrategy(null);
    setLiveSignals(null);
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

      // If live mode is active, recalculate signals with new price
      if (autoRefresh && selectedStrategy) {
        if (enhancedAccuracy) {
          // Use enhanced signal processing
          const processedSignals = signalProcessor.processSignal(
            selectedSymbol,
            updatedAnalysis,
            selectedStrategy,
            priceData
          );
          
          const enhancedRecommendation = {
            action: processedSignals.action,
            confidence: processedSignals.confidence > 75 ? 'Very High' : 
                       processedSignals.confidence > 60 ? 'High' :
                       processedSignals.confidence > 45 ? 'Medium' : 'Low',
            icon: processedSignals.action.includes('BUY') ? '🚀' :
                  processedSignals.action.includes('SELL') ? '⬇️' :
                  processedSignals.action === 'HOLD' ? '⏸️' : '⏳',
            color: processedSignals.action.includes('BUY') ? 'green' :
                   processedSignals.action.includes('SELL') ? 'red' :
                   processedSignals.action === 'HOLD' ? 'orange' : 'gray',
            estimatedTime: calculateEstimatedTime(updatedAnalysis, selectedStrategy),
            reason: processedSignals.recommendation
          };
          
          const enhancedSignalStrength = {
            strength: Math.round(processedSignals.confidence),
            conditions: processedSignals.confidence > 70 ? 'Favorable' : 
                       processedSignals.confidence > 40 ? 'Risky' : 'Unfavorable',
            verdict: processedSignals.confidence > 70 ? 'buy' : 
                    processedSignals.confidence > 40 ? 'risk' : 'sell'
          };
          
          setLiveSignals({
            signalData: enhancedSignalStrength,
            recommendation: enhancedRecommendation,
            strategy: selectedStrategy,
            enhanced: true,
            accuracy: processedSignals.accuracy,
            timestamp: new Date().toISOString()
          });
        } else {
          // Standard signal processing
          const newSignalStrength = calculateDynamicSignalStrength(updatedAnalysis, priceData);
          const newRecommendation = generateDynamicRecommendation(updatedAnalysis, priceData, selectedStrategy);
          
          setLiveSignals({
            signalData: newSignalStrength,
            recommendation: newRecommendation,
            strategy: selectedStrategy,
            enhanced: false,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
  };

  // Standard signal strength calculation (fallback)
  const calculateDynamicSignalStrength = (marketData, priceData) => {
    const { rsi } = marketData.technicalOverview;
    const { volatility } = marketData.marketInfo;
    const priceChange = Math.abs(priceData.changePercent);
    
    let signalStrength = 0;
    
    // RSI-based signals (30 points max)
    if (rsi > 30 && rsi < 70) signalStrength += 20;
    if (rsi < 30 || rsi > 70) signalStrength += 30; // Oversold/Overbought
    
    // Volatility-based signals (25 points max)
    if (volatility === 'Low' && priceChange < 0.5) signalStrength += 25;
    else if (volatility === 'Medium' && priceChange < 1.0) signalStrength += 20;
    else if (volatility === 'High' && priceChange > 1.0) signalStrength += 15;
    
    // Price momentum (25 points max)
    if (priceChange > 0.1 && priceChange < 2.0) signalStrength += 25;
    else if (priceChange > 2.0) signalStrength += 10; // Too volatile
    
    // Strategy confidence boost (20 points max)
    if (selectedStrategy && selectedStrategy.signals.confidence > 70) signalStrength += 20;
    else if (selectedStrategy && selectedStrategy.signals.confidence > 50) signalStrength += 15;
    
    signalStrength = Math.min(100, Math.max(0, signalStrength));
    
    return {
      strength: Math.round(signalStrength),
      conditions: signalStrength > 70 ? 'Favorable' : signalStrength > 40 ? 'Risky' : 'Unfavorable',
      verdict: signalStrength > 70 ? 'buy' : signalStrength > 40 ? 'risk' : 'sell'
    };
  };

  // Standard recommendation generation (fallback)
  const generateDynamicRecommendation = (marketData, priceData, strategy) => {
    const { rsi } = marketData.technicalOverview;
    const priceChange = priceData.changePercent;
    const currentPrice = priceData.price;
    
    let action, confidence, icon, color, reason;
    
    // Strategy-based recommendations
    if (strategy && strategy.signals) {
      const entryBuy = strategy.signals.etryPoints.buy;
      const entrySell = strategy.signals.entryPoints.sell;
      
      if (currentPrice <= entryBuy && rsi < 40) {
        action = 'STRONG BUY';
        confidence = 'Very High';
        icon = '🚀';
        color = 'green';
        reason = `Price at optimal buy entry (${entryBuy.toFixed(5)}) with oversold RSI`;
      } else if (currentPrice >= entrySell && rsi > 60) {
        action = 'STRONG SELL';
        confidence = 'Very High';
        icon = '⬇️';
        color = 'red';
        reason = `Price at optimal sell entry (${entrySell.toFixed(5)}) with overbought RSI`;
      } else if (priceChange > 0 && rsi < 50) {
        ction = 'BUY';
        confidence = 'High';
        icon = '📈';
        color = 'green';
       reason = 'Positive momentum with bullish RSI';
      } else if (priceChange < 0 && rsi > 50) {
        action = 'SELL';
        confidence = 'High';
        icon = '📉';
        color = 'red';
        reason = 'Negative momentum with bearish RSI';
      } else {
        action = 'WAIT';
        confidence = 'Medium';
       icon = '⏳';
        color = 'orange';
        reason = 'Mixed signals - waiting for clearer direction';
      }
    } else {
      // Fallback to basic technical analysis
      if (rsi < 30 && priceChange > 0) {
        action = 'BUY';
        confidence = 'High';
        icon = '📈';
        color = 'green';
        reason = 'Oversold bounce detected';
      } else if (rsi > 70 && priceChange < 0) {
        action = 'SELL';
        confidence = 'High';
        icon = '📉';
        color = 'red';
        reason = 'Overbought correction detected';
      } else {
        action = 'HOLD';
        confidence = 'Medium';
        icon = '⏸️';
        color = 'gray';
        reason = 'Neutral market conditions';
      }
    }   
    // Calculate estimated time based on strategy and volatility
    const estimatedTime = calculateEstimatedTime(marketData, strategy);
    
    return {
      action,
      confidence,
      icon,
      color,
      estimatedTime,
      reason
    };
  };

  const calculateEstimatedTime = (marketData, strategy) => {
    const volatility = marketData.marketInfo.volatility;
    const baseTime = selectedTimeframe === '30s' ? 1 : 
                    selectedTimeframe === '1m' ? 2 :
                    selectedTimeframe === '5m' ? 5 : 10;
    
    let multiplier = 1;
    if (volatility === 'High') multiplier = 0.7;
    else if (volatility === 'Low') multiplier = 1.5;
    
    if (strategy && strategy.strategy && strategy.strategy.riskLevel === 'High') multiplier *= 0.8;
    
    const minutes = Math.round(baseTime * multiplier);
    return minutes < 60 ? `${minutes}m` : `${Math.round(minutes/60)}h`;
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
      
      // Auto-select optimal strategy
      if (selectedMarket && selectedSymbol && selectedTimeframe) {
        const optimalStrategy = mlEngine.selectOptimalStrategy(
          selectedMarket, 
          selectedSymbol, 
          selectedTimeframe, 
          marketData
        );
        
        const strategyWithSignals = mlEngine.generateStrategySignals(optimalStrategy, marketData);
        setSelectedStrategy(strategyWithSignals);
        
        // Initialize live signals with enhanced processing if enabled
        if (enhancedAccuracy) {
          const processedSignals = signalProcessor.processSignal(
            selectedSymbol,
            marketData,
            strategyWithSignals,
            currentPrice
          );
          
          const enhancedRecommendation = {
            action: processedSignals.action,
            confidence: processedSignals.confidence > 75 ? 'Very High' : 
                       processedSignals.confidence > 60 ? 'High' :
                       processedSignals.confidence > 45 ? 'Medium' : 'Low',
            icon: processedSignals.action.includes('BUY') ? '🚀' :
                  processedSignals.action.includes('SELL') ? '⬇️' :
                  processedSignals.action === 'HOLD' ? '⏸️' : '⏳',
            color: processedSignals.action.includes('BUY') ? 'green' :
                   processedSignals.action.includes('SELL') ? 'red' :
                   processedSignals.action === 'HOLD' ? 'orange' : 'gray',
            estimatedTime: calculateEstimatedTime(marketData, strategyWithSignals),
            reason: processedSignals.recommendation
          };
          
          const enhancedSignalStrength = {
            strength: Math.round(processedSignals.confidence),
            conditions: processedSignals.confidence > 70 ? 'Favorable' : 
                       processedSignals.confidence > 40 ? 'Risky' : 'Unfavorable',
            verdict: processedSignals.confidence > 70 ? 'buy' : 
                    processedSignals.confidence > 40 ? 'risk' : 'sell'
          };
          
          setLiveSignals({
            signalData: enhancedSignalStrength,
            recommendation: enhancedRecommendation,
            strategy: strategyWithSignals,
            enhanced: true,
            accuracy: processedSignals.accuracy,
            timestamp: new Date().toISOString()
          });
        } else {
          // Standard signal processing
          setLiveSignals({
            signalData: marketData.signalStrength,
            recommendation: marketData.recommendation,
            strategy: strategyWithSignals,
            enhanced: false,
            timestamp: new Date().toISOString()
          });
        }
      }
    }, 1500);
  };

  const refreshAnalysis = () => {
    if (selectedMarket && selectedSymbol && selectedTimeframe) {
      analyzeMarket();
    }
  };

  const toggleAutoRefresh = () => {
    const newAutoRefresh = !autoRefresh;
    setAutoRefresh(newAutoRefresh);
    
    if (newAutoRefresh && !liveSignals && analysis) {
      // Initialize live signals when starting auto-refresh
      if (enhancedAccuracy && selectedStrategy) {
        const processedSignals = signalProcessor.processSignal(
          selectedSymbol,
          analysis,
          selectedStrategy,
          currentPrice
        );
        
        const enhancedRecommendation = {
          action: processedSignals.action,
          confidence: processedSignals.confidence > 75 ? 'Very High' : 
                     processedSignals.confidence > 60 ? 'High' :
                     processedSignals.confidence > 45 ? 'Medium' : 'Low',
          icon: processedSignals.action.includes('BUY') ? '🚀' :
                processedSignals.action.includes('SELL') ? '⬇️' :
                processedSignals.action === 'HOLD' ? '⏸️' : '⏳',
          color: processedSignals.action.includes('BUY') ? 'green' :
                 processedSignals.action.includes('SELL') ? 'red' :
                 processedSignals.action === 'HOLD' ? 'orange' : 'gray',
          estimatedTime: calculateEstimatedTime(analysis, selectedStrategy),
          reason: processedSignals.recommendation
        };
        
        const enhancedSignalStrength = {
          strength: Math.round(processedSignals.confidence),
          conditions: processedSignals.confidence > 70 ? 'Favorable' : 
                     processedSignals.confidence > 40 ? 'Risky' : 'Unfavorable',
          verdict: processedSignals.confidence > 70 ? 'buy' : 
                  processedSignals.confidence > 40 ? 'risk' : 'sell'
        };
        
        setLiveSignals({
          signalData: enhancedSignalStrength,
          recommendation: enhancedRecommendation,
          strategy: selectedStrategy,
          enhanced: true,
          accuracy: processedSignals.accuracy,
          timestamp: new Date().toISOString()
        );
      } else {
        setLiveSignals({
          signalData: analysis.signalStrength,
          recommendation: analysis.recommendation,
          strategy: selectedStrategy,
          enhanced: false,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const handleConnectionChange = (connected) => {
    setIsConnectedToPO(connected);
  };

  const handleStrategyChange = (strategy) => {
    setSelectedStrategy(strategy);
    
    // Update live signals when strategy changes
    if (analysis && autoRefresh) {
      if (enhancedAccuracy) {
        const processedSignals = signalProcessor.processSignal(
          selectedSymbol,
          analysis,
          strategy,
          currentPrice
        );
        
        const enhancedRecommendation = {
          action: processedSignals.action,
          confidence: processedSignals.confidence > 75 ? 'Very High' : 
                     processedSignals.confidence > 60 ? 'High' :
                     processedSignals.confidence > 45 ? 'Medium' : 'Low',
          icon: processedSignals.action.includes('BUY') ? '🚀' :
                processedSignals.action.includes('SELL') ? '⬇️' :
                processedSignals.action === 'HOLD' ? '⏸️' : '⏳',
          color: processedSignals.action.includes('BUY') ? 'green' :
                 processedSignals.action.includes('SELL') ? 'red' :
                 processedSignals.action === 'HOLD' ? 'orange' : 'gray',
          estimatedTime: calculateEstimatedTime(analysis, strategy),
          reason: processedSignals.recommendation
        };
        
        const enhancedSignalStrength = {
          strength: Math.round(processedSignals.confidence),
          conditions: processedSignals.confidence > 70 ? 'Favorable' : 
                     processedSignals.confidence > 40 ? 'Risky' : 'Unfavorable',
          verdict: processedSignals.confidence > 70 ? 'buy' : 
                  processedSignals.confidence > 40 ? 'risk' : 'sell'
        };
        
        setLiveSignals({
          signalData: enhancedSignalStrength,
          recommendation: enhancedRecommendation,
          strategy: strategy,
          enhanced: true,
          accuracy: processedSignals.accuracy,
          timestamp: new Date().toISOString()
        });
      } else {
        const newSignalStrength =calculateDynamicSignalStrength(analysis, currentPrice || { changePercent: 0, price: parseFloat(analysis.technicalOverview.currentPrice) });
        const newRecommendation = generateDynamicRecommendation(analysis, currentPrice || { changePercent: 0, price: parseFloat(analysis.technicalOverview.currentPrice) }, strategy);
        
        setLiveSignals({
          signalData: newSignalStrength,
          recommendation: newRecommendation,
          strategy: strategy,
          enhanced: false,
          timestamp: new Date().toISOString()
        });
      }
    }
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
            Real-ti pricing • AI strategies • Direct trading integration
          </p>
          
          {/* Live Status Indicators */}
          <div className="flex justify-center items-center space-x-6 flex-wrap">
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
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${liveSignals ? 'bg-purple-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {liveSignals ? (liveSignals.enhanced ? 'Enhanced Signals Active' : 'Live Signals Active') : 'Static Signals'}
              </span>
            </div>
            {liveSignals && liveSignals.enhanced && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-gold-500 animate-pulse" style={{backgroundColor: '#FFD700'}}></div>
                <span className="text-sm text-gray-600">
                  Accuracy: {liveSignals.accuracy || 65}%
                </span>
              </div>
            )}
            {lastUpdate && (
              <div className="text-sm text-gray-500">
                Last Update: {lastUpdate}
              </div>
            )}
          </div>
          
          {/* Enhanced Accuracy Toggle */}
          <div className="mt-4 flex justify-center items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Enhanced Accuracy Mode:</span>
            <button
              onClick={() => setEnhancedAccuracy(!enhancedAccuracy)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enhancedAccuracy ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enhancedAccuracy ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-gray-500">
              {enhancedAccuracy ? 'Multi-layer signal processing enabled' : 'Standard signal processing'}
            </span>
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
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 
