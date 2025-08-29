// Real-time pricing service with WebSocket simulation and API integration

export class RealTimePricingService {
  constructor() {
    this.prices = new Map();
    this.subscribers = new Map();
    this.isConnected = false;
    this.updateInterval = null;
  }

  // Simulate real-time price updates
  startRealTimeUpdates() {
    if (this.updateInterval) return;
    
    this.isConnected = true;
    this.updateInterval = setInterval(() => {
      this.updateAllPrices();
    }, 1000); // Update every second
  }

  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isConnected = false;
  }

  updateAllPrices() {
    const symbols = [
      'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'BTCUSD', 'ETHUSD', 
      'AAPL', 'GOOGL', 'NASDAQ100', 'SP500', 'GOLD', 'SILVER'
    ];

    symbols.forEach(symbol => {
      const currentPrice = this.getCurrentPrice(symbol);
      const newPrice = this.generateRealisticPriceMovement(symbol, currentPrice);
      this.prices.set(symbol, {
        price: newPrice,
        timestamp: Date.now(),
        change: newPrice - currentPrice,
        changePercent: ((newPrice - currentPrice) / currentPrice) * 100
      });

      // Notify subscribers
      if (this.subscribers.has(symbol)) {
        this.subscribers.get(symbol).forEach(callback => {
          callback(this.prices.get(symbol));
        });
      }
    });
  }

  generateRealisticPriceMovement(symbol, currentPrice) {
    const volatility = this.getSymbolVolatility(symbol);
    const trend = Math.random() - 0.5; // -0.5 to 0.5
    const randomWalk = (Math.random() - 0.5) * volatility;
    
    // Simulate market microstructure
    const tickSize = this.getTickSize(symbol);
    const movement = (trend * 0.3 + randomWalk * 0.7) * currentPrice;
    
    return Math.round((currentPrice + movement) / tickSize) * tickSize;
  }

  getSymbolVolatility(symbol) {
    const volatilities = {
      'EURUSD': 0.0001, 'GBPUSD': 0.00012, 'USDJPY': 0.01,
      'BTCUSD': 50, 'ETHUSD': 5,
      'AAPL': 0.5, 'GOOGL': 1,
      'NASDAQ100': 5, 'SP500': 2,
      'GOLD': 0.5, 'SILVER': 0.02
    };
    return volatilities[symbol] || 0.001;
  }

  getTickSize(symbol) {
    if (symbol.includes('JPY')) return 0.001;
    if (symbol.includes('USD') && symbol.length === 6) return 0.00001;
    if (symbol.includes('BTC') || symbol.includes('ETH')) return 0.01;
    if (symbol === 'GOLD' || symbol === 'SILVER') return 0.01;
    return 0.01;
  }

  getCurrentPrice(symbol) {
    if (this.prices.has(symbol)) {
      return this.prices.get(symbol).price;
    }
    return this.getBasePrice(symbol);
  }

  getBasePrice(symbol) {
    const prices = {
      'EURUSD': 1.08500, 'GBPUSD': 1.26420, 'USDJPY': 149.850,
      'AUDUSD': 0.67250, 'USDCAD': 1.34580, 'BTCUSD': 43850.00,
      'ETHUSD': 2680.50, 'AAPL': 195.89, 'GOOGL': 142.56,
      'NASDAQ100': 16845.30, 'SP500': 4750.89, 'GOLD': 2045.50,
      'SILVER': 24.85
    };
    return prices[symbol] || 100;
  }

  subscribe(symbol, callback) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    this.subscribers.get(symbol).push(callback);
  }

  unsubscribe(symbol, callback) {
    if (this.subscribers.has(symbol)) {
      const callbacks = this.subscribers.get(symbol);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Simulate connection to external APIs
  async fetchRealTimePrice(symbol) {
    // In a real implementation, this would call APIs like:
    // - Alpha Vantage, Yahoo Finance, IEX Cloud for stocks
    // - Forex APIs for currency pairs
    // - Crypto APIs for cryptocurrencies
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        symbol,
        price: this.getCurrentPrice(symbol),
        timestamp: Date.now(),
        source: 'simulated_api'
      };
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error);
      return null;
    }
  }
}

export const pricingService = new RealTimePricingService();
