// Enhanced trading data with Pocket Option currencies and real-time recommendations

export const markets = {
  forex: [
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'USDCHF', 'EURJPY',
    'GBPJPY', 'AUDJPY', 'CADJPY', 'CHFJPY', 'NZDJPY', 'EURGBP', 'EURAUD', 'EURCAD',
    'EURCHF', 'EURNZD', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'GBPNZD', 'AUDCAD', 'AUDCHF',
    'AUDNZD', 'CADCHF', 'NZDCAD', 'NZDCHF', 'XAUUSD', 'XAGUSD', 'USOIL', 'UKBRENT'
  ],
  crypto: [
    'BTCUSD', 'ETHUSD', 'LTCUSD', 'XRPUSD', 'ADAUSD', 'DOTUSD', 'LINKUSD', 'BNBUSD',
    'SOLUSD', 'MATICUSD', 'AVAXUSD', 'UNIUSD', 'ATOMUSD', 'XLMUSD', 'VETUSD', 'FILUSD',
    'TRXUSD', 'ETCUSD', 'XMRUSD', 'DASHUSD', 'ZECUSD', 'BCHUSD', 'EOSUSD', 'IOTAUSD'
  ],
  stocks: [
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NFLX', 'NVDA', 'AMD', 'INTC',
    'CRM', 'ORCL', 'ADBE', 'PYPL', 'UBER', 'SPOT', 'ZOOM', 'SQ', 'SHOP', 'TWTR',
    'SNAP', 'PINS', 'ROKU', 'ZM', 'DOCU', 'PLTR', 'COIN', 'HOOD', 'RBLX', 'DKNG'
  ],
  indices: [
    'NASDAQ100', 'SP500', 'DOW30', 'RUSSELL2000', 'VIX', 'FTSE100', 'DAX30', 'CAC40',
    'NIKKEI225', 'HANGSENG', 'ASX200', 'IBEX35', 'SMI', 'AEX', 'BEL20', 'ATX'
  ],
  commodities: [
    'GOLD', 'SILVER', 'COPPER', 'PLATINUM', 'PALLADIUM', 'CRUDE_OIL', 'BRENT_OIL',
    'NATURAL_GAS', 'WHEAT', 'CORN', 'SOYBEANS', 'SUGAR', 'COFFEE', 'COCOA', 'COTTON'
  ]
};

export const timeframes = ['30s', '1m', '2m', '5m', '15m', '30m', '1h', '4h', '1d'];

// Real-time recommendation types
export const recommendationTypes = {
  BUY: { action: 'BUY', color: 'green', icon: '📈', confidence: 'High' },
  SELL: { action: 'SELL', color: 'red', icon: '📉', confidence: 'High' },
  STRONG_BUY: { action: 'STRONG BUY', color: 'green', icon: '🚀', confidence: 'Very High' },
  STRONG_SELL: { action: 'STRONG SELL', color: 'red', icon: '⬇️', confidence: 'Very High' },
  HOLD: { action: 'HOLD', color: 'orange', icon: '⏸️', confidence: 'Medium' },
  WAIT: { action: 'WAIT', color: 'gray', icon: '⏳', confidence: 'Low' }
};

// Generate realistic market data similar to Pocket Option
export const generateMarketData = (market, symbol, timeframe) => {
  const basePrice = getRealisticPrice(symbol);
  const volatility = Math.random() * 100;
  const volume = Math.random() * 100;
  const rsi = Math.random() * 100;
  const sentiment = Math.random();
  
  // Generate more realistic price movements
  const priceVariation = basePrice * (Math.random() - 0.5) * 0.001; // 0.1% variation
  const currentPrice = basePrice + priceVariation;
  
  // Calculate technical indicators with more realistic values
  const resistance1 = currentPrice * (1 + Math.random() * 0.005);
  const resistance2 = currentPrice * (1 + Math.random() * 0.01);
  const support1 = currentPrice * (1 - Math.random() * 0.005);
  const support2 = currentPrice * (1 - Math.random() * 0.01);
  
  // Generate real-time recommendation
  const recommendation = generateRecommendation(rsi, volatility, sentiment);
  const estimatedTime = generateEstimatedTime(timeframe, recommendation);
  
  // MACD and other indicators
  const macdSignal = Math.random() > 0.5 ? 'Bullish crossover' : 'Bearish crossover';
  const maType = Math.random() > 0.5 ? 'Above' : 'Below';
  
  // Calculate signal strength based on multiple factors
  let signalStrength = 0;
  if (rsi > 30 && rsi < 70) signalStrength += 25;
  if (volatility < 60) signalStrength += 20;
  if (volume > 50) signalStrength += 25;
  if (recommendation.confidence === 'Very High') signalStrength += 30;
  else if (recommendation.confidence === 'High') signalStrength += 20;
  else if (recommendation.confidence === 'Medium') signalStrength += 10;
  
  signalStrength = Math.min(100, Math.max(0, signalStrength));
  
  return {
    marketInfo: {
      volatility: volatility < 30 ? 'Low' : volatility < 70 ? 'Medium' : 'High',
      assetStrength: Math.round(volume),
      volumeResult: Math.round(volatility),
      sentiment: sentiment < 0.2 ? 'Strong Bearish' : sentiment < 0.4 ? 'Bearish' : sentiment < 0.6 ? 'Neutral' : sentiment < 0.8 ? 'Bullish' : 'Strong Bullish',
      lastUpdate: new Date().toLocaleTimeString()
    },
    technicalOverview: {
      currentPrice: currentPrice.toFixed(getDecimalPlaces(symbol)),
      priceChange: (priceVariation >= 0 ? '+' : '') + priceVariation.toFixed(getDecimalPlaces(symbol)),
      priceChangePercent: ((priceVariation / basePrice) * 100).toFixed(2),
      resistance1: resistance1.toFixed(getDecimalPlaces(symbol)),
      resistance2: resistance2.toFixed(getDecimalPlaces(symbol)),
      support1: support1.toFixed(getDecimalPlaces(symbol)),
      support2: support2.toFixed(getDecimalPlaces(symbol)),
      rsi: Math.round(rsi),
      rsiStatus: rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Normal',
      macd: macdSignal,
      movingAverage: `${maType} 50 EMA`
    },
    signalStrength: {
      strength: Math.round(signalStrength),
      conditions: signalStrength > 70 ? 'Favorable' : signalStrength > 40 ? 'Risky' : 'Unfavorable',
      verdict: signalStrength > 70 ? 'buy' : signalStrength > 40 ? 'risk' : 'sell'
    },
    recommendation: {
      action: recommendation.action,
      confidence: recommendation.confidence,
      icon: recommendation.icon,
      color: recommendation.color,
      estimatedTime: estimatedTime,
      reason: generateRecommendationReason(recommendation, rsi, volatility)
    }
  };
};

// Generate real-time trading recommendation
const generateRecommendation = (rsi, volatility, sentiment) => {
  const recommendations = Object.values(recommendationTypes);
  
  // Logic for recommendation based on indicators
  if (rsi < 30 && sentiment > 0.6) return recommendationTypes.STRONG_BUY;
  if (rsi > 70 && sentiment < 0.4) return recommendationTypes.STRONG_SELL;
  if (rsi < 40 && volatility < 50) return recommendationTypes.BUY;
  if (rsi > 60 && volatility < 50) return recommendationTypes.SELL;
  if (volatility > 80) return recommendationTypes.WAIT;
  
  // Default to random selection weighted by market conditions
  const weights = [0.15, 0.15, 0.1, 0.1, 0.25, 0.25]; // BUY, SELL, STRONG_BUY, STRONG_SELL, HOLD, WAIT
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < recommendations.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) return recommendations[i];
  }
  
  return recommendationTypes.HOLD;
};

// Generate estimated time for the recommendation
const generateEstimatedTime = (timeframe, recommendation) => {
  const timeMultiplier = {
    '30s': 0.5,
    '1m': 1,
    '2m': 2,
    '5m': 5,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '4h': 240,
    '1d': 1440
  };
  
  const baseTime = timeMultiplier[timeframe] || 5;
  const confidenceMultiplier = {
    'Very High': 0.8,
    'High': 1.0,
    'Medium': 1.5,
    'Low': 2.0
  };
  
  const estimatedMinutes = Math.round(baseTime * confidenceMultiplier[recommendation.confidence] * (0.5 + Math.random()));
  
  if (estimatedMinutes < 60) {
    return `${estimatedMinutes}m`;
  } else if (estimatedMinutes < 1440) {
    return `${Math.round(estimatedMinutes / 60)}h`;
  } else {
    return `${Math.round(estimatedMinutes / 1440)}d`;
  }
};

// Generate reason for recommendation
const generateRecommendationReason = (recommendation, rsi, volatility) => {
  const reasons = {
    'STRONG BUY': ['Oversold conditions with bullish momentum', 'Strong support level reached', 'Positive market sentiment surge'],
    'BUY': ['Technical indicators align bullish', 'Breaking resistance levels', 'Volume increasing on uptrend'],
    'STRONG SELL': ['Overbought with bearish divergence', 'Major resistance rejection', 'Negative sentiment dominating'],
    'SELL': ['Technical indicators turn bearish', 'Breaking support levels', 'Volume declining on rally'],
    'HOLD': ['Mixed signals in the market', 'Consolidation phase detected', 'Waiting for clearer direction'],
    'WAIT': ['High volatility period', 'Unclear market direction', 'Major news event pending']
  };
  
  const actionReasons = reasons[recommendation.action] || reasons['HOLD'];
  return actionReasons[Math.floor(Math.random() * actionReasons.length)];
};

// More realistic prices similar to Pocket Option
const getRealisticPrice = (symbol) => {
  const prices = {
    // Forex - Updated to realistic current prices
    'EURUSD': 1.08500,
    'GBPUSD': 1.26420,
    'USDJPY': 149.850,
    'AUDUSD': 0.67250,
    'USDCAD': 1.34580,
    'NZDUSD': 0.61480,
    'USDCHF': 0.89750,
    'EURJPY': 162.540,
    'GBPJPY': 189.320,
    'AUDJPY': 100.780,
    'CADJPY': 111.420,
    'CHFJPY': 166.950,
    'NZDJPY': 92.150,
    'EURGBP': 0.85840,
    'EURAUD': 1.61320,
    'EURCAD': 1.46080,
    'EURCHF': 0.97420,
    'EURNZD': 1.76450,
    'GBPAUD': 1.87950,
    'GBPCAD': 1.70180,
    'GBPCHF': 1.13520,
    'GBPNZD': 2.05680,
    'AUDCAD': 0.90520,
    'AUDCHF': 0.60380,
    'AUDNZD': 1.09420,
    'CADCHF': 0.66720,
    'NZDCAD': 0.82750,
    'NZDCHF': 0.55180,
    'XAUUSD': 2045.50,
    'XAGUSD': 24.85,
    'USOIL': 78.45,
    'UKBRENT': 82.30,
    
    // Crypto
    'BTCUSD': 43850.00,
    'ETHUSD': 2680.50,
    'LTCUSD': 73.25,
    'XRPUSD': 0.6180,
    'ADAUSD': 0.4920,
    'DOTUSD': 7.45,
    'LINKUSD': 15.80,
    'BNBUSD': 318.50,
    'SOLUSD': 98.75,
    'MATICUSD': 0.8450,
    'AVAXUSD': 38.20,
    'UNIUSD': 6.85,
    'ATOMUSD': 10.45,
    'XLMUSD': 0.1250,
    'VETUSD': 0.0285,
    'FILUSD': 5.65,
    'TRXUSD': 0.1045,
    'ETCUSD': 20.85,
    'XMRUSD': 158.50,
    'DASHUSD': 28.75,
    'ZECUSD': 28.90,
    'BCHUSD': 245.80,
    'EOSUSD': 0.6850,
    'IOTAUSD': 0.2180,
    
    // Stocks
    'AAPL': 195.89,
    'GOOGL': 142.56,
    'MSFT': 415.26,
    'TSLA': 248.48,
    'AMZN': 155.89,
    'META': 485.59,
    'NFLX': 486.73,
    'NVDA': 875.28,
    'AMD': 145.61,
    'INTC': 43.61,
    'CRM': 267.51,
    'ORCL': 118.35,
    'ADBE': 567.52,
    'PYPL': 58.77,
    'UBER': 62.08,
    'SPOT': 187.44,
    'ZOOM': 69.35,
    'SQ': 78.19,
    'SHOP': 65.24,
    'TWTR': 41.09,
    'SNAP': 10.33,
    'PINS': 36.07,
    'ROKU': 65.28,
    'ZM': 69.35,
    'DOCU': 55.17,
    'PLTR': 16.58,
    'COIN': 158.61,
    'HOOD': 13.24,
    'RBLX': 41.86,
    'DKNG': 35.92,
    
    // Indices
    'NASDAQ100': 16845.30,
    'SP500': 4750.89,
    'DOW30': 37504.81,
    'RUSSELL2000': 2027.07,
    'VIX': 13.45,
    'FTSE100': 7651.05,
    'DAX30': 16201.14,
    'CAC40': 7558.47,
    'NIKKEI225': 33151.20,
    'HANGSENG': 17047.34,
    'ASX200': 7348.70,
    'IBEX35': 9916.90,
    'SMI': 11138.91,
    'AEX': 798.52,
    'BEL20': 3659.28,
    'ATX': 3204.77,
    
    // Commodities
    'GOLD': 2045.50,
    'SILVER': 24.85,
    'COPPER': 3.85,
    'PLATINUM': 1015.30,
    'PALLADIUM': 1205.80,
    'CRUDE_OIL': 78.45,
    'BRENT_OIL': 82.30,
    'NATURAL_GAS': 2.65,
    'WHEAT': 6.15,
    'CORN': 4.85,
    'SOYBEANS': 12.75,
    'SUGAR': 0.2185,
    'COFFEE': 1.68,
    'COCOA': 3850.00,
    'COTTON': 0.7125
  };
  
  return prices[symbol] || 100;
};

const getDecimalPlaces = (symbol) => {
  if (symbol.includes('JPY')) return 3;
  if (symbol.startsWith('XAU') || symbol.startsWith('XAG')) return 2;
  if (symbol.includes('USD') && (symbol.startsWith('BTC') || symbol.startsWith('ETH'))) return 2;
  if (symbol.includes('USD') && symbol.length === 6) return 5; // Forex pairs
  if (symbol.includes('OIL') || symbol.includes('GOLD') || symbol.includes('SILVER')) return 2;
  if (['NASDAQ100', 'SP500', 'DOW30', 'FTSE100', 'DAX30', 'NIKKEI225'].includes(symbol)) return 2;
  return 2;
};
