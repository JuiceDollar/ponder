import { ponder } from 'ponder:registry';
import { getAddress } from 'viem';
import { getTxHash } from './utils/event';
import { savingsVaultDeposit, savingsVaultWithdraw, savingsVaultInterestClaimed } from '../ponder.schema';

ponder.on('SavingsVaultJUSD:Deposit', async ({ event, context }) => {
	const { db } = context;

	await db.insert(savingsVaultDeposit).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		sender: getAddress(event.args.sender),
		owner: getAddress(event.args.owner),
		assets: event.args.assets,
		shares: event.args.shares,
		blockheight: event.block.number,
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});
});

ponder.on('SavingsVaultJUSD:Withdraw', async ({ event, context }) => {
	const { db } = context;

	await db.insert(savingsVaultWithdraw).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		sender: getAddress(event.args.sender),
		receiver: getAddress(event.args.receiver),
		owner: getAddress(event.args.owner),
		assets: event.args.assets,
		shares: event.args.shares,
		blockheight: event.block.number,
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});
});

ponder.on('SavingsVaultJUSD:InterestClaimed', async ({ event, context }) => {
	const { db } = context;

	await db.insert(savingsVaultInterestClaimed).values({
		id: `${getTxHash(event)}-${event.log.logIndex}`,
		interest: event.args.interest,
		totalClaimed: event.args.totalClaimed,
		blockheight: event.block.number,
		timestamp: event.block.timestamp,
		txHash: getTxHash(event),
	});
});
