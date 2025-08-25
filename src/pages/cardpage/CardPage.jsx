import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { readContract } from 'wagmi/actions';
import { formatUnits } from 'ethers';
import abi from "../../helper/ManagerFaucetAbi.json";
import { daimond, priceInDollar, routers } from '../../helper/Helper';
import TokenAbi from '../../helper/TokenAbi.json';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import logo from "../../assets/logo/logo.png";
import TradeEventList from '../../components/Statistics/TradeEventList';
import { config } from '../../wagmiClient';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import BuySell from '../../components/BuySell/BuySell';
import { useEffect } from 'react';
import Video from '../../components/Video/Video';
import TokenInfo from '../../components/TokenInfo/TokenInfo';
const CardPage = () => {
  const { token } = useParams();

  if (!token) {
    return <div className="flex justify-center items-center h-screen">Card not found</div>;
  }

  const { data, error, isLoading } = useReadContracts({
    contracts: [{
      abi,
      address: daimond[1868],
      functionName: 'getPoolInfo',
      args: [token],
    }, {
      abi,
      address: daimond[1868],
      functionName: 'getPoolConfig',
      args: [20],

    }]
  });

  const { chain, address } = useAccount();

  const [tokenBalance, setTokenBalance] = useState(0);

  const fetchBalaceOf = async () => {
    try {
      const result = await readContract(config, {
        abi: TokenAbi,
        address: token,
        functionName: 'balanceOf',
        chainId: 1868,
        args: [
          address,
        ],
      });
      setTokenBalance(result)
    } catch (error) {
      console.error('Error fetching amountOut:', error);
    }
  };
  useEffect(() => {
    fetchBalaceOf();
  }, [address]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <img src={logo} alt="Loading Logo" className="w-24 h-24 animate-spin-slow" />
          <span className="text-lg text-gray-700 font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <span className="text-lg text-red-600 font-semibold">Error fetching data: {error.message}</span>
      </div>
    );
  }

  if (!data) {
    return <div className="flex justify-center items-center h-screen">Data not available</div>;
  }

  const poolDetailsParsed = data[0].result?.poolDetails ? JSON.parse(data[0].result.poolDetails) : {};
  const baseReserve = parseFloat(formatUnits(data[0].result.virtualBaseReserve, 18));
  const quoteReserve = parseFloat(formatUnits(data[0].result.virtualQuoteReserve, 18));
  const maxSupply = parseFloat(formatUnits(data[0].result.maxListingBaseAmount, 18));

console.log({poolDetailsParsed})
  const prices = [];
  const supplies = [];

  // Generate price points based on bonding curve
  for (let supply = 1; supply <= maxSupply; supply += maxSupply / 1000) {
    const adjustedBaseReserve = baseReserve + supply;
    const price = quoteReserve / adjustedBaseReserve;
    prices.push(price * (10 ** 9));
    supplies.push(supply);
  }

  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
  const chartData = {
    labels: supplies,
    datasets: [
      {
        label: 'Price vs. Supply',
        data: prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Bonding Curve',
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: `Supply in ${chain?.nativeCurrency?.symbol ?? 'ETH'}`,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price in Gwei',
        },
      },
    },
  };



  return (
    <div className="token-detail-page">
      {/* Hero Section similar to Home */}
      <section className='hero-section relative overflow-hidden'>
        <div className='hero-bg absolute inset-0'></div>
        <div className='container mx-auto px-4 relative z-10'>
          <div className='flex flex-col lg:flex-row items-center min-h-[60vh] py-16'>
            <div className='lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0'>
              <div className='hero-badge inline-flex items-center px-4 py-2 rounded-full mb-6'>
                <span className='badge-dot w-2 h-2 rounded-full mr-2'></span>
                <span className='text-sm font-medium'>Token Details</span>
              </div>
              <h1 className='hero-title text-4xl lg:text-6xl font-bold mb-6 leading-tight'>
                <span className='gradient-text'>{poolDetailsParsed.name}</span>
              </h1>
              <h2 className='hero-subtitle text-xl lg:text-2xl font-semibold mb-6 text-gray-300'>
                ${poolDetailsParsed.symbol}
              </h2>
              <p className='hero-description text-lg mb-8 text-gray-400 max-w-2xl'>
                {poolDetailsParsed.description}
              </p>
              <div className='hero-buttons flex flex-col sm:flex-row gap-4'>
                <div className="flex gap-4">
                  {poolDetailsParsed.Website && (
                    <a href={poolDetailsParsed.Website} target='_blank' rel="noopener noreferrer" 
                       className="hero-btn-secondary inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105">
                      <i className="fa fa-globe mr-2"></i>
                      Website
                    </a>
                  )}
                  {poolDetailsParsed.Twitter && (
                    <a href={poolDetailsParsed.Twitter} target='_blank' rel="noopener noreferrer"
                       className="hero-btn-secondary inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105">
                      <i className="fa fa-twitter mr-2"></i>
                      Twitter
                    </a>
                  )}
                  {poolDetailsParsed.Telegram && (
                    <a href={poolDetailsParsed.Telegram} target='_blank' rel="noopener noreferrer"
                       className="hero-btn-secondary inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105">
                      <i className="fa fa-telegram mr-2"></i>
                      Telegram
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className='lg:w-1/2 flex justify-center lg:justify-end'>
              <div className='hero-image-container relative'>
                <div className='floating-elements absolute inset-0'>
                  <div className='floating-card floating-card-1'></div>
                  <div className='floating-card floating-card-2'></div>
                  <div className='floating-card floating-card-3'></div>
                </div>
                <img src={poolDetailsParsed?.image} className="hero-image relative z-10 rounded-3xl" alt={poolDetailsParsed.name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='stats-section py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='stat-card text-center'>
              <div className='stat-number text-3xl font-bold mb-2 gradient-text'>
                ${(parseFloat(formatUnits(data[0].result.virtualQuoteReserve, 18)) * 10000000 * priceInDollar['1868'] / parseFloat(formatUnits(data[0].result.virtualBaseReserve, 18))).toFixed(2)}
              </div>
              <div className='stat-label text-gray-400'>Market Cap</div>
            </div>
            <div className='stat-card text-center'>
              <div className='stat-number text-3xl font-bold mb-2 gradient-text'>
                {Math.floor((parseFloat(formatUnits(data[0].result.virtualQuoteReserve, 18)) - parseFloat(formatUnits(data[1].result.initialVirtualQuoteReserve, 18))) / (parseFloat(formatUnits(data[0].result.maxListingQuoteAmount, 18)) + parseFloat(formatUnits(data[0].result.listingFee, 18))) * 100)}%
              </div>
              <div className='stat-label text-gray-400'>Progress</div>
            </div>
            <div className='stat-card text-center'>
              <div className='stat-number text-3xl font-bold mb-2 gradient-text'>{poolDetailsParsed.Tag}</div>
              <div className='stat-label text-gray-400'>Category</div>
            </div>
            <div className='stat-card text-center'>
              <div className='stat-number text-3xl font-bold mb-2 gradient-text'>
                {data[0].result?.startTime ? new Date(Number(data[0].result.startTime) * 1000).toLocaleDateString() : 'N/A'}
              </div>
              <div className='stat-label text-gray-400'>Launch Date</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar - Token Info */}
            <div className="lg:col-span-3">
              <div className="modern-card p-6 mb-6">
                <h3 className="section-title text-2xl font-bold mb-6 gradient-text">Token Information</h3>
                <TokenInfo poolDetails={poolDetailsParsed} data={data} />
              </div>
              
              <div className="modern-card p-6">
                <h3 className="section-title text-2xl font-bold mb-6 gradient-text">Tokenomics</h3>
                <div className="tokenomic-chart">
                  <img className="w-full rounded-lg" src="/images/chart.png" alt="Tokenomics Chart" />
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className="lg:col-span-6">
              {/* Token Header */}
              <div className="modern-card p-6 mb-6">
                <div className="flex items-center gap-6">
                  <img src={poolDetailsParsed?.image} alt={poolDetailsParsed.name} 
                       className="w-20 h-20 rounded-2xl border-2 border-gold" />
                  <div>
                    <h2 className="text-3xl font-bold gradient-text">{poolDetailsParsed.name}</h2>
                    <p className="text-xl text-gray-400">${poolDetailsParsed.symbol}</p>
                  </div>
                </div>
              </div>

              {/* Video Section */}
              {poolDetailsParsed.video && poolDetailsParsed.video.length > 0 && (
                <div className="modern-card p-6 mb-6">
                  <h3 className="section-title text-2xl font-bold mb-6 gradient-text">Project Video</h3>
                  <Video link={poolDetailsParsed.video} />
                </div>
              )}

              {/* Transactions */}
              <div className="modern-card p-6">
                <h3 className="section-title text-2xl font-bold mb-6 gradient-text">Trading Activity</h3>
                <TradeEventList contractAddress={token} />
              </div>
            </div>

            {/* Right Sidebar - Trading */}
            <div className="lg:col-span-3">
              <div className="modern-card p-6 mb-6">
                <h3 className="section-title text-2xl font-bold mb-6 gradient-text">Trading</h3>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm text-gray-400">Hard Cap</span>
                  </div>
                  <div className="progress mb-4">
                    <div className="progress-bar" role="progressbar" 
                         style={{ width: `${Math.floor((parseFloat(formatUnits(data[0].result.virtualQuoteReserve, 18)) - parseFloat(formatUnits(data[1].result.initialVirtualQuoteReserve, 18))) / (parseFloat(formatUnits(data[0].result.maxListingQuoteAmount, 18)) + parseFloat(formatUnits(data[0].result.listingFee, 18))) * 100)}%` }}>
                      {Math.floor((parseFloat(formatUnits(data[0].result.virtualQuoteReserve, 18)) - parseFloat(formatUnits(data[1].result.initialVirtualQuoteReserve, 18))) / (parseFloat(formatUnits(data[0].result.maxListingQuoteAmount, 18)) + parseFloat(formatUnits(data[0].result.listingFee, 18))) * 100)}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    When the market cap hits <span className='gradient-text font-bold'>
                      ${(parseFloat(formatUnits(data[1].result.maxListingQuoteAmount, 18)) * 10000000 * priceInDollar['1868'] / parseFloat(formatUnits(data[1].result.maxListingBaseAmount, 18))).toFixed(2)}
                    </span>, all liquidity from the bonding curve will be deposited into the DEX and burned.
                  </p>
                </div>

                <BuySell data={data[0].result} token={token} tokenBalance={tokenBalance} reserve={data[1].result} />
              </div>
              
              {/* Chart */}
              <div className="modern-card p-6">
                <h3 className="section-title text-2xl font-bold mb-6 gradient-text">Price Chart</h3>
                <div className="chart-container">
                  <Line data={chartData} options={options} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};


export default CardPage;
