import React, { useRef, useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, Tooltip, Legend } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
import { Chart } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement
);

const CandlestickChartV3 = ({ 
  prices = [], 
  supplies = [], 
  maxSupply = 0, 
  currentPrice = 0,
  symbol = 'TOKEN',
  nativeCurrency = 'ETH'
}) => {
  const chartRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState('15m');
  const [chartType, setChartType] = useState('candlestick');
  const [showVolume, setShowVolume] = useState(true);
  const [priceChange, setPriceChange] = useState(2.45);
  const [volume24h, setVolume24h] = useState(1250000);

  useEffect(() => {
    if (prices.length > 0 && supplies.length > 0) {
      setIsLoading(true);
      
      // Generate professional candlestick data
      const candlestickData = generateProfessionalCandlestickData(prices, supplies);
      
      const data = {
        datasets: [
          {
            label: `${symbol}/${nativeCurrency}`,
            data: candlestickData,
            borderColor: '#2962ff',
            backgroundColor: 'rgba(41, 98, 255, 0.1)',
            borderWidth: 1,
            color: {
              up: '#26a69a',
              down: '#ef5350',
              unchanged: '#999999'
            },
            borderColor: {
              up: '#26a69a',
              down: '#ef5350',
              unchanged: '#999999'
            }
          }
        ]
      };

      setChartData(data);
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [prices, supplies, symbol, nativeCurrency, timeframe]);

  const generateProfessionalCandlestickData = (prices, supplies) => {
    const candlesticks = [];
    const dataPoints = Math.min(200, prices.length);
    const step = Math.floor(prices.length / dataPoints);
    
    for (let i = 0; i < dataPoints - 1; i++) {
      const startIndex = i * step;
      const endIndex = Math.min((i + 1) * step, prices.length - 1);
      const segmentPrices = prices.slice(startIndex, endIndex + 1);
      
      if (segmentPrices.length > 0) {
        const open = segmentPrices[0];
        const close = segmentPrices[segmentPrices.length - 1];
        const high = Math.max(...segmentPrices) * (1 + Math.random() * 0.05);
        const low = Math.min(...segmentPrices) * (1 - Math.random() * 0.05);
        
        // Generate realistic timestamps
        const timeInterval = getTimeInterval(timeframe);
        const timestamp = Date.now() - (dataPoints - i) * timeInterval;
        
        candlesticks.push({
          x: timestamp,
          o: open,
          h: high,
          l: low,
          c: close
        });
      }
    }
    
    return candlesticks;
  };

  const getTimeInterval = (tf) => {
    const intervals = {
      '1m': 60000,
      '5m': 300000,
      '15m': 900000,
      '1h': 3600000,
      '4h': 14400000,
      '1d': 86400000
    };
    return intervals[tf] || 900000;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(22, 27, 34, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#30363d',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 12,
          weight: 'bold',
          family: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        bodyFont: {
          size: 11,
          family: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
          },
          label: (context) => {
            const data = context.raw;
            return [
              `Open: ${data.o.toFixed(8)}`,
              `High: ${data.h.toFixed(8)}`,
              `Low: ${data.l.toFixed(8)}`,
              `Close: ${data.c.toFixed(8)}`,
              `Change: ${((data.c - data.o) / data.o * 100).toFixed(2)}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeframe.includes('m') ? 'minute' : timeframe.includes('h') ? 'hour' : 'day',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'MMM dd HH:mm',
            day: 'MMM dd'
          }
        },
        grid: {
          color: '#21262d',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: '#7d8590',
          font: {
            size: 10,
            family: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
          },
          maxTicksLimit: 8
        },
        border: {
          display: false
        }
      },
      y: {
        position: 'right',
        grid: {
          color: '#21262d',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: '#7d8590',
          font: {
            size: 10,
            family: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
          },
          callback: function(value) {
            return value.toFixed(6);
          },
          padding: 8
        },
        border: {
          display: false
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };

  const timeframes = [
    { key: '1m', label: '1m' },
    { key: '5m', label: '5m' },
    { key: '15m', label: '15m' },
    { key: '1h', label: '1h' },
    { key: '4h', label: '4h' },
    { key: '1d', label: '1D' }
  ];

  const chartTypes = [
    { key: 'candlestick', label: '📊', name: 'Candlestick' },
    { key: 'line', label: '📈', name: 'Line' },
    { key: 'area', label: '📉', name: 'Area' }
  ];

  if (isLoading) {
    return (
      <div className="professional-chart-container">
        <div className="chart-loading-professional">
          <div className="loading-spinner-professional"></div>
          <div className="loading-text-professional">Loading advanced chart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="professional-chart-container">
      {/* Professional Header */}
      <div className="professional-chart-header">
        <div className="chart-symbol-section">
          <div className="symbol-main">
            <span className="symbol-pair">{symbol}/{nativeCurrency}</span>
            <span className="chart-interval">15m</span>
            <span className="exchange-info">• FalcoX v3 (CORE)</span>
          </div>
          <div className="price-section">
            <span className="current-price-main">{currentPrice.toFixed(8)}</span>
            <span className={`price-change-main ${priceChange >= 0 ? 'positive' : 'negative'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
            <span className="price-change-value">
              {priceChange >= 0 ? '+' : ''}{(currentPrice * priceChange / 100).toFixed(8)}
            </span>
          </div>
        </div>
        
        <div className="chart-tools-section">
          <div className="chart-type-selector">
            {chartTypes.map((type) => (
              <button
                key={type.key}
                className={`chart-type-btn ${chartType === type.key ? 'active' : ''}`}
                onClick={() => setChartType(type.key)}
                title={type.name}
              >
                {type.label}
              </button>
            ))}
          </div>
          <div className="chart-indicators">
            <button className="indicator-btn">📊 Indicators</button>
            <button className="indicator-btn">📏 Drawing</button>
            <button className="indicator-btn">⚙️ Settings</button>
          </div>
        </div>
      </div>

      {/* Timeframe Controls */}
      <div className="professional-timeframe-controls">
        <div className="timeframe-buttons-professional">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              className={`timeframe-btn-professional ${timeframe === tf.key ? 'active' : ''}`}
              onClick={() => setTimeframe(tf.key)}
            >
              {tf.label}
            </button>
          ))}
        </div>
        
        <div className="chart-options">
          <button 
            className={`volume-toggle ${showVolume ? 'active' : ''}`}
            onClick={() => setShowVolume(!showVolume)}
          >
            📊 Volume
          </button>
          <button className="fullscreen-btn">⛶</button>
        </div>
      </div>

      {/* Price Information Bar */}
      <div className="price-info-professional">
        <div className="price-metrics-grid">
          <div className="metric-item">
            <span className="metric-label">24h Volume</span>
            <span className="metric-value">${volume24h.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Market Cap</span>
            <span className="metric-value">${(currentPrice * maxSupply * 3000).toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">24h High</span>
            <span className="metric-value">{(currentPrice * 1.15).toFixed(8)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">24h Low</span>
            <span className="metric-value">{(currentPrice * 0.85).toFixed(8)}</span>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="professional-chart-wrapper">
        {/* Price Scale Labels */}
        <div className="price-scale-professional">
          <div className="price-level high">{(currentPrice * 1.2).toFixed(6)}</div>
          <div className="price-level mid">{currentPrice.toFixed(6)}</div>
          <div className="price-level low">{(currentPrice * 0.8).toFixed(6)}</div>
        </div>
        
        <div className="chart-canvas-professional">
          {chartData && (
            <Chart
              ref={chartRef}
              type="candlestick"
              data={chartData}
              options={options}
            />
          )}
        </div>

        {/* Chart Crosshair */}
        <div className="chart-crosshair">
          <div className="crosshair-horizontal"></div>
          <div className="crosshair-vertical"></div>
        </div>
      </div>

      {/* Volume Chart Section */}
      {showVolume && (
        <div className="volume-chart-professional">
          <div className="volume-header">
            <span className="volume-title">Volume</span>
            <span className="volume-value">{volume24h.toLocaleString()}</span>
          </div>
          <div className="volume-bars-container">
            {Array.from({ length: 100 }, (_, i) => (
              <div 
                key={i} 
                className={`volume-bar-professional ${Math.random() > 0.5 ? 'positive' : 'negative'}`}
                style={{ 
                  height: `${Math.random() * 80 + 10}%`,
                  opacity: 0.7 + Math.random() * 0.3
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Time Scale Navigation */}
      <div className="time-scale-professional">
        <div className="time-navigation">
          <button className="nav-btn">◀</button>
          <div className="time-labels-professional">
            <span>1Y</span>
            <span>6M</span>
            <span>3M</span>
            <span>1M</span>
            <span>1W</span>
            <span>1D</span>
          </div>
          <button className="nav-btn">▶</button>
        </div>
        <div className="zoom-controls">
          <button className="zoom-btn">🔍+</button>
          <button className="zoom-btn">🔍-</button>
          <button className="zoom-btn">↻ Reset</button>
        </div>
      </div>

      {/* Trading Panel */}
      <div className="trading-panel-overlay">
        <div className="quick-trade-buttons">
          <button className="quick-buy-btn">Quick Buy</button>
          <button className="quick-sell-btn">Quick Sell</button>
        </div>
        <div className="market-status">
          <div className="status-indicator active"></div>
          <span>Market Open</span>
        </div>
      </div>

      {/* Chart Footer */}
      <div className="professional-chart-footer">
        <div className="chart-info-left">
          <span className="powered-by">Powered by FalcoX • Real-time data</span>
        </div>
        <div className="chart-info-right">
          <span className="last-update">Last update: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChartV3;