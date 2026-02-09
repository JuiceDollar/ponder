import { ponder } from '@/generated';

ponder.on('StablecoinBridge:EmergencyStopped', async ({ event, context }) => {
	const { EmergencyStopped } = context.db;

	await EmergencyStopped.create({
		id: `${event.transaction.hash}-${event.log.logIndex}`,
		data: {
			bridgeAddress: event.log.address,
			caller: event.args.caller,
			message: event.args.message,
			blockheight: event.block.number,
			timestamp: event.block.timestamp,
			txHash: event.transaction.hash,
		},
	});
});
