import { createConfig, factory, rateLimit } from 'ponder';
import { testnet, mainnet } from './chains';
import { Address } from 'viem';
import { AbiEvent } from 'abitype';
import { citreaTransport } from './citrea-transport-fix';

import {
	ADDRESS,
	JuiceDollarABI,
	EquityABI,
	MintingHubV2ABI,
	PositionRollerABI,
	PositionV2ABI,
	SavingsABI,
	FrontendGatewayABI,
	StablecoinBridgeABI,
} from '@juicedollar/jusd';

// mainnet (default) or testnet
export const chain = (process.env.PONDER_PROFILE as string) == 'testnet' ? testnet : mainnet;
export const Id = chain.id!;
export const ADDR = ADDRESS[Id]!;

const MAINNET_CONFIG = {
	rpc: process.env.RPC_URL_MAINNET ?? mainnet.rpcUrls.default.http[0],
	startStablecoin: 2650850,
	startMintingHubV2: 2650850,
	maxRequestsPerSecond: 50,
	pollingInterval: 5_000,
};

const TESTNET_CONFIG = {
	rpc: process.env.RPC_URL_TESTNET ?? testnet.rpcUrls.default.http[0],
	startStablecoin: 21252514,
	startMintingHubV2: 21252514,
	maxRequestsPerSecond: 50,
	pollingInterval: 5_000,
};

export const CONFIG = {
	[mainnet.id]: MAINNET_CONFIG,
	[testnet.id]: TESTNET_CONFIG,
};

export const config = CONFIG[Id]!;

const openPositionEventV2 = MintingHubV2ABI.find((a) => a.type === 'event' && a.name === 'PositionOpened') as AbiEvent;
if (!openPositionEventV2) throw new Error('openPositionEventV2 not found.');

export default createConfig({
	chains: {
		[chain.name]: {
			id: Id,
			rpc: rateLimit(citreaTransport(config.rpc), { requestsPerSecond: config.maxRequestsPerSecond }),
			pollingInterval: config.pollingInterval,
		},
	},
	contracts: {
		Stablecoin: {
			chain: chain.name,
			abi: JuiceDollarABI,
			address: ADDR.juiceDollar as Address,
			startBlock: config.startStablecoin,
		},
		Equity: {
			chain: chain.name,
			abi: EquityABI,
			address: ADDR.equity as Address,
			startBlock: config.startStablecoin,
		},
		MintingHubV2: {
			// V2
			chain: chain.name,
			abi: MintingHubV2ABI,
			address: ADDR.mintingHubGateway as Address,
			startBlock: config.startMintingHubV2,
		},
		PositionV2: {
			// V2
			chain: chain.name,
			abi: PositionV2ABI,
			address: factory({
				address: ADDR.mintingHubGateway as Address,
				event: openPositionEventV2,
				parameter: 'position',
			}),
			startBlock: config.startMintingHubV2,
		},
		Savings: {
			// V2
			chain: chain.name,
			abi: SavingsABI,
			address: ADDR.savingsGateway as Address,
			startBlock: config.startMintingHubV2,
		},
		Roller: {
			// V2
			chain: chain.name,
			abi: PositionRollerABI,
			address: ADDR.roller as Address,
			startBlock: config.startMintingHubV2,
		},
		FrontendGateway: {
			chain: chain.name,
			abi: FrontendGatewayABI,
			address: ADDR.frontendGateway as Address,
			startBlock: config.startMintingHubV2,
		},
		StablecoinBridge: {
			chain: chain.name,
			abi: StablecoinBridgeABI,
			address: [
				ADDR.bridgeStartUSD,
				ADDR.bridgeUSDC,
				ADDR.bridgeUSDT,
				ADDR.bridgeCTUSD,
			].filter((a): a is Address => !!a),
			startBlock: config.startStablecoin,
		},
	},
});
