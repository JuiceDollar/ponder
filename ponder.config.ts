import { createConfig } from '@ponder/core';
import { testnet } from './chains';
import { Address, http } from 'viem';

import {
	ADDRESS,
	JuiceDollarABI,
	EquityABI,
	MintingHubV2ABI,
	PositionRollerABI,
	PositionV2ABI,
	SavingsABI,
	FrontendGatewayABI,
} from '@juicedollar/jusd';

// mainnet (default) or polygon
// TODO: Remove this once we have a proper mainnet
// export const chain = (process.env.PONDER_PROFILE as string) == 'testnet' ? testnet : mainnet;
export const chain = testnet;
export const Id = chain.id!;
export const ADDR = ADDRESS[Id]!;

export const CONFIG = {
	[Id]: {
		rpc: process.env.RPC_URL_MAINNET ?? chain.rpcUrls.default.http[0],
		startStablecoin: 17856693,
		startMintingHubV2: 17856693,
		blockrange: 1000,
		maxRequestsPerSecond: 50,
		pollingInterval: 5_000,
	},
};

export const config = CONFIG[Id]!;

const openPositionEventV2 = MintingHubV2ABI.find((a) => a.type === 'event' && a.name === 'PositionOpened');
if (openPositionEventV2 === undefined) throw new Error('openPositionEventV2 not found.');

export default createConfig({
	networks: {
		[chain.name]: {
			chainId: Id,
			maxRequestsPerSecond: config.maxRequestsPerSecond,
			pollingInterval: config.pollingInterval,
			transport: http(config.rpc),
		},
	},
	contracts: {
		Stablecoin: {
			network: chain.name,
			abi: JuiceDollarABI,
			address: ADDR.juiceDollar as Address,
			startBlock: config.startStablecoin,
			maxBlockRange: config.blockrange,
		},
		Equity: {
			network: chain.name,
			abi: EquityABI,
			address: ADDR.equity as Address,
			startBlock: config.startStablecoin,
			maxBlockRange: config.blockrange,
		},
		MintingHubV2: {
			// V2
			network: chain.name,
			abi: MintingHubV2ABI,
			address: ADDR.mintingHubGateway as Address,
			startBlock: config.startMintingHubV2,
			maxBlockRange: config.blockrange,
		},
		PositionV2: {
			// V2
			network: chain.name,
			abi: PositionV2ABI,
			factory: {
				address: ADDR.mintingHubGateway as Address,
				event: openPositionEventV2,
				parameter: 'position',
			},
			startBlock: config.startMintingHubV2,
			maxBlockRange: config.blockrange,
		},
		Savings: {
			// V2
			network: chain.name,
			abi: SavingsABI,
			address: ADDR.savingsGateway as Address,
			startBlock: config.startMintingHubV2,
			maxBlockRange: config.blockrange,
		},
		Roller: {
			// V2
			network: chain.name,
			abi: PositionRollerABI,
			address: ADDR.roller as Address,
			startBlock: config.startMintingHubV2,
			maxBlockRange: config.blockrange,
		},
		FrontendGateway: {
			network: chain.name,
			abi: FrontendGatewayABI,
			address: ADDR.frontendGateway as Address,
			startBlock: config.startMintingHubV2,
			maxBlockRange: config.blockrange,
		},
	},
});
