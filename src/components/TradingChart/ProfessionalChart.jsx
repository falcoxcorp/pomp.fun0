import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';
import './ProfessionalChart.css';

const ProfessionalChart = ({ 
  tokenData, 
  className = "",
  height = 600 
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const maSeriesRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const [timeframe, setTimeframe] = useState('1H');
  const [chartType, setChartType] = useState('candlestick');
  const [theme, setTheme] = useState('dark');
  const [showVolume, setShowVolume] = useState(true);
  const [showMA, setShowMA] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [priceData, setPriceData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);

  // Generate realistic OHLCV data based on bonding curve
  const generateRealisticData = useCallback(() => {
    const now = new Date();
    const data = [];
    const volumeData = [];
    const basePrice = tokenData?.currentPrice || 0.001;
    let currentPrice = basePrice;
    
    const timeframes = {
      '1M': 60 * 1000,
      '5M': 5 * 60 * 1000,
      '15M': 15 * 60 * 1000,
      '1H': 60 * 60 * 1000,
      '4H': 4 * 60 * 60 * 1000,
      '1D': 24 * 60 * 60 * 1000
    };

    const interval = timeframes[timeframe] || timeframes['1H'];
    const periods = timeframe === '1D' ? 30 : timeframe === '4H' ? 120 : 200;

    for (let i = periods; i >= 0; i--) {
      const timestamp = Math.floor((now.getTime() - i * interval) / 1000);
      
      // More realistic price movement with trends
      const volatility = 0.03; // 3% volatility
      const trendFactor = Math.sin(i * 0.05) * 0.01; // Slight trend
      const randomWalk = (Math.random() - 0.5) * volatility;
      
      const priceChange = trendFactor + randomWalk;
      currentPrice = currentPrice * (1 + priceChange);
      
      const open = currentPrice;
      const closeChange = (Math.random() - 0.5) * volatility * 0.5;
      const close = open * (1 + closeChange);
      
      const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.3);
      const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.3);
      
      // Volume with realistic patterns
      const baseVolume = 50000 + Math.random() * 200000;
      const volumeSpike = Math.abs(closeChange) > volatility * 0.3 ? 2 : 1;
      const volume = baseVolume * volumeSpike;

      data.push({
        time: timestamp,
        open: parseFloat(open.toFixed(8)),
        high: parseFloat(high.toFixed(8)),
        low: parseFloat(low.toFixed(8)),
        close: parseFloat(close.toFixed(8))
      });

      volumeData.push({
        time: timestamp,
        value: Math.floor(volume),
        color: close >= open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
      });
    }
    
    return { priceData: data, volumeData };
  }, [tokenData, timeframe]);

  // Calculate Moving Average
  const calculateMA = useCallback((data, period = 20) => {
    const maData = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.close, 0);
      maData.push({
        time: data[i].time,
        value: parseFloat((sum / period).toFixed(8))
      });
    }
    return maData;
  }, []);

  // Initialize chart
  const initChart = useCallback(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        background: { 
          type: ColorType.Solid, 
          color: theme === 'dark' ? '#1a1a2e' : '#ffffff' 
        },
        textColor: theme === 'dark' ? '#d1d4dc' : '#191919',
        fontSize: 12,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      },
      grid: {
        vertLines: { 
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          style: LineStyle.Dotted
        },
        horzLines: { 
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          style: LineStyle.Dotted
        }
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#C1A444',
          width: 1,
          style: LineStyle.Dashed
        },
        horzLine: {
          color: '#C1A444',
          width: 1,
          style: LineStyle.Dashed
        }
      },
      rightPriceScale: {
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        textColor: theme === 'dark' ? '#d1d4dc' : '#191919'
      },
      timeScale: {
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        textColor: theme === 'dark' ? '#d1d4dc' : '#191919',
        timeVisible: true,
        secondsVisible: false
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true
      }
    };

    chartRef.current = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: showVolume ? height - 100 : height
    });

    // Add candlestick series
    if (chartType === 'candlestick') {
      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderUpColor: '#26a69a',
        borderDownColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350'
      });
    } else if (chartType === 'line') {
      candlestickSeriesRef.current = chartRef.current.addLineSeries({
        color: '#C1A444',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 6,
        crosshairMarkerBorderColor: '#C1A444',
        crosshairMarkerBackgroundColor: '#C1A444'
      });
    }

    // Add volume series if enabled
    if (showVolume) {
      volumeSeriesRef.current = chartRef.current.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume'
        },
        priceScaleId: 'volume',
        scaleMargins: {
          top: 0.8,
          bottom: 0
        }
      });
    }

    // Add MA series if enabled
    if (showMA) {
      maSeriesRef.current = chartRef.current.addLineSeries({
        color: '#ffd700',
        lineWidth: 2,
        crosshairMarkerVisible: false
      });
    }

    return chartRef.current;
  }, [theme, chartType, showVolume, showMA, height]);

  // Update chart data
  const updateChartData = useCallback(() => {
    if (!chartRef.current || !candlestickSeriesRef.current) return;

    const { priceData: newPriceData, volumeData: newVolumeData } = generateRealisticData();
    setPriceData(newPriceData);
    setVolumeData(newVolumeData);

    if (chartType === 'candlestick') {
      candlestickSeriesRef.current.setData(newPriceData);
    } else if (chartType === 'line') {
      const lineData = newPriceData.map(item => ({
        time: item.time,
        value: item.close
      }));
      candlestickSeriesRef.current.setData(lineData);
    }

    if (showVolume && volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(newVolumeData);
    }

    if (showMA && maSeriesRef.current) {
      const maData = calculateMA(newPriceData);
      maSeriesRef.current.setData(maData);
    }

    chartRef.current.timeScale().fitContent();
    setIsLoading(false);
  }, [generateRealisticData, chartType, showVolume, showMA, calculateMA]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (chartRef.current && chartContainerRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: showVolume ? height - 100 : height
      });
    }
  }, [height, showVolume]);

  // Initialize chart on mount
  useEffect(() => {
    const chart = initChart();
    if (chart) {
      updateChartData();
    }

    // Setup resize observer
    if (chartContainerRef.current) {
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(chartContainerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [initChart, updateChartData, handleResize]);

  // Update chart when settings change
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
      volumeSeriesRef.current = null;
      maSeriesRef.current = null;
    }
    
    const chart = initChart();
    if (chart) {
      updateChartData();
    }
  }, [timeframe, chartType, theme, showVolume, showMA]);

  // Export chart
  const exportChart = useCallback(() => {
    if (chartRef.current) {
      const canvas = chartContainerRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `${tokenData?.symbol || 'token'}-chart-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  }, [tokenData]);

  // Get current price info
  const getCurrentPriceInfo = useCallback(() => {
    if (priceData.length === 0) return { price: 0, change: 0, changePercent: 0 };
    
    const current = priceData[priceData.length - 1];
    const previous = priceData[priceData.length - 2] || current;
    const change = current.close - previous.close;
    const changePercent = (change / previous.close) * 100;
    
    return {
      price: current.close,
      change,
      changePercent
    };
  }, [priceData]);

  const priceInfo = getCurrentPriceInfo();

  return (
    <div className={`professional-chart ${theme} ${className}`}>
      {/* Chart Controls */}
      <div className="chart-controls">
        <div className="controls-left">
          <div className="timeframe-selector">
            {['1M', '5M', '15M', '1H', '4H', '1D'].map(tf => (
              <button
                key={tf}
                className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <div className="chart-type-selector">
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
              className="chart-select"
            >
              <option value="candlestick">Candlestick</option>
              <option value="line">Line</option>
            </select>
          </div>
        </div>

        <div className="controls-center">
          <div className="price-display">
            <span className="current-price">
              ${priceInfo.price.toFixed(8)}
            </span>
            <span className={`price-change ${priceInfo.change >= 0 ? 'positive' : 'negative'}`}>
              {priceInfo.change >= 0 ? '+' : ''}${priceInfo.change.toFixed(8)} 
              ({priceInfo.changePercent >= 0 ? '+' : ''}{priceInfo.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="controls-right">
          <div className="indicator-toggles">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showMA}
                onChange={(e) => setShowMA(e.target.checked)}
              />
              <span>MA(20)</span>
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showVolume}
                onChange={(e) => setShowVolume(e.target.checked)}
              />
              <span>Volume</span>
            </label>
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="theme-btn"
              title="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={exportChart} 
              className="export-btn"
              title="Export Chart"
            >
              📷
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-container">
        {isLoading && (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <span>Loading chart data...</span>
          </div>
        )}
        <div 
          ref={chartContainerRef} 
          className="chart-wrapper"
          style={{ height: `${height}px` }}
        />
      </div>

      {/* Chart Info */}
      <div className="chart-info">
        <div className="market-stats">
          <div className="stat-item">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">
              ${tokenData?.marketCap ? tokenData.marketCap.toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">24h Volume</span>
            <span className="stat-value">
              ${volumeData.length > 0 ? volumeData.reduce((sum, item) => sum + item.value, 0).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Base Reserve</span>
            <span className="stat-value">
              {tokenData?.baseReserve ? tokenData.baseReserve.toFixed(2) : 'N/A'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Quote Reserve</span>
            <span className="stat-value">
              {tokenData?.quoteReserve ? tokenData.quoteReserve.toFixed(2) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalChart;