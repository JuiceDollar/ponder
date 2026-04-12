import { ponder } from 'ponder:registry';
import { PositionV2ABI } from '@juicedollar/jusd';
import {
	frontendCodeRegistered,
	frontendCodeMapping,
	investRewardAdded,
	redeemRewardAdded,
	savingsRewardAdded,
	positionRewardAdded,
	frontendRewardsMapping,
	frontendRewardsVolumeMapping,
	frontendBonusHistoryMapping,
	rateChangesProposed,
	rateChangesExecuted,
} from '../ponder.schema';
import { getAddress } from 'viem';
import { getTxHash } from './utils/event';

ponder.on('FrontendGateway:FrontendCodeRegistered', async ({ event, context }) => {
	const { db } = context;
	const { owner, frontendCode } = event.args;

	await db.insert(frontendCodeRegistered).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		owner: getAddress(owner),
		frontendCode,
		txHash: getTxHash(event),
		created: event.block.timestamp,
	});

	await db
		.insert(frontendCodeMapping)
		.values({ id: getAddress(owner), frontendCodes: [frontendCode] })
		.onConflictDoUpdate((row) => ({ frontendCodes: [...row.frontendCodes, frontendCode] }));
});

ponder.on('FrontendGateway:FrontendCodeTransferred', async ({ event, context }) => {
	const { db } = context;
	const { from, to, frontendCode } = event.args;

	await db.insert(frontendCodeRegistered).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		created: event.block.timestamp,
		owner: getAddress(to),
		frontendCode,
		txHash: getTxHash(event),
	});

	await db
		.insert(frontendCodeMapping)
		.values({ id: getAddress(from), frontendCodes: [] })
		.onConflictDoUpdate((row) => ({ frontendCodes: row.frontendCodes.filter((code) => code !== frontendCode) }));

	await db
		.insert(frontendCodeMapping)
		.values({ id: getAddress(to), frontendCodes: [frontendCode] })
		.onConflictDoUpdate((row) => ({ frontendCodes: [...row.frontendCodes, frontendCode] }));
});

ponder.on('FrontendGateway:InvestRewardAdded', async ({ event, context }) => {
	const { db } = context;
	const { user, amount, reward, frontendCode } = event.args;

	await db.insert(investRewardAdded).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		user: getAddress(user),
		frontendCode,
		amount,
		reward,
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});

	await db
		.insert(frontendRewardsMapping)
		.values({
			id: frontendCode,
			totalReffered: 1,
			referred: [getAddress(user)],
			totalVolume: reward,
			loansVolume: 0n,
			investVolume: 0n,
			savingsVolume: 0n,
		})
		.onConflictDoUpdate((row) => {
			const referred = row.referred.includes(getAddress(user)) ? row.referred : [...row.referred, getAddress(user)];
			return {
				totalReffered: referred.length,
				referred,
				totalVolume: row.totalVolume + reward,
				investVolume: row.investVolume + reward,
			};
		});

	await db
		.insert(frontendRewardsVolumeMapping)
		.values({
			id: `${frontendCode}-${getAddress(user)}`,
			frontendCode,
			referred: getAddress(user),
			volume: reward,
			timestamp: event.block.timestamp,
		})
		.onConflictDoUpdate((row) => ({ volume: row.volume + reward, timestamp: event.block.timestamp }));

	await db.insert(frontendBonusHistoryMapping).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		frontendCode,
		payout: reward,
		source: 'InvestRewardAdded',
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});
});

ponder.on('FrontendGateway:RedeemRewardAdded', async ({ event, context }) => {
	const { db } = context;
	const { user, amount, reward, frontendCode } = event.args;

	await db.insert(redeemRewardAdded).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		user: getAddress(user),
		amount,
		reward,
		frontendCode,
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});

	await db
		.insert(frontendRewardsMapping)
		.values({
			id: frontendCode,
			totalReffered: 1,
			referred: [getAddress(user)],
			totalVolume: reward,
			loansVolume: 0n,
			investVolume: 0n,
			savingsVolume: 0n,
		})
		.onConflictDoUpdate((row) => {
			const referred = row.referred.includes(getAddress(user)) ? row.referred : [...row.referred, getAddress(user)];
			return {
				totalReffered: referred.length,
				referred,
				totalVolume: row.totalVolume + reward,
				investVolume: row.investVolume + reward,
			};
		});

	await db
		.insert(frontendRewardsVolumeMapping)
		.values({
			id: `${frontendCode}-${getAddress(user)}`,
			frontendCode,
			referred: getAddress(user),
			volume: reward,
			timestamp: event.block.timestamp,
		})
		.onConflictDoUpdate((row) => ({ volume: row.volume + reward, timestamp: event.block.timestamp }));

	await db.insert(frontendBonusHistoryMapping).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		frontendCode,
		payout: reward,
		source: 'RedeemRewardAdded',
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});
});

ponder.on('FrontendGateway:SavingsRewardAdded', async ({ event, context }) => {
	const { db } = context;
	const { saver, interest, reward, frontendCode } = event.args;

	await db.insert(savingsRewardAdded).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		user: getAddress(saver),
		interest,
		reward,
		frontendCode,
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});

	await db
		.insert(frontendRewardsMapping)
		.values({
			id: frontendCode,
			totalReffered: 1,
			referred: [getAddress(saver)],
			totalVolume: reward,
			loansVolume: 0n,
			investVolume: 0n,
			savingsVolume: 0n,
		})
		.onConflictDoUpdate((row) => {
			const referred = row.referred.includes(getAddress(saver)) ? row.referred : [...row.referred, getAddress(saver)];
			return {
				totalReffered: referred.length,
				referred,
				totalVolume: row.totalVolume + reward,
				savingsVolume: row.savingsVolume + reward,
			};
		});

	await db
		.insert(frontendRewardsVolumeMapping)
		.values({
			id: `${frontendCode}-${getAddress(saver)}`,
			frontendCode,
			referred: getAddress(saver),
			volume: reward,
			timestamp: event.block.timestamp,
		})
		.onConflictDoUpdate((row) => ({ volume: row.volume + reward, timestamp: event.block.timestamp }));

	await db.insert(frontendBonusHistoryMapping).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		frontendCode,
		payout: reward,
		source: 'SavingsRewardAdded',
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});
});

ponder.on('FrontendGateway:PositionRewardAdded', async ({ event, context }) => {
	const { db, client } = context;
	const { amount, reward, frontendCode, position } = event.args;

	const owner = await client.readContract({
		abi: PositionV2ABI,
		address: position,
		functionName: 'owner',
	});

	if (!owner) return;
	const ownerAddress = getAddress(owner);

	await db.insert(positionRewardAdded).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		user: ownerAddress,
		position: getAddress(position),
		amount,
		reward,
		frontendCode,
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});

	await db
		.insert(frontendRewardsMapping)
		.values({
			id: frontendCode,
			referred: [ownerAddress],
			totalReffered: 1,
			totalVolume: reward,
			loansVolume: 0n,
			investVolume: 0n,
			savingsVolume: 0n,
		})
		.onConflictDoUpdate((row) => {
			const referred = row.referred.includes(ownerAddress) ? row.referred : [...row.referred, ownerAddress];
			return {
				referred,
				totalReffered: referred.length,
				totalVolume: row.totalVolume + reward,
				loansVolume: row.loansVolume + reward,
			};
		});

	await db
		.insert(frontendRewardsVolumeMapping)
		.values({
			id: `${frontendCode}-${ownerAddress}`,
			frontendCode,
			referred: ownerAddress,
			volume: reward,
			timestamp: event.block.timestamp,
		})
		.onConflictDoUpdate((row) => ({ volume: row.volume + reward, timestamp: event.block.timestamp }));

	await db.insert(frontendBonusHistoryMapping).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		frontendCode,
		payout: reward,
		source: 'PositionRewardAdded',
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});
});

ponder.on('FrontendGateway:RateChangesProposed', async ({ event, context }) => {
	const { db } = context;

	await db.insert(rateChangesProposed).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		who: getAddress(event.args.who),
		nextFeeRate: event.args.nextFeeRate,
		nextSavingsFeeRate: event.args.nextSavingsFeeRate,
		nextMintingFeeRate: event.args.nextMintingFeeRate,
		nextChange: event.args.nextChange,
		blockheight: event.block.number,
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});
});

ponder.on('FrontendGateway:RateChangesExecuted', async ({ event, context }) => {
	const { db } = context;

	await db.insert(rateChangesExecuted).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		who: getAddress(event.args.who),
		nextFeeRate: event.args.nextFeeRate,
		nextSavingsFeeRate: event.args.nextSavingsFeeRate,
		nextMintingFeeRate: event.args.nextMintingFeeRate,
		blockheight: event.block.number,
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});
});
