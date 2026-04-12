import { createConfig, factory, rateLimit } from 'ponder';
import { testnet, mainnet } from './chains';
import { Address, zeroAddress } from 'viem';
import { AbiEvent } from 'abitype';
import { citreaTransport } from './citrea-transport-fix';

import {
	ADDRESS,
	JuiceDollarABI,
	EquityABI,
	MintingHubV3ABI,
	PositionRollerV2ABI,
	PositionV2ABI,
	SavingsGatewayV2ABI,
	SavingsV3ABI,
	SavingsVaultJUSDABI,
	FrontendGatewayV2ABI,
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

const openPositionEvent = MintingHubV3ABI.find((a) => a.type === 'event' && a.name === 'PositionOpened') as AbiEvent;
if (!openPositionEvent) throw new Error('openPositionEvent not found.');

// V3 contracts deployed at this block on mainnet
export const V3_START_BLOCK = 5081799;

const isDeployed = (addr: string | undefined): addr is Address => !!addr && addr !== zeroAddress;

// MintingHub addresses (V2 + V3) for use in handlers
export const MINTING_HUB_ADDRESSES = new Set(
	[ADDR.mintingHubGateway, ADDR.mintingHub].filter(isDeployed).map((a) => a.toLowerCase())
);

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
		MintingHub: {
			// V2 + V3 (V3 ABI is superset — includes RateProposed/RateChanged from Leadrate)
			chain: chain.name,
			abi: MintingHubV3ABI,
			address: [ADDR.mintingHubGateway, ADDR.mintingHub].filter(isDeployed),
			startBlock: config.startMintingHubV2,
		},
		Position: {
			// Positions from V2 + V3 MintingHub factories
			chain: chain.name,
			abi: PositionV2ABI,
			address: factory({
				address: [ADDR.mintingHubGateway, ADDR.mintingHub].filter(isDeployed),
				event: openPositionEvent,
				parameter: 'position',
			}),
			startBlock: config.startMintingHubV2,
		},
		SavingsV2: {
			chain: chain.name,
			abi: SavingsGatewayV2ABI,
			address: ADDR.savingsGateway as Address,
			startBlock: config.startMintingHubV2,
		},
		SavingsV3: {
			chain: chain.name,
			abi: SavingsV3ABI,
			address: ADDR.savings as Address,
			startBlock: V3_START_BLOCK,
		},
		SavingsVaultJUSD: {
			// V2 + V3 (identical event signatures)
			chain: chain.name,
			abi: SavingsVaultJUSDABI,
			address: [ADDR.savingsVaultV2, ADDR.savingsVaultV3].filter(isDeployed),
			startBlock: config.startMintingHubV2,
		},
		Roller: {
			// V2 + V3 (identical Roll event)
			chain: chain.name,
			abi: PositionRollerV2ABI,
			address: [ADDR.rollerV2, ADDR.rollerV3].filter(isDeployed),
			startBlock: config.startMintingHubV2,
		},
		FrontendGateway: {
			chain: chain.name,
			abi: FrontendGatewayV2ABI,
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
			].filter(isDeployed),
			startBlock: config.startStablecoin,
		},
	},
});
