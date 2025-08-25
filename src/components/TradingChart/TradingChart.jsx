import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement,
  zoomPlugin
);

const TradingChart = ({ 
  tokenData, 
  priceData = [], 
  volumeData = [],
  className = "",
  height = 600 
}) => {
  const chartRef = useRef(null);
  const [timeframe, setTimeframe] = useState('1h');
  const [chartType, setChartType] = useState('candlestick');
  const [theme, setTheme] = useState('dark');
  const [showVolume, setShowVolume] = useState(true);
  const [showIndicators, setShowIndicators] = useState({
    ma: false,
    rsi: false,
    macd: false,
    bollinger: false
  });

  // Generate sample OHLCV data based on bonding curve
  const generateCandlestickData = useCallback(() => {
    const now = new Date();
    const data = [];
    const basePrice = tokenData?.currentPrice || 0.001;
    
    for (let i = 100; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * getTimeframeMs(timeframe));
      const volatility = 0.05; // 5% volatility
      const trend = Math.sin(i * 0.1) * 0.02; // Slight trend
      
      const open = basePrice * (1 + (Math.random() - 0.5) * volatility + trend);
      const close = open * (1 + (Math.random() - 0.5) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
      const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
      const volume = Math.random() * 1000000;

      data.push({
        x: timestamp.getTime(),
        o: open,
        h: high,
        l: low,
        c: close,
        v: volume
      });
    }
    
    return data.sort((a, b) => a.x - b.x);
  }, [tokenData, timeframe]);

  const getTimeframeMs = (tf) => {
    const timeframes = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000
    };
    return timeframes[tf] || timeframes['1h'];
  };

  // Calculate technical indicators
  const calculateMA = (data, period = 20) => {
    return data.map((item, index) => {
      if (index < period - 1) return { x: item.x, y: null };
      
      const sum = data.slice(index - period + 1, index + 1)
        .reduce((acc, curr) => acc + curr.c, 0);
      
      return { x: item.x, y: sum / period };
    });
  };

  const calculateRSI = (data, period = 14) => {
    const rsiData = [];
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < data.length; i++) {
      const change = data[i].c - data[i - 1].c;
      
      if (i <= period) {
        gains += change > 0 ? change : 0;
        losses += change < 0 ? Math.abs(change) : 0;
      } else {
        const prevGain = gains / period;
        const prevLoss = losses / period;
        gains = (prevGain * (period - 1) + (change > 0 ? change : 0)) / period;
        losses = (prevLoss * (period - 1) + (change < 0 ? Math.abs(change) : 0)) / period;
      }

      if (i >= period) {
        const rs = gains / losses;
        const rsi = 100 - (100 / (1 + rs));
        rsiData.push({ x: data[i].x, y: rsi });
      } else {
        rsiData.push({ x: data[i].x, y: null });
      }
    }

    return rsiData;
  };

  const candlestickData = generateCandlestickData();
  const ma20Data = calculateMA(candlestickData, 20);
  const rsiData = calculateRSI(candlestickData);

  const chartData = {
    datasets: [
      {
        label: 'Price',
        type: chartType,
        data: candlestickData,
        borderColor: theme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        yAxisID: 'y',
        parsing: false,
        normalized: true,
        spanGaps: false,
        color: {
          up: '#00ff88',
          down: '#ff4757',
          unchanged: '#999999',
        },
        borderColor: {
          up: '#00ff88',
          down: '#ff4757',
          unchanged: '#999999',
        }
      },
      ...(showVolume ? [{
        label: 'Volume',
        type: 'bar',
        data: candlestickData.map(item => ({ x: item.x, y: item.v })),
        backgroundColor: candlestickData.map(item => 
          item.c >= item.o ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 71, 87, 0.3)'
        ),
        borderColor: candlestickData.map(item => 
          item.c >= item.o ? '#00ff88' : '#ff4757'
        ),
        borderWidth: 1,
        yAxisID: 'volume',
        order: 2
      }] : []),
      ...(showIndicators.ma ? [{
        label: 'MA(20)',
        type: 'line',
        data: ma20Data,
        borderColor: '#ffd700',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        yAxisID: 'y',
        order: 1
      }] : []),
      ...(showIndicators.rsi ? [{
        label: 'RSI(14)',
        type: 'line',
        data: rsiData,
        borderColor: '#9c88ff',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        yAxisID: 'rsi',
        order: 1
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
        titleColor: theme === 'dark' ? '#ffffff' : '#000000',
        bodyColor: theme === 'dark' ? '#ffffff' : '#000000',
        borderColor: theme === 'dark' ? '#333333' : '#cccccc',
        borderWidth: 1,
        callbacks: {
          title: (context) => {
            return new Date(context[0].parsed.x).toLocaleString();
          },
          label: (context) => {
            const datasetLabel = context.dataset.label;
            if (datasetLabel === 'Price') {
              const data = context.raw;
              return [
                `Open: $${data.o?.toFixed(6)}`,
                `High: $${data.h?.toFixed(6)}`,
                `Low: $${data.l?.toFixed(6)}`,
                `Close: $${data.c?.toFixed(6)}`
              ];
            } else if (datasetLabel === 'Volume') {
              return `Volume: ${context.parsed.y?.toLocaleString()}`;
            } else {
              return `${datasetLabel}: ${context.parsed.y?.toFixed(2)}`;
            }
          }
        }
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeframe === '1d' ? 'day' : 'hour',
          displayFormats: {
            hour: 'MMM dd HH:mm',
            day: 'MMM dd'
          }
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
          maxTicksLimit: 10
        }
      },
      y: {
        type: 'linear',
        position: 'right',
        grid: {
          color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#ffffff' : '#000000',
          callback: function(value) {
            return '$' + value.toFixed(6);
          }
        }
      },
      ...(showVolume ? {
        volume: {
          type: 'linear',
          position: 'right',
          max: Math.max(...candlestickData.map(d => d.v)) * 4,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          }
        }
      } : {}),
      ...(showIndicators.rsi ? {
        rsi: {
          type: 'linear',
          position: 'left',
          min: 0,
          max: 100,
          grid: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          },
          ticks: {
            color: theme === 'dark' ? '#ffffff' : '#000000',
            stepSize: 20
          }
        }
      } : {})
    }
  };

  const exportChart = (format) => {
    if (chartRef.current) {
      const chart = chartRef.current;
      if (format === 'png') {
        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = `${tokenData?.symbol || 'token'}-chart.png`;
        link.href = url;
        link.click();
      }
    }
  };

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div className={`trading-chart-container ${theme} ${className}`}>
      {/* Chart Controls */}
      <div className="chart-controls">
        <div className="control-group">
          <label>Timeframe:</label>
          <div className="timeframe-buttons">
            {['1m', '5m', '15m', '1h', '4h', '1d'].map(tf => (
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

        <div className="control-group">
          <label>Chart Type:</label>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className="chart-select"
          >
            <option value="candlestick">Candlestick</option>
            <option value="ohlc">OHLC</option>
            <option value="line">Line</option>
          </select>
        </div>

        <div className="control-group">
          <label>Indicators:</label>
          <div className="indicator-toggles">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showIndicators.ma}
                onChange={(e) => setShowIndicators(prev => ({ ...prev, ma: e.target.checked }))}
              />
              MA(20)
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showIndicators.rsi}
                onChange={(e) => setShowIndicators(prev => ({ ...prev, rsi: e.target.checked }))}
              />
              RSI(14)
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showVolume}
                onChange={(e) => setShowVolume(e.target.checked)}
              />
              Volume
            </label>
          </div>
        </div>

        <div className="control-group">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="theme-btn">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={resetZoom} className="reset-btn">Reset Zoom</button>
          <button onClick={() => exportChart('png')} className="export-btn">Export PNG</button>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-wrapper" style={{ height: `${height}px` }}>
        <Chart
          ref={chartRef}
          type="candlestick"
          data={chartData}
          options={options}
        />
      </div>

      {/* Chart Info */}
      <div className="chart-info">
        <div className="price-info">
          <span className="current-price">
            Current: ${candlestickData[candlestickData.length - 1]?.c?.toFixed(6)}
          </span>
          <span className="price-change">
            24h Change: {((candlestickData[candlestickData.length - 1]?.c - candlestickData[0]?.c) / candlestickData[0]?.c * 100).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;