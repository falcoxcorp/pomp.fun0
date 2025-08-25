import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {bscTestnet, soneium} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'HowSwap',
  projectId: '15787e2949e99efd12dc95c5e03cd127',
  chains: [
    // mainnet,
    // bsc,
    // bscTestnet,
    soneium
  ],
  transports: {
    // [bscTestnet.id]: http("https://bsc-prebsc-dataseed.ETHchain.org"),
    // [bsc.id]: http("https://bsc-mainnet.infura.io/v3/113f8fe63628446cb141f8e6618518ce"),
    [soneium.id]: http("https://soneium-mainnet.g.alchemy.com/v2/XQAa0JjXMHCm5fyFr1cTq-NdtNWsoO7P"),
  },
});