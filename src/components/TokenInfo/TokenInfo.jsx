import React from 'react';
import { priceInDollar, routers } from '../../helper/Helper';

const getRouter = (value, chain = '97') => {
    const router = routers[chain] || [];
    return Object.keys(router).find(key => router[key].toLowerCase() === value?.toLowerCase())
}

const TokenInfo = ({ poolDetails, data }) => {
    return (
        <div className="tokeninfo">
            <h3 className="text-xl font-semibold text-gray-800">Token Info</h3>
            <ul className="mt-4 space-y-3 text-gray-600">
                <li><strong>Name :</strong> <span> {poolDetails.name}</span></li>
                <li><strong>Symbol :</strong> <span>{poolDetails.symbol}</span></li>
                <li><strong>Description : &nbsp;
                </strong> {poolDetails.description}</li>
                <li><strong>Tag :</strong> <span>{poolDetails.Tag}</span></li>
                <li><strong>Router :</strong> <span>{getRouter(data[0].result.router, 1868)}</span></li>
                <li><strong>Market Cap :</strong><span>${(parseInt(data[0].result.virtualQuoteReserve) * 10000000 * priceInDollar['1868'] / parseInt(data[0].result.virtualBaseReserve)).toString()}</span></li>
                <li>
                    <strong>Address :
                        <a
                            href={`https://soneium.blockscout.com/token/${data[0].result?.token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 text-gray-500 hover:underline hover:text-gold"
                        >
                            <span>{data[0].result?.token ? `${data[0].result.token.slice(0, 10)}...${data[0].result.token.slice(-9)}` : ''}</span>
                        </a>
                    </strong>
                </li>
                <li><strong>Start Time :</strong><span> {data[0].result?.startTime ? new Date(Number(data[0].result.startTime) * 1000).toLocaleString() : 'N/A'}</span></li>
            </ul>
        </div>
    )
}

export default TokenInfo