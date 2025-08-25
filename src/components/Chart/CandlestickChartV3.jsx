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
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            borderWidth: 1,
            color: {
              up: '#00ff88',
              down: '#ff4757',
              unchanged: '#6c757d'
            },
            borderColor: {
              up: '#00ff88',
              down: '#ff4757',
              unchanged: '#6c757d'
            }
          }
        ]
      };

      setChartData(data);
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [prices, supplies, symbol, nativeCurrency]);

  const generateCandlestickData = (prices, supplies) => {
    const candlesticks = [];
    const dataPoints = Math.min(100, prices.length);
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
        const timestamp = Date.now() - (dataPoints - i) * 900000; // 15 min intervals
        
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
        backgroundColor: 'rgba(22, 27, 34, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#30363d',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 12,
          weight: 'bold'
        },
        bodyFont: {
          size: 11
        },
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
          },
          label: (context) => {
            const data = context.raw;
            return [
              `O: ${data.o.toFixed(8)}`,
              `H: ${data.h.toFixed(8)}`,
              `L: ${data.l.toFixed(8)}`,
              `C: ${data.c.toFixed(8)}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm'
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

  if (isLoading) {
    return (
      <div className="tradingview-chart-container">
        <div className="chart-loading-state">
          <div className="loading-spinner-tradingview"></div>
          <div className="loading-text-tradingview">Loading chart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tradingview-chart-container">
      {/* Chart Header */}
      <div className="tradingview-header">
        <div className="chart-symbol-info">
          <span className="symbol-name">{symbol}/{nativeCurrency}</span>
          <span className="chart-type">15 • IceCreamSwap v3 (CORE)</span>
        </div>
        <div className="price-info">
          <span className="current-price">{currentPrice.toFixed(8)}</span>
          <span className="price-change positive">+2.45%</span>
          <span className="price-change-value">+0.00012</span>
        </div>
      </div>

      {/* Timeframe Controls */}
      <div className="tradingview-controls">
        <div className="timeframe-buttons">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              className={`timeframe-btn-tv ${timeframe === tf.key ? 'active' : ''}`}
              onClick={() => setTimeframe(tf.key)}
            >
              {tf.label}
            </button>
          ))}
        </div>
        <div className="chart-tools">
          <button className="tool-btn">📊</button>
          <button className="tool-btn">📏</button>
          <button className="tool-btn">⚙️</button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="tradingview-chart-wrapper">
        <div className="price-scale-labels">
          <div className="price-label high">0.5000</div>
          <div className="price-label mid">0.4500</div>
          <div className="price-label low">0.4000</div>
        </div>
        
        <div className="chart-canvas-tradingview">
          {chartData && (
            <Chart
              ref={chartRef}
              type="candlestick"
              data={chartData}
              options={options}
            />
          )}
        </div>
      </div>

      {/* Volume Chart */}
      <div className="volume-chart-section">
        <div className="volume-bars">
          {Array.from({ length: 50 }, (_, i) => (
            <div 
              key={i} 
              className={`volume-bar ${Math.random() > 0.5 ? 'positive' : 'negative'}`}
              style={{ height: `${Math.random() * 60 + 10}%` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom Time Scale */}
      <div className="time-scale">
        <div className="time-labels">
          <span>5y</span>
          <span>1y</span>
          <span>3m</span>
          <span>1m</span>
          <span>5d</span>
          <span>1d</span>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChartV3;