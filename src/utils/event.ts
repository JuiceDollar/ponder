/** Safely extract the transaction hash from a Ponder event.
 *  Falls back to event.log.transactionHash when event.transaction is
 *  unavailable (e.g. Citrea system transactions). */
export function getTxHash(event: { transaction: { hash: `0x${string}` } }): `0x${string}` {
	// Citrea system transactions may leave event.transaction undefined at runtime,
	// despite Ponder typing it as required. The EVM log always carries the hash.
	const e = event as { transaction?: { hash: `0x${string}` }; log: { transactionHash: `0x${string}` } };
	return e.transaction?.hash ?? e.log.transactionHash;
}
