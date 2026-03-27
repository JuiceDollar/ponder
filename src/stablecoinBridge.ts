import { ponder } from 'ponder:registry';
import { getAddress } from 'viem';
import { emergencyStopped } from '../ponder.schema';

ponder.on('StablecoinBridge:EmergencyStopped', async ({ event, context }) => {
	const { db } = context;

	await db.insert(emergencyStopped).values({
		id: `${event.transaction.hash}-${event.log.logIndex}`,
		bridgeAddress: getAddress(event.log.address),
		caller: getAddress(event.args.caller),
		message: event.args.message,
		blockheight: event.block.number,
		timestamp: event.block.timestamp,
		txHash: event.transaction.hash,
	});
});
