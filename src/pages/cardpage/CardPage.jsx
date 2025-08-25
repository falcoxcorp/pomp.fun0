import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { readContract } from 'wagmi/actions';
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
  const baseReserve = Number(data[0].result.virtualBaseReserve) / (10 ** 18);
  const quoteReserve = Number(data[0].result.virtualQuoteReserve) / (10 ** 18);
  const maxSupply = Number(data[0].result.maxListingBaseAmount) / (10 ** 18);

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
    <>
      <div className="slidersection">
        <div className="container">
          <div className='row'>
            {/* leftbox */}
            <div className='col-md-3'>
              <div className='boxc'>
                <span className="socialicon">
                  {poolDetailsParsed.Website && <a href={poolDetailsParsed.Website} target='_blank'><i className="fa fa-globe"></i></a>}
                  {poolDetailsParsed.Twitter && <a href={poolDetailsParsed.Twitter} target='_blank'><i className="fa fa-twitter"></i></a>}
                  {poolDetailsParsed.Telegram && <a href={poolDetailsParsed.Telegram} target='_blank'><i className="fa fa-telegram"></i></a>}
                </span>
                <TokenInfo poolDetails={poolDetailsParsed} data={data} />

                <hr className='separetar'></hr>
                <div className='tokenomic'>
                  <h3 className="text-xl font-semibold text-gray-800">Tokenomic</h3>
                  <img className="h-50 rounded" src="/images/chart.png" alt="Token image" />

                </div>
              </div>
            </div>

            {/* centerbox */}
            <div className='col-md-6'>
              <div className='boxc tpllogo'>

                <div className='row detaillogo'>
                  <div className='col-md-3'>
                    <img className="h-50 rounded" src={poolDetailsParsed?.image} alt="Token image" />
                  </div>
                  <div className='col-md-9 lgs'>
                    <h1 className='tokenname'>{poolDetailsParsed.name}</h1>
                  </div>
                </div>

              </div>

              {poolDetailsParsed.video.length >0 && <Video link={poolDetailsParsed.video} />}

              <div className='boxc AllTransactions'>
                <TradeEventList contractAddress={token} />
              </div>
            </div>

            {/* rightbox */}
            <div className='col-md-3'>
              <div className="boxc bg-white p-6 rounded-lg">

                <div className="progress">
                  <div className="progress-bar" role="progressbar" style={{ width: `${parseInt((data[0].result.virtualQuoteReserve - data[1].result.initialVirtualQuoteReserve) / (data[0].result.maxListingQuoteAmount + data[0].result.listingFee)) ** 100}%` }} aria-valuenow={`${parseInt((data[0].result.virtualQuoteReserve - data[1].result.initialVirtualQuoteReserve) / (data[0].result.maxListingQuoteAmount + data[0].result.listingFee)) ** 100}`} aria-valuemin="0" aria-valuemax="100">{`${parseInt((data[0].result.virtualQuoteReserve - data[1].result.initialVirtualQuoteReserve) / (data[0].result.maxListingQuoteAmount + data[0].result.listingFee)) ** 100}%`}</div>
                </div>
                <p>When the market cap hits <span className='text-yellow-100'>${(parseInt(data[1].result.maxListingQuoteAmount) * 10000000 * priceInDollar['1868'] / parseInt(data[1].result.maxListingBaseAmount)).toString()}</span>, All liquidity from the bonding curve will be deposited into Pancake Swap and burned. The progression accelerates as the price rises</p>

                <BuySell data={data[0].result} token={token} tokenBalance={tokenBalance} reserve={data[1].result} />
              </div>
              <div className='chartbox' style={{ width: '100%' }}>
                <Line data={chartData} options={options} />
              </div>

            </div>

          </div>
        </div>
      </div>



    </>
  );
};


export default CardPage;
