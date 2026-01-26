import { defineChain } from 'viem';

export const testnet = defineChain({
	id: 5115,
	name: 'Testnet',
	nativeCurrency: { name: 'cBTC', symbol: 'cBTC', decimals: 18 },
	rpcUrls: {
		default: { http: ['https://rpc.testnet.citrea.xyz'] },
	},
});

export const mainnet = defineChain({
	id: 4114,
	name: 'Mainnet',
	nativeCurrency: { name: 'cBTC', symbol: 'cBTC', decimals: 18 },
	rpcUrls: {
		default: { http: ['https://rpc.citrea.xyz'] },
	},
});
