import { ponder } from 'ponder:registry';
import { Address, decodeEventLog, getAddress, zeroAddress } from 'viem';
import { ADDR, MINTING_HUB_ADDRESSES } from '../ponder.config';
import { MintingHubV3ABI } from '@juicedollar/jusd';
import { TEMPORAL_FRAMES, getIdByTemporalFrame, getTimestampByTemporalFrame } from './utils/timestamps';
import {
	poolShare,
	activeUser,
	ecosystem,
	minter,
	mint,
	burn,
	mintBurnAddressMapper,
	stablecoinTransferHistory,
	positionV2,
	positionMint,
	bridgeTx,
	bridgeVolumeStat,
} from '../ponder.schema';

ponder.on('Stablecoin:Profit', async ({ event, context }) => {
	const { db } = context;

	await db
		.insert(ecosystem)
		.values({ id: 'Equity:ProfitCounter', value: '', amount: 1n })
		.onConflictDoUpdate((row) => ({ amount: row.amount + 1n }));

	await db
		.insert(poolShare)
		.values({ id: ADDR.juiceDollar, profits: event.args.amount, loss: 0n, reserve: 0n })
		.onConflictDoUpdate((row) => ({ profits: row.profits + event.args.amount }));

	await db
		.insert(activeUser)
		.values({ id: getAddress(event.transaction.from), lastActiveTime: event.block.timestamp })
		.onConflictDoUpdate(() => ({ lastActiveTime: event.block.timestamp }));
});

ponder.on('Stablecoin:Loss', async ({ event, context }) => {
	const { db } = context;

	await db
		.insert(ecosystem)
		.values({ id: 'Equity:LossCounter', value: '', amount: 1n })
		.onConflictDoUpdate((row) => ({ amount: row.amount + 1n }));

	await db
		.insert(poolShare)
		.values({ id: ADDR.juiceDollar, profits: 0n, loss: event.args.amount, reserve: 0n })
		.onConflictDoUpdate((row) => ({ loss: row.loss + event.args.amount }));

	await db
		.insert(activeUser)
		.values({ id: getAddress(event.transaction.from), lastActiveTime: event.block.timestamp })
		.onConflictDoUpdate(() => ({ lastActiveTime: event.block.timestamp }));
});

ponder.on('Stablecoin:MinterApplied', async ({ event, context }) => {
	const { db } = context;

	await db
		.insert(ecosystem)
		.values({ id: 'Stablecoin:MinterAppliedCounter', value: '', amount: 1n })
		.onConflictDoUpdate((row) => ({ amount: row.amount + 1n }));

	const minterAddr = getAddress(event.args.minter);
	const suggestorAddr = getAddress(event.transaction.from);
	await db
		.insert(minter)
		.values({
			id: minterAddr,
			txHash: event.transaction.hash,
			minter: minterAddr,
			applicationPeriod: event.args.applicationPeriod,
			applicationFee: event.args.applicationFee,
			applyMessage: event.args.message,
			applyDate: event.block.timestamp,
			suggestor: suggestorAddr,
			denyDate: null,
			denyMessage: null,
			denyTxHash: null,
			vetor: null,
		})
		.onConflictDoUpdate(() => ({
			txHash: event.transaction.hash,
			minter: minterAddr,
			applicationPeriod: event.args.applicationPeriod,
			applicationFee: event.args.applicationFee,
			applyMessage: event.args.message,
			applyDate: event.block.timestamp,
			suggestor: suggestorAddr,
			denyDate: null,
			denyMessage: null,
			denyTxHash: null,
			vetor: null,
		}));

	await db
		.insert(activeUser)
		.values({ id: getAddress(event.transaction.from), lastActiveTime: event.block.timestamp })
		.onConflictDoUpdate(() => ({ lastActiveTime: event.block.timestamp }));
});

ponder.on('Stablecoin:MinterDenied', async ({ event, context }) => {
	const { db } = context;

	await db
		.insert(ecosystem)
		.values({ id: 'Stablecoin:MinterDeniedCounter', value: '', amount: 1n })
		.onConflictDoUpdate((row) => ({ amount: row.amount + 1n }));

	await db.update(minter, { id: getAddress(event.args.minter) }).set({
		denyMessage: event.args.message,
		denyDate: event.block.timestamp,
		denyTxHash: event.transaction.hash,
		vetor: getAddress(event.transaction.from),
	});

	await db
		.insert(activeUser)
		.values({ id: getAddress(event.transaction.from), lastActiveTime: event.block.timestamp })
		.onConflictDoUpdate(() => ({ lastActiveTime: event.block.timestamp }));
});

ponder.on('Stablecoin:Transfer', async ({ event, context }) => {
	const { db } = context;

	await db.insert(stablecoinTransferHistory).values({
		id: `${event.transaction.hash}-${event.log.logIndex}`,
		from: getAddress(event.args.from),
		to: getAddress(event.args.to),
		amount: event.args.value,
		timestamp: event.block.timestamp,
		blockheight: event.block.number,
		txHash: event.transaction.hash,
		transactionTo: event.transaction.to ? getAddress(event.transaction.to) : null,
	});

	await db
		.insert(ecosystem)
		.values({ id: 'Stablecoin:TransferCounter', value: '', amount: 1n })
		.onConflictDoUpdate((row) => ({ amount: row.amount + 1n }));

	if (event.args.from === zeroAddress) {
		await db.insert(mint).values({
			id: `${event.transaction.hash}-${event.log.logIndex}`,
			to: getAddress(event.args.to),
			value: event.args.value,
			blockheight: event.block.number,
			timestamp: event.block.timestamp,
			txHash: event.transaction.hash,
		});

		await db
			.insert(ecosystem)
			.values({ id: 'Stablecoin:MintCounter', value: '', amount: 1n })
			.onConflictDoUpdate((row) => ({ amount: row.amount + 1n }));

		await db
			.insert(ecosystem)
			.values({ id: 'Stablecoin:Mint', value: '', amount: event.args.value })
			.onConflictDoUpdate((row) => ({ amount: row.amount + event.args.value }));

		await db
			.insert(mintBurnAddressMapper)
			.values({ id: event.args.to.toLowerCase(), mint: event.args.value, burn: 0n })
			.onConflictDoUpdate((row) => ({ mint: row.mint + event.args.value }));

		if (event.transaction.to) {
			await db
				.insert(activeUser)
				.values({ id: getAddress(event.transaction.to as Address), lastActiveTime: event.block.timestamp })
				.onConflictDoUpdate(() => ({ lastActiveTime: event.block.timestamp }));
		}

		if (MINTING_HUB_ADDRESSES.has(event.transaction.to?.toLowerCase() ?? '')) {
			const receipt = await context.client.request({
				method: 'eth_getTransactionReceipt',
				params: [event.transaction.hash],
			});

			const positionOpenedEvent = receipt?.logs
				.filter((log) => MINTING_HUB_ADDRESSES.has(log.address.toLowerCase()))
				.map(({ data, topics }) =>
					decodeEventLog({
						abi: MintingHubV3ABI,
						data: data as `0x${string}`,
						topics: topics as [`0x${string}`, ...`0x${string}`[]],
					})
				)
				.find((ev) => ev.eventName === 'PositionOpened');

			const positionOpenedAddress =
				positionOpenedEvent?.eventName === 'PositionOpened'
					? ((positionOpenedEvent.args as { position: `0x${string}` }).position.toLowerCase() as `0x${string}`)
					: undefined;

			await db
				.insert(positionMint)
				.values({
					id: event.transaction.hash.toLowerCase(),
					to: getAddress(event.args.to),
					positionAddress: positionOpenedAddress,
					value: event.args.value,
					timestamp: event.block.timestamp,
					blockheight: event.block.number,
					txHash: event.transaction.hash,
					mintingHubAddress: getAddress(event.transaction.to as `0x${string}`),
				})
				.onConflictDoUpdate((row) => ({
					to: event.args.to.toLowerCase() !== ADDR.equity.toLowerCase() ? event.args.to : row.to,
					value: row.value + event.args.value,
				}));
		}

		const openPosition = event.transaction.to ? await db.find(positionV2, { id: event.transaction.to.toLowerCase() }) : null;
		if (openPosition) {
			await db
				.insert(positionMint)
				.values({
					id: event.transaction.hash.toLowerCase(),
					to: getAddress(event.args.to),
					positionAddress: openPosition.id,
					value: event.args.value,
					timestamp: event.block.timestamp,
					blockheight: event.block.number,
					txHash: event.transaction.hash,
					mintingHubAddress: openPosition.mintingHubAddress,
				})
				.onConflictDoUpdate((row) => ({
					to: event.args.to.toLowerCase() !== ADDR.equity.toLowerCase() ? event.args.to : row.to,
					value: row.value + event.args.value,
				}));
		}
	}

	if (event.args.to === zeroAddress) {
		await db.insert(burn).values({
			id: `${event.transaction.hash}-${event.log.logIndex}`,
			from: getAddress(event.args.from),
			value: event.args.value,
			blockheight: event.block.number,
			timestamp: event.block.timestamp,
			txHash: event.transaction.hash,
		});

		await db
			.insert(ecosystem)
			.values({ id: 'Stablecoin:BurnCounter', value: '', amount: 1n })
			.onConflictDoUpdate((row) => ({ amount: row.amount + 1n }));

		await db
			.insert(ecosystem)
			.values({ id: 'Stablecoin:Burn', value: '', amount: event.args.value })
			.onConflictDoUpdate((row) => ({ amount: row.amount + event.args.value }));

		await db
			.insert(mintBurnAddressMapper)
			.values({ id: event.args.from.toLowerCase(), mint: 0n, burn: event.args.value })
			.onConflictDoUpdate((row) => ({ burn: row.burn + event.args.value }));

		await db
			.insert(activeUser)
			.values({ id: getAddress(event.transaction.from), lastActiveTime: event.block.timestamp })
			.onConflictDoUpdate(() => ({ lastActiveTime: event.block.timestamp }));
	}

	const stablecoinToBridge: Record<string, string> = {
		...(ADDR.startUSD && ADDR.bridgeStartUSD ? { [ADDR.startUSD.toLowerCase()]: ADDR.bridgeStartUSD.toLowerCase() } : {}),
		...(ADDR.USDC && ADDR.bridgeUSDC ? { [ADDR.USDC.toLowerCase()]: ADDR.bridgeUSDC.toLowerCase() } : {}),
		...(ADDR.USDT && ADDR.bridgeUSDT ? { [ADDR.USDT.toLowerCase()]: ADDR.bridgeUSDT.toLowerCase() } : {}),
		...(ADDR.CTUSD && ADDR.bridgeCTUSD ? { [ADDR.CTUSD.toLowerCase()]: ADDR.bridgeCTUSD.toLowerCase() } : {}),
	};

	const bridgeToStablecoin: Record<string, string> = Object.fromEntries(Object.entries(stablecoinToBridge).map(([k, v]) => [v, k]));

	const bridgeData = {
		swapper: getAddress(event.transaction.from),
		txHash: event.transaction.hash,
		amount: event.args.value,
		isMint: event.args.from === zeroAddress,
		timestamp: event.block.timestamp,
	};

	const stablecoinAddress = bridgeToStablecoin[event.transaction.to?.toLowerCase() ?? ''];
	if (stablecoinAddress) {
		await db.insert(bridgeTx).values({
			id: `${event.transaction.hash}-${event.log.logIndex}`,
			...bridgeData,
			stablecoinAddress,
		});

		for (const type of TEMPORAL_FRAMES) {
			const bucketTimestamp = getTimestampByTemporalFrame(type, bridgeData.timestamp);
			await db
				.insert(bridgeVolumeStat)
				.values({
					id: getIdByTemporalFrame(stablecoinAddress, type, bridgeData.timestamp),
					stablecoinAddress,
					timestamp: bucketTimestamp,
					txCount: 1,
					volume: bridgeData.amount,
					type,
				})
				.onConflictDoUpdate((row) => ({
					txCount: row.txCount + 1,
					volume: row.volume + bridgeData.amount,
				}));
		}
	}

	const ecosystemContract = Object.values(ADDR).map((address) => address.toLowerCase());
	const externalInteraction = event.transaction.to && !ecosystemContract.includes(event.transaction.to.toLowerCase());
	const isMintingOrBurning = event.args.from === zeroAddress || event.args.to === zeroAddress;
	const isKnownPosition = event.transaction.to ? await db.find(positionV2, { id: event.transaction.to.toLowerCase() }) : false;

	if (externalInteraction && isMintingOrBurning && !isKnownPosition) {
		const receipt = await context.client.request({
			method: 'eth_getTransactionReceipt',
			params: [event.transaction.hash],
		});

		const logIndex = event.log.logIndex;
		const protocolTokenLogIndex = receipt?.logs.findIndex((log) => Number(log.logIndex) === logIndex) ?? -1;
		const previousLog = protocolTokenLogIndex > 0 ? receipt?.logs[protocolTokenLogIndex - 1] : undefined;
		const nextLog = protocolTokenLogIndex >= 0 ? receipt?.logs[protocolTokenLogIndex + 1] : undefined;
		const potentialBridgeLog = bridgeData.isMint ? previousLog : nextLog;
		const externalStablecoinAddress =
			potentialBridgeLog && stablecoinToBridge[potentialBridgeLog.address.toLowerCase()]
				? potentialBridgeLog.address.toLowerCase()
				: undefined;

		if (externalStablecoinAddress) {
			await db.insert(bridgeTx).values({
				id: `${event.transaction.hash}-${event.log.logIndex}`,
				...bridgeData,
				stablecoinAddress: externalStablecoinAddress,
			});

			for (const type of TEMPORAL_FRAMES) {
				const bucketTimestamp = getTimestampByTemporalFrame(type, bridgeData.timestamp);
				await db
					.insert(bridgeVolumeStat)
					.values({
						id: getIdByTemporalFrame(externalStablecoinAddress, type, bridgeData.timestamp),
						stablecoinAddress: externalStablecoinAddress,
						timestamp: bucketTimestamp,
						txCount: 1,
						volume: bridgeData.amount,
						type,
					})
					.onConflictDoUpdate((row) => ({
						txCount: row.txCount + 1,
						volume: row.volume + bridgeData.amount,
					}));
			}
		}
	}
});
