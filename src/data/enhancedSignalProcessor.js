// Enhanced Signal Processing for improved trading accuracy

export class EnhancedSignalProcessor {
  constructor() {
    this.signalHistory = new Map();
    this.accuracyMetrics = new Map();
    this.adaptiveThresholds = new Map();
  }

  // Process and enhance trading signals with multiple confirmations
  processSignal(symbol, marketData, strategy, priceData) {
    const signals = this.generateMultiLayerSignals(symbol, marketData, strategy, priceData);
    const confidence = this.calculateSignalConfidence(signals);
    const filteredSignal = this.applySignalFilters(signals, confidence);
    
    // Store signal for learning
    this.storeSignalHistory(symbol, filteredSignal);
    
    return {
      ...filteredSignal,
      confidence: confidence,
      accuracy: this.getHistoricalAccuracy(symbol),
      timestamp: Date.now()
    };
  }

  generateMultiLayerSignals(symbol, marketData, strategy, priceData) {
    const technical = this.analyzeTechnicalIndicators(marketData);
    const momentum = this.analyzeMomentum(priceData);
    const volume = this.analyzeVolumeProfile(priceData);
    const sentiment = this.analyzeSentiment(marketData);
    const pattern = this.analyzePatterns(symbol, priceData);
    
    return {
      technical,
      momentum,
      volume,
      sentiment,
      pattern,
      strategy: strategy ? this.analyzeStrategyAlignment(strategy, marketData) : null
    };
  }

  analyzeTechnicalIndicators(marketData) {
    const { rsi, macd } = marketData.technicalOverview;
    const { volatility, sentiment } = marketData.marketInfo;
    
    let score = 0;
    let signals = [];
    
    // RSI Analysis (Enhanced)
    if (rsi < 25) {
      score += 30;
      signals.push('Strong Oversold - High Buy Probability');
    } else if (rsi < 35) {
      score += 20;
      signals.push('Oversold - Buy Signal');
    } else if (rsi > 75) {
      score -= 30;
      signals.push('Strong Overbought - High Sell Probability');
    } else if (rsi > 65) {
      score -= 20;
      signals.push('Overbought - Sell Signal');
    } else if (rsi >= 45 && rsi <= 55) {
      score += 10;
      signals.push('RSI Neutral - Stable Conditions');
    }
    
    // MACD Analysis
    if (macd.includes('Bullish')) {
      score += 15;
      signals.push('MACD Bullish Crossover');
    } else if (macd.includes('Bearish')) {
      score -= 15;
      signals.push('MACD Bearish Crossover');
    }
    
    // Volatility-Sentiment Correlation
    if (volatility === 'Low' && sentiment.includes('Bullish')) {
      score += 20;
      signals.push('Low Volatility Bullish Environment');
    } else if (volatility === 'High' && sentiment.includes('Bearish')) {
      score -= 15;
      signals.push('High Volatility Bearish Environment');
    }
    
    return { score: Math.max(-100, Math.min(100, score)), signals };
  }

  analyzeMomentum(priceData) {
    if (!priceData) return { score: 0, signals: ['No price data available'] };
    
    const { changePercent, trend } = priceData;
    let score = 0;
    let signals = [];
    
    // Price momentum analysis
    if (Math.abs(changePercent) > 0.5) {
      if (changePercent > 0) {
        score += 25;
        signals.push(`Strong Upward Momentum (+${changePercent.toFixed(2)}%)`);
      } else {
        score -= 25;
        signals.push(`Strong Downward Momentum (${changePercent.toFixed(2)}%)`);
      }
    } else if (Math.abs(changePercent) > 0.1) {
      score += changePercent > 0 ? 15 : -15;
      signals.push(`Moderate ${changePercent > 0 ? 'Upward' : 'Downward'} Momentum`);
    } else {
      score += 5;
      signals.push('Stable Price Action');
    }
    
    // Trend analysis
    if (trend) {
      if (trend > 0.001) {
        score += 20;
        signals.push('Strong Uptrend Confirmed');
      } else if (trend < -0.001) {
        score -= 20;
        signals.push('Strong Downtrend Confirmed');
      }
    }
    
    return { score: Math.max(-100, Math.min(100, score)), signals };
  }

  analyzeVolumeProfile(priceData) {
    if (!priceData || !priceData.volume) return { score: 0, signals: ['No volume data'] };
    
    const { volume, changePercent } = priceData;
    let score = 0;
    let signals = [];
    
    // Volume-Price relationship
    if (volume > 50000 && Math.abs(changePercent) > 0.2) {
      score += changePercent > 0 ? 25 : -25;
      signals.push(`High Volume ${changePercent > 0 ? 'Buying' : 'Selling'} Pressure`);
    } else if (volume < 10000 && Math.abs(changePercent) < 0.1) {
      score += 10;
      signals.push('Low Volume Consolidation');
    } else if (volume > 30000) {
      score += 15;
      signals.push('Above Average Volume Activity');
    }
    
    return { score: Math.max(-100, Math.min(100, score)), signals };
  }

  analyzeSentiment(marketData) {
    const { sentiment } = marketData.marketInfo;
    let score = 0;
    let signals = [];
    
    switch (sentiment) {
      case 'Strong Bullish':
        score = 30;
        signals.push('Very Positive Market Sentiment');
        break;
      case 'Bullish':
        score = 20;
        signals.push('Positive Market Sentiment');
        break;
      case 'Neutral':
        score = 5;
        signals.push('Neutral Market Sentiment');
        break;
      case 'Bearish':
        score = -20;
        signals.push('Negative Market Sentiment');
        break;
      case 'Strong Bearish':
        score = -30;
        signals.push('Very Negative Market Sentiment');
        break;
      default:
        score = 0;
        signals.push('Unknown Market Sentiment');
    }
    
    return { score, signals };
  }

