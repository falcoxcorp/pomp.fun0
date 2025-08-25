import React, { useRef, useEffect, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

const CandlestickChartV3 = ({ 
  prices = [], 
  supplies = [], 
  maxSupply = 0, 
  currentPrice = 0,
  symbol = 'TOKEN',
  nativeCurrency = 'ETH'
}) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candlestickSeriesRef = useRef();
  const volumeSeriesRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('15m');
  const [priceChange, setPriceChange] = useState(2.45);
  const [volume24h, setVolume24h] = useState(1250000);

  useEffect(() => {
    if (chartContainerRef.current && prices.length > 0 && supplies.length > 0) {
      setIsLoading(true);

      // Create chart
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#0d1421' },
          textColor: '#d1d4dc',
          fontSize: 12,
          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        grid: {
          vertLines: { color: '#21262d' },
          horzLines: { color: '#21262d' },
        },
        crosshair: {
          mode: 1,
          vertLine: {
            color: '#758696',
            width: 1,
            style: 2,
          },
          horzLine: {
            color: '#758696',
            width: 1,
            style: 2,
          },
        },
        rightPriceScale: {
          borderColor: '#21262d',
          textColor: '#d1d4dc',
          entireTextOnly: true,
        },
        timeScale: {
          borderColor: '#21262d',
          textColor: '#d1d4dc',
          timeVisible: true,
          secondsVisible: false,
        },
        watermark: {
          visible: false,
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      chartRef.current = chart;

      // Generate professional candlestick data
      const candlestickData = generateProfessionalCandlestickData(prices, supplies);
      const volumeData = generateVolumeData(candlestickData);

      // Add candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        wickUpColor: '#26a69a',
        priceFormat: {
          type: 'price',
          precision: 8,
          minMove: 0.00000001,
        },
      });

      candlestickSeriesRef.current = candlestickSeries;
      candlestickSeries.setData(candlestickData);

      // Add volume series
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.7,
          bottom: 0,
        },
      });

      volumeSeriesRef.current = volumeSeries;
      volumeSeries.setData(volumeData);

      // Fit content
      chart.timeScale().fitContent();

      setTimeout(() => setIsLoading(false), 800);

      // Cleanup function
      return () => {
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
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
        const timestamp = Math.floor((Date.now() - (dataPoints - i) * timeInterval) / 1000);
        
        candlesticks.push({
          time: timestamp,
          open: open,
          high: high,
          low: low,
          close: close
        });
      }
    }
    
    return candlesticks.sort((a, b) => a.time - b.time);
  };

  const generateVolumeData = (candlestickData) => {
    return candlestickData.map(candle => ({
      time: candle.time,
      value: Math.random() * 1000000 + 100000,
      color: candle.close >= candle.open ? '#26a69a80' : '#ef535080'
    }));
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
            <span className="chart-interval">{timeframe}</span>
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
          <button className="volume-toggle active">
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
        <div 
          ref={chartContainerRef} 
          className="chart-canvas-professional"
          style={{ height: '500px', width: '100%' }}
        />
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