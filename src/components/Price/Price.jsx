import React, { useState } from "react";

const Price = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCryptoData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,dogecoin,solana,ordinals&vs_currencies=usd&include_24hr_change=true"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log(data); // Debugging: log the response to check

      const formattedData = [
        { symbol: "BTC", price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
        { symbol: "ETH", price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
        { symbol: "ETH", price: data.binancecoin.usd, change: data.binancecoin.usd_24h_change },
        { symbol: "DOGE", price: data.dogecoin.usd, change: data.dogecoin.usd_24h_change },
        { symbol: "SOL", price: data.solana.usd, change: data.solana.usd_24h_change },
        { symbol: "ORDI", price: data.ordinals.usd, change: data.ordinals.usd_24h_change },
      ];

      setCryptoData(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <button
        className="px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors mb-8"
        onClick={fetchCryptoData}
      >
        Fetch Real-Time Data
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {cryptoData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cryptoData.map((crypto) => (
            <div
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              key={crypto.symbol}
            >
              <h3 className="text-2xl font-bold text-center mb-4">{crypto.symbol} / USD</h3>
              <p className="text-lg font-semibold text-center mb-2">Price: ${crypto.price.toFixed(2)}</p>
              <p className="text-md text-center text-gray-500">24h Change: {crypto.change.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Price;