  analyzePatterns(symbol, priceData) {
    // Simple pattern recognition
    const history = this.signalHistory.get(symbol) || [];
    let score = 0;
    let signals = [];
    
    if (history.length >= 3) {
      const recent = history.slice(-3);
      const prices = recent.map(h => h.price || 0);
      
      // Check for patterns
      if (prices[0] < prices[1] && prices[1] < prices[2]) {
        score += 20;
        signals.push('Ascending Price Pattern Detected');
      } else if (prices[0] > prices[1] && prices[1] > prices[2]) {
        score -= 20;
        signals.push('Descending Price Pattern Detected');
      } else if (Math.abs(prices[0] - prices[2]) < prices[1] * 0.001) {
        score += 10;
        signals.push('Consolidation Pattern Detected');
      }
    }
    
    return { score: Math.max(-100, Math.min(100, score)), signals };
  }

  analyzeStrategyAlignment(strategy, marketData) {
    if (!strategy || !strategy.signals) return { score: 0, signals: ['No strategy selected'] };
    
    const currentPrice = parseFloat(marketData.technicalOverview.currentPrice);
    const entryBuy = strategy.signals.entryPoints.buy;
    const entrySell = strategy.signals.entryPoints.sell;
    
    let score = 0;
    let signals = [];
    
    // Check alignment with strategy entry points
    const buyDistance = Math.abs(currentPrice - entryBuy) / currentPrice;
    const sellDistance = Math.abs(currentPrice - entrySell) / currentPrice;
    
    if (buyDistance < 0.001) {
      score += 35;
      signals.push('Price at Optimal Buy Entry Point');
    } else if (sellDistance < 0.001) {
      score -= 35;
      signals.push('Price at Optimal Sell Entry Point');
    } else if (buyDistance < 0.005) {
      score += 20;
      signals.push('Price Near Buy Entry Point');
    } else if (sellDistance < 0.005) {
      score -= 20;
      signals.push('Price Near Sell Entry Point');
    }
    
    // Strategy confidence boost
    if (strategy.signals.confidence > 80) {
      score += 15;
      signals.push('High Strategy Confidence');
    } else if (strategy.signals.confidence > 60) {
      score += 10;
      signals.push('Medium Strategy Confidence');
    }
    
    return { score: Math.max(-100, Math.min(100, score)), signals };
  }

  calculateSignalConfidence(signals) {
    const weights = {
      technical: 0.25,
      momentum: 0.20,
      volume: 0.15,
      sentiment: 0.15,
      pattern: 0.10,
      strategy: 0.15
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.keys(signals).forEach(key => {
      if (signals[key] && weights[key]) {
        totalScore += signals[key].score * weights[key];
        totalWeight += weights[key];
      }
    });
    
    const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    
    // Convert to confidence percentage (0-100)
    return Math.max(0, Math.min(100, 50 + normalizedScore));
  }

  applySignalFilters(signals, confidence) {
    // Apply adaptive thresholds and filters
    let action = 'HOLD';
    let strength = 'Medium';
    let recommendation = 'Wait for better opportunity';
    
    if (confidence > 75) {
      action = signals.technical.score > 0 ? 'STRONG BUY' : 'STRONG SELL';
      strength = 'Very High';
      recommendation = `High confidence ${action.toLowerCase()} signal detected`;
    } else if (confidence > 60) {
      action = signals.technical.score > 0 ? 'BUY' : 'SELL';
      strength = 'High';
      recommendation = `Good ${action.toLowerCase()} opportunity identified`;
    } else if (confidence > 45) {
      action = 'HOLD';
      strength = 'Medium';
      recommendation = 'Mixed signals - consider waiting';
    } else {
      action = 'WAIT';
      strength = 'Low';
      recommendation = 'Insufficient signal strength - avoid trading';
    }
    
    return {
      action,
      strength,
      recommendation,
      allSignals: signals,
      confidence
    };
  }

  storeSignalHistory(symbol, signal) {
    if (!this.signalHistory.has(symbol)) {
      this.signalHistory.set(symbol, []);
    }
    
    const history = this.signalHistory.get(symbol);
    history.push({
      ...signal,
      timestamp: Date.now()
    });
    
    // Keep only last 50 signals
    if (history.length > 50) {
      history.shift();
    }
  }

  getHistoricalAccuracy(symbol) {
    const history = this.signalHistory.get(symbol);
    if (!history || history.length < 5) return 65; // Default accuracy
    
    // Simple accuracy calculation based on signal consistency
    const recentSignals = history.slice(-10);
    const avgConfidence = recentSignals.reduce((sum, s) => sum + (s.confidence || 50), 0) / recentSignals.length;
    
    return Math.round(avgConfidence);
  }

  // Get signal summary for display
  getSignalSummary(processedSignal) {
    const { allSignals, confidence, action, recommendation } = processedSignal;
    
    const summary = {
      primaryAction: action,
      confidence: Math.round(confidence),
      recommendation,
      breakdown: {
        technical: allSignals.technical.score,
        momentum: allSignals.momentum.score,
        volume: allSignals.volume.score,
        sentiment: allSignals.sentiment.score,
        pattern: allSignals.pattern.score,
        strategy: allSignals.strategy ? allSignals.strategy.score : 0
      },
      signals: []
    };
    
    // Collect all signal descriptions
    Object.values(allSignals).forEach(signal => {
      if (signal && signal.signals) {
        summary.signals.push(...signal.signals);
      }
    });
    
    return summary;
  }
}

export const signalProcessor = new EnhancedSignalProcessor();