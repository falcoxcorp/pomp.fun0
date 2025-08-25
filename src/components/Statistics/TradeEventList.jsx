import { useAccount, usePublicClient } from 'wagmi';
import { getBlockNumber } from '@wagmi/core'
import React, { useEffect, useState } from 'react';
import { config } from '../../wagmiClient';
import { Link } from 'react-router-dom';

// ABI fragment for the Trade event
const tradeEventAbi = {
  "anonymous": false,
  "inputs": [
    { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
    { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
    { "indexed": false, "internalType": "uint256", "name": "amountIn", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "amountOut", "type": "uint256" },
    { "indexed": false, "internalType": "bool", "name": "isBuy", "type": "bool" },
    { "indexed": false, "internalType": "uint256", "name": "baseReserve", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "quoteReserve", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
  ],
  "name": "Trade",
  "type": "event"
};

// Constants for block range management
const MAX_BLOCK_RANGE = 499; // Alchemy's strict limit for Soneium (using 499 to be safe)
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second base delay
const CHUNK_DELAY = 150; // Delay between chunks to avoid rate limiting

// Utility function to sleep/delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced error handling for RPC calls
const isRetryableError = (error) => {
  const message = error.message?.toLowerCase() || '';
  return (
    message.includes('rate limit') ||
    message.includes('timeout') ||
    message.includes('network') ||
    message.includes('connection') ||
    message.includes('too many requests') ||
    message.includes('block range') ||
    message.includes('query returned more than') ||
    error.code === -32005 || // Rate limit exceeded
    error.code === -32000 ||  // Generic server error
    error.code === -32602     // Invalid params (often block range related)
  );
};

// Utility function to normalize block numbers (handle both hex and decimal)
const normalizeBlockNumber = (blockNumber) => {
  if (typeof blockNumber === 'string' && blockNumber.startsWith('0x')) {
    return BigInt(blockNumber);
  }
  return BigInt(blockNumber);
};

// Validate block range inputs
const validateBlockRange = (fromBlock, toBlock) => {
  try {
    const from = normalizeBlockNumber(fromBlock);
    const to = normalizeBlockNumber(toBlock);
    
    if (from < 0n || to < 0n) {
      throw new Error('Block numbers must be non-negative');
    }
    
    if (from > to) {
      throw new Error('fromBlock cannot be greater than toBlock');
    }
    
    return { from, to };
  } catch (error) {
    throw new Error(`Invalid block range: ${error.message}`);
  }
};

// Robust log fetching with chunking and retry logic
const fetchLogsWithChunking = async (publicClient, contractAddress, fromBlock, toBlock, eventAbi) => {
  // Validate and normalize block numbers
  const { from: normalizedFromBlock, to: normalizedToBlock } = validateBlockRange(fromBlock, toBlock);
  const totalBlocks = Number(normalizedToBlock - normalizedFromBlock);
  
  // Handle edge case where range is 0 or negative
  if (totalBlocks <= 0) {
    console.log('📊 Empty or invalid block range, returning empty results');
    return [];
  }
  
  const chunks = Math.ceil(totalBlocks / MAX_BLOCK_RANGE);
  
  console.log(`📊 Fetching logs across ${totalBlocks} blocks in ${chunks} chunks`);
  console.log(`📋 Block range: ${normalizedFromBlock.toString()} to ${normalizedToBlock.toString()}`);
  
  let allLogs = [];
  let processedChunks = 0;
  let failedChunks = 0;

  for (let i = 0; i < chunks; i++) {
    const chunkFromBlock = normalizedFromBlock + BigInt(i * MAX_BLOCK_RANGE);
    const chunkToBlock = i === chunks - 1 
      ? normalizedToBlock 
      : normalizedFromBlock + BigInt((i + 1) * MAX_BLOCK_RANGE - 1);

    // Ensure we don't exceed the original toBlock
    const actualChunkToBlock = chunkToBlock > normalizedToBlock ? normalizedToBlock : chunkToBlock;
    const chunkSize = Number(actualChunkToBlock - chunkFromBlock + 1n);

    console.log(`🔄 Processing chunk ${i + 1}/${chunks}: blocks ${chunkFromBlock.toString()} to ${actualChunkToBlock.toString()} (${chunkSize} blocks)`);

    // Retry logic for each chunk
    let chunkLogs = [];
    let attempt = 0;
    let chunkSuccess = false;
    
    while (attempt < RETRY_ATTEMPTS) {
      try {
        chunkLogs = await publicClient.getLogs({
          address: contractAddress,
          event: eventAbi,
          fromBlock: chunkFromBlock,
          toBlock: actualChunkToBlock,
        });
        
        console.log(`✅ Chunk ${i + 1} completed: ${chunkLogs.length} logs found`);
        chunkSuccess = true;
        break; // Success, exit retry loop
        
      } catch (error) {
        attempt++;
        const errorMsg = error.message || error.toString();
        console.warn(`⚠️ Chunk ${i + 1} attempt ${attempt}/${RETRY_ATTEMPTS} failed:`, errorMsg);
        
        if (attempt >= RETRY_ATTEMPTS) {
          console.error(`❌ Chunk ${i + 1} failed after ${RETRY_ATTEMPTS} attempts. Error:`, errorMsg);
          
          // Try to recover with smaller sub-chunks for block range errors
          if (errorMsg.includes('block range') || errorMsg.includes('query returned more than')) {
            console.log(`🔄 Attempting recovery with smaller sub-chunks for chunk ${i + 1}...`);
            const smallerChunkSize = Math.max(50, Math.floor(chunkSize / 4)); // Use 1/4 size or minimum 50
            const subChunks = Math.ceil(chunkSize / smallerChunkSize);
            
            console.log(`📦 Breaking chunk ${i + 1} into ${subChunks} sub-chunks of ~${smallerChunkSize} blocks each`);
            
            for (let j = 0; j < subChunks; j++) {
              const subFromBlock = chunkFromBlock + BigInt(j * smallerChunkSize);
              const subToBlock = j === subChunks - 1 
                ? actualChunkToBlock 
                : chunkFromBlock + BigInt((j + 1) * smallerChunkSize - 1);
              
              try {
                console.log(`🔍 Sub-chunk ${j + 1}/${subChunks}: ${subFromBlock.toString()} to ${subToBlock.toString()}`);
                const subChunkLogs = await publicClient.getLogs({
                  address: contractAddress,
                  event: eventAbi,
                  fromBlock: subFromBlock,
                  toBlock: subToBlock,
                });
                chunkLogs.push(...subChunkLogs);
                console.log(`✅ Sub-chunk ${j + 1} completed: ${subChunkLogs.length} logs`);
                
                // Small delay between sub-chunks
                if (j < subChunks - 1) {
                  await sleep(50);
                }
              } catch (subError) {
                console.error(`❌ Sub-chunk ${j + 1} failed: ${subFromBlock.toString()} to ${subToBlock.toString()}`, subError.message || subError.toString());
                // Continue with other sub-chunks rather than failing completely
              }
            }
            
            if (chunkLogs.length > 0) {
              console.log(`🎯 Recovery successful for chunk ${i + 1}: ${chunkLogs.length} logs retrieved via sub-chunking`);
              chunkSuccess = true;
            }
            break;
          } else {
            // For non-recoverable errors, log and continue with other chunks
            console.error(`💥 Non-recoverable error in chunk ${i + 1}:`, errorMsg);
            failedChunks++;
            break;
          }
        }
        
        // Exponential backoff with jitter
        if (isRetryableError(error)) {
          const delay = RETRY_DELAY * Math.pow(2, attempt - 1) + Math.random() * 1000;
          console.log(`⏳ Waiting ${Math.round(delay)}ms before retry attempt ${attempt + 1}...`);
          await sleep(delay);
        } else {
          console.error(`🚫 Non-retryable error in chunk ${i + 1}:`, errorMsg);
          failedChunks++;
          break;
        }
      }
    }
    
    // Only add logs if chunk was successful
    if (chunkSuccess) {
      allLogs.push(...chunkLogs);
      processedChunks++;
    }

    // Progress logging
    const completedChunks = i + 1;
    const progress = Math.round((completedChunks / chunks) * 100);
    console.log(`📈 Progress: ${progress}% (${completedChunks}/${chunks} chunks processed, ${processedChunks} successful, ${failedChunks} failed, ${allLogs.length} total logs)`);
    
    // Rate limiting: delay between chunks to be respectful to the RPC
    if (i < chunks - 1) {
      await sleep(CHUNK_DELAY);
    }
  }

  // Final summary
  const successRate = chunks > 0 ? Math.round((processedChunks / chunks) * 100) : 0;
  console.log(`🎉 Log fetching completed: ${allLogs.length} total logs retrieved`);
  console.log(`📊 Success rate: ${successRate}% (${processedChunks}/${chunks} chunks successful)`);
  
  if (failedChunks > 0) {
    console.warn(`⚠️ Warning: ${failedChunks} chunks failed. Some logs may be missing.`);
  }
  
  return allLogs;
};

// React hook to fetch Trade events
export function useTradeEvents(contractAddress) {
  const publicClient = usePublicClient();

  const fetchEvents = async () => {
    try {
      console.log(`🚀 Starting log fetch for contract: ${contractAddress}`);
      
      const blockNumber = await getBlockNumber(config);
      const fromBlock = blockNumber - 10000n; // Reduced range for better reliability
      const toBlock = blockNumber; // Current block
      
      const totalBlocks = Number(toBlock - fromBlock);
      console.log(`📋 Block range: ${fromBlock.toString()} to ${toBlock.toString()} (${totalBlocks} blocks)`);
      
      // Input validation
      if (totalBlocks <= 0) {
        console.warn('⚠️ Invalid block range detected, returning empty results');
        return [];
      }
      
      if (totalBlocks > 100000) {
        console.warn(`⚠️ Very large block range detected (${totalBlocks} blocks). This may take a while...`);
      }
      
      // Check if range exceeds limit
      let logs;
      
      if (totalBlocks > MAX_BLOCK_RANGE) {
        console.log(`⚡ Large range detected, using chunked fetching...`);
        logs = await fetchLogsWithChunking(publicClient, contractAddress, fromBlock, toBlock, tradeEventAbi);
      } else {
        console.log(`✨ Small range, using direct fetch...`);
        
        // Even for small ranges, add retry logic
        let attempt = 0;
        while (attempt < RETRY_ATTEMPTS) {
          try {
            logs = await publicClient.getLogs({
              address: contractAddress,
              event: tradeEventAbi,
              fromBlock: fromBlock,
              toBlock: toBlock,
            });
            break;
          } catch (error) {
            attempt++;
            console.warn(`⚠️ Direct fetch attempt ${attempt}/${RETRY_ATTEMPTS} failed:`, error.message);
            
            if (attempt >= RETRY_ATTEMPTS) {
              throw error;
            }
            
            if (isRetryableError(error)) {
              const delay = RETRY_DELAY * Math.pow(2, attempt - 1) + Math.random() * 500;
              console.log(`⏳ Waiting ${Math.round(delay)}ms before retry...`);
              await sleep(delay);
            } else {
              throw error;
            }
          }
        }
      }

      // Validate logs array
      if (!Array.isArray(logs)) {
        console.error('❌ Invalid logs response: expected array, got:', typeof logs);
        return [];
      }

      // Transform logs to the expected format
      const transformedLogs = logs.map((log) => ({
        token: log.args.token,
        user: log.args.user,
        amountIn: log.args.amountIn.toString(),
        amountOut: log.args.amountOut.toString(),
        isBuy: log.args.isBuy,
        baseReserve: log.args.baseReserve.toString(),
        quoteReserve: log.args.quoteReserve.toString(),
        timestamp: Number(log.args.timestamp) * 1000,
        transactionHash: log.transactionHash,
      }));
      
      console.log(`✅ Successfully processed ${transformedLogs.length} trade events`);
      return transformedLogs;
      
    } catch (error) {
      console.error('❌ Error fetching trade events:', error);
      
      // Provide user-friendly error messages
      if (error.message?.includes('block range')) {
        throw new Error('Block range issue detected. The system attempted automatic recovery, but some data may be incomplete.');
      } else if (error.message?.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.message?.includes('network') || error.message?.includes('connection')) {
        throw new Error('Network connection issue. Please check your internet and try again.');
      } else if (error.message?.includes('Invalid block range')) {
        throw new Error('Invalid block range parameters. Please refresh the page and try again.');
      } else {
        throw new Error(`Failed to fetch trade events: ${error.message}`);
      }
    }
  };


  return { fetchEvents };
}

// Usage Example in a Component

function TradeEventList({ contractAddress }) {
  const { chain, address } = useAccount();
  const { fetchEvents } = useTradeEvents();
  const [tradeEvents, setTradeEvents] = useState([]);
  const [allYour, setAllYour] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const blockExplorerUrl = chain?.blockExplorers?.default?.url;
  
  useEffect(() => {
    const getEvents = async () => {
      if (!contractAddress) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`🔍 Fetching events for contract: ${contractAddress}`);
        const events = await fetchEvents(contractAddress);
        setTradeEvents(events);
        console.log(`📊 Loaded ${events.length} trade events`);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError(err.message);
        setTradeEvents([]); // Clear previous data on error
      } finally {
        setLoading(false);
      }
    };
    
    getEvents();
  }, [contractAddress]);

  // Loading state
  if (loading) {
    return (
      <div className='buysell pricetabel'>
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-2"></div>
            <p className="text-gray-600">Loading trade events...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='buysell pricetabel'>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Trade Events</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='buysell pricetabel'>
      {/* Buttons for All/Your Transactions */}
      <div className="btngroup flex mb-6">
        <button
          className={`buy px-6 py-3 text-white text-md font-semibold rounded-lg transition duration-300 w-full ${!allYour ? '' : 'bg-gold'}`}
          onClick={() => setAllYour(false)}>
          <h2>All Transactions</h2>
        </button>
        <button
          className={`sell px-6 py-3 text-white text-md font-semibold rounded-lg  transition duration-300 w-full ${allYour ? '' : 'bg-gold'}`}
          onClick={() => setAllYour(true)}>
          <h2>Your Transactions</h2>
        </button>
      </div>

      {/* Table to display Trade Events */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
        <table className="pricechart min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-gray-700 font-semibold">Owner</th>
              <th className="py-3 px-6 text-gray-700 font-semibold">Type</th>
              <th className="py-3 px-6 text-gray-700 font-semibold">Sonieum</th>
              <th className="py-3 px-6 text-gray-700 font-semibold">Token</th>
              <th className="py-3 px-6 text-gray-700 font-semibold">Age (Days)</th>
              <th className="py-3 px-6 text-gray-700 font-semibold">Transaction Hash</th>
            </tr>
          </thead>
          <tbody className="max-h-[300px] overflow-y-auto">
            {!allYour
              ? tradeEvents.map((event, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-6 text-gray-800">{event.user}</td>
                  <td className="py-3 px-6">{event.isBuy ? 'Buy' : 'Sell'}</td>
                  <td className="py-3 px-6">
                    {event.isBuy ? (parseFloat(event.amountIn) / 10 ** 18).toFixed(18) : (parseFloat(event.amountOut) / 10 ** 18).toFixed(18)}
                  </td>
                  <td className="py-3 px-6">
                    {event.isBuy ? (parseFloat(event.amountOut) / 10 ** 18).toFixed(18) : (parseFloat(event.amountIn) / 10 ** 18).toFixed(18)}
                  </td>
                  <td className="py-3 px-6">
                    {Math.floor((new Date() - event.timestamp) / (1000 * 60 * 60 * 24))}
                  </td>
                  <td className="py-3 px-6">
                    <Link
                      to={`${blockExplorerUrl}/tx/${event.transactionHash}`}
                      className="hover:underline" target='_blank'
                    >
                      {event.transactionHash}
                    </Link>
                  </td>
                </tr>
              ))
              : tradeEvents
                .filter((event) => event.user === address)
                .map((event, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-6 text-gray-800">{event.user}</td>
                    <td className="py-3 px-6">{event.isBuy ? 'Buy' : 'Sell'}</td>
                    <td className="py-3 px-6">
                      {event.isBuy ? (parseFloat(event.amountIn) / 10 ** 18).toFixed(18) : (parseFloat(event.amountOut) / 10 ** 18).toFixed(18)}
                    </td>
                    <td className="py-3 px-6">
                      {event.isBuy ? (parseFloat(event.amountOut) / 10 ** 18).toFixed(18) : (parseFloat(event.amountIn) / 10 ** 18).toFixed(18)}
                    </td>
                    <td className="py-3 px-6">
                      {Math.floor((new Date() - event.timestamp) / (1000 * 60 * 60 * 24))}
                    </td>
                    <td className="py-3 px-6">
                      <Link
                        to={`${blockExplorerUrl}/tx/${event.transactionHash}`}
                        className="text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        {event.transactionHash}
                      </Link>
                    </td>
                  </tr>
                ))}
            {tradeEvents.length === 0 && !loading && !error && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No trade events found for this token.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TradeEventList;
