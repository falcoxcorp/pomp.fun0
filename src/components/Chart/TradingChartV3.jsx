import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TradingChartV3 = ({ 
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

  useEffect(() => {
    if (prices.length > 0 && supplies.length > 0) {
      setIsLoading(true);
      
      // Create gradient for the chart
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(193, 164, 68, 0.4)');
      gradient.addColorStop(0.5, 'rgba(193, 164, 68, 0.2)');
      gradient.addColorStop(1, 'rgba(193, 164, 68, 0.05)');

      const data = {
        labels: supplies.map((supply, index) => {
          if (index % Math.ceil(supplies.length / 10) === 0) {
            return `${(supply / 1000).toFixed(1)}K`;
          }
          return '';
        }),
        datasets: [
          {
            label: `Price (${nativeCurrency})`,
            data: prices,
            borderColor: '#c1a444',
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#c1a444',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 3,
            segment: {
              borderColor: (ctx) => {
                const index = ctx.p0DataIndex;
                const currentValue = ctx.p0.parsed.y;
                const previousValue = index > 0 ? prices[index - 1] : currentValue;
                return currentValue >= previousValue ? '#4ade80' : '#ef4444';
              }
            }
          }
        ]
      };

      setChartData(data);
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [prices, supplies, nativeCurrency]);

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
      title: {
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
            const index = context[0].dataIndex;
            return `Supply: ${supplies[index]?.toLocaleString()} ${symbol}`;
          },
          label: (context) => {
            const price = context.parsed.y;
            return `Price: ${price.toFixed(8)} ${nativeCurrency}`;
          },
          afterLabel: (context) => {
            const price = context.parsed.y;
            const usdPrice = price * 3000; // Assuming ETH = $3000 for demo
            return `≈ $${usdPrice.toFixed(4)} USD`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
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
          maxTicksLimit: 8
        },
        title: {
          display: true,
          text: `Token Supply (${symbol})`,
          color: '#c1a444',
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: 16
        }
      },
      y: {
        display: true,
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
        },
        title: {
          display: true,
          text: `Price (${nativeCurrency})`,
          color: '#c1a444',
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: 16
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  const timeframes = ['5M', '15M', '1H', '4H', '1D', '1W'];

  if (isLoading) {
    return (
      <div className="trading-chart-v3-container">
        <div className="chart-header">
          <div className="chart-title">
            <h3>Bonding Curve Analysis</h3>
            <div className="chart-subtitle">Price Discovery Mechanism</div>
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
    <div className="trading-chart-v3-container">
      {/* Chart Header */}
      <div className="chart-header">
        <div className="chart-title">
          <h3>Bonding Curve Analysis</h3>
          <div className="chart-subtitle">Price Discovery Mechanism</div>
        </div>
        <div className="chart-controls">
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
          <span className="metric-label">Current Price</span>
          <span className="metric-value">{currentPrice.toFixed(8)} {nativeCurrency}</span>
        </div>
        <div className="price-metric">
          <span className="metric-label">Max Supply</span>
          <span className="metric-value">{maxSupply.toLocaleString()} {symbol}</span>
        </div>
        <div className="price-metric">
          <span className="metric-label">Market Phase</span>
          <span className="metric-value phase-bonding">Bonding Curve</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-wrapper">
        <div className="chart-canvas">
          {chartData && (
            <Line
              ref={chartRef}
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
              <span>Bullish Trend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Footer */}
      <div className="chart-footer">
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color primary"></div>
            <span>Price Curve</span>
          </div>
          <div className="legend-item">
            <div className="legend-color secondary"></div>
            <span>Volume Area</span>
          </div>
        </div>
        <div className="chart-info">
          <span className="info-text">Real-time bonding curve visualization</span>
        </div>
      </div>
    </div>
  );
};

export default TradingChartV3;