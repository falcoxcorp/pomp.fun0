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
  const [timeframe, setTimeframe] = useState('1H');
  const [viewMode, setViewMode] = useState('candlestick');

  useEffect(() => {
    if (prices.length > 0 && supplies.length > 0) {
      setIsLoading(true);
      
      // Generate candlestick data from bonding curve
      const candlestickData = generateCandlestickData(prices, supplies);
      
      const data = {
        datasets: [
          {
            label: `${symbol}/${nativeCurrency}`,
            data: candlestickData,
            borderColor: '#c1a444',
            backgroundColor: 'rgba(193, 164, 68, 0.1)',
            borderWidth: 1,
            color: {
              up: '#4ade80',
              down: '#ef4444',
              unchanged: '#c1a444'
            },
            borderColor: {
              up: '#4ade80',
              down: '#ef4444',
              unchanged: '#c1a444'
            }
          }
        ]
      };

      setChartData(data);
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [prices, supplies, symbol, nativeCurrency]);

  const generateCandlestickData = (prices, supplies) => {
    const candlesticks = [];
    const dataPoints = Math.min(50, prices.length); // Limit to 50 candles for performance
    const step = Math.floor(prices.length / dataPoints);
    
    for (let i = 0; i < dataPoints - 1; i++) {
      const startIndex = i * step;
      const endIndex = Math.min((i + 1) * step, prices.length - 1);
      const segmentPrices = prices.slice(startIndex, endIndex + 1);
      
      if (segmentPrices.length > 0) {
        const open = segmentPrices[0];
        const close = segmentPrices[segmentPrices.length - 1];
        const high = Math.max(...segmentPrices);
        const low = Math.min(...segmentPrices);
        const timestamp = Date.now() - (dataPoints - i) * 3600000; // 1 hour intervals
        
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
        backgroundColor: 'rgba(15, 15, 35, 0.95)',
        titleColor: '#c1a444',
        bodyColor: '#ffffff',
        borderColor: '#c1a444',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString();
          },
          label: (context) => {
            const data = context.raw;
            return [
              `Open: ${data.o.toFixed(8)} ${nativeCurrency}`,
              `High: ${data.h.toFixed(8)} ${nativeCurrency}`,
              `Low: ${data.l.toFixed(8)} ${nativeCurrency}`,
              `Close: ${data.c.toFixed(8)} ${nativeCurrency}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm'
          }
        },
        grid: {
          color: 'rgba(193, 164, 68, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(193, 164, 68, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
            weight: '500'
          },
          callback: function(value) {
            return value.toFixed(6);
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  const timeframes = ['5M', '15M', '1H', '4H', '1D', '1W'];
  const viewModes = ['candlestick', 'line', 'area'];

  if (isLoading) {
    return (
      <div className="candlestick-chart-v3-container">
        <div className="chart-header">
          <div className="chart-title">
            <h3>Price Analysis</h3>
            <div className="chart-subtitle">Candlestick Chart</div>
          </div>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Chart Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="candlestick-chart-v3-container">
      {/* Chart Header */}
      <div className="chart-header">
        <div className="chart-title">
          <h3>{symbol}/{nativeCurrency}</h3>
          <div className="chart-subtitle">Price Analysis</div>
        </div>
        <div className="chart-controls">
          <div className="view-mode-selector">
            {viewModes.map((mode) => (
              <button
                key={mode}
                className={`view-mode-btn ${viewMode === mode ? 'active' : ''}`}
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <div className="timeframe-selector">
            {timeframes.map((tf) => (
              <button
                key={tf}
                className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price Info Bar */}
      <div className="price-info-bar">
        <div className="price-metric">
          <span className="metric-label">Current</span>
          <span className="metric-value">{currentPrice.toFixed(8)} {nativeCurrency}</span>
        </div>
        <div className="price-metric">
          <span className="metric-label">24h Change</span>
          <span className="metric-value positive">+12.45%</span>
        </div>
        <div className="price-metric">
          <span className="metric-label">Volume</span>
          <span className="metric-value">1.2K {nativeCurrency}</span>
        </div>
        <div className="price-metric">
          <span className="metric-label">Market Cap</span>
          <span className="metric-value">$125.4K</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-wrapper">
        <div className="chart-canvas">
          {chartData && (
            <Chart
              ref={chartRef}
              type="candlestick"
              data={chartData}
              options={options}
            />
          )}
        </div>
        
        {/* Chart Overlay Info */}
        <div className="chart-overlay">
          <div className="overlay-info">
            <div className="trend-indicator positive">
              <span className="trend-arrow">↗</span>
              <span>Bullish</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Footer */}
      <div className="chart-footer">
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color bullish"></div>
            <span>Bullish Candle</span>
          </div>
          <div className="legend-item">
            <div className="legend-color bearish"></div>
            <span>Bearish Candle</span>
          </div>
        </div>
        <div className="chart-info">
          <span className="info-text">Real-time candlestick analysis</span>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChartV3;