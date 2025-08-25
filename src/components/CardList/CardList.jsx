import React, { useState, useEffect } from 'react';
import { readContracts } from 'wagmi/actions';
import { config } from '../../wagmiClient';
import Card from '../Card/Card';
import abi from "../../helper/ManagerFaucetAbi.json";
import { daimond } from '../../helper/Helper';


const CardList = ({activeTable}) => {
  const [error, setError] = useState(null); // Error state
  const [totalTokens, setTotalTokens] = useState(null); // Total tokens count state
  const [reserve, setReserve] = useState(null); // Total tokens count state

  useEffect(() => {
    const fetchPoolCount = async () => {
      try {
        // console.log("Fetching pool count...");
        const result = await readContracts(config, {
          contracts: [{
            address: daimond[1868],
            abi,
            functionName: 'getPoolCount',
            chainId: 1868
          }, {
            abi,
            address: daimond[1868],
            functionName: 'getPoolConfig',
            args: [20],
            chainId: 1868
          }]
        });
        setTotalTokens(result[0].result.toString());
        setReserve(result[1].result);
      } catch (error) {
        // console.error("Error fetching pool count:", error);
        setError(error.message); // Set the error state
      }
    };

    fetchPoolCount();
  }, []);
  
  if (error) {
    return <div className="flex justify-center items-center h-14">Error: {error}</div>;
  }

  return (
    <div>
      <div className="cardbox grid grid-cols-1 mb-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
        {
          Array.from({ length: totalTokens || 0 }, (_, index) => {
            return <Card key={index} id={index + 1} reserve={reserve} activeTable={activeTable}/>;
          })
        }
      </div>

    </div>
  );
};

export default CardList;
