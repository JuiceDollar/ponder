export const TEMPORAL_FRAMES = ["1h", "24h", "all-time"] as const;

export const getTimestamp1hRoundedDown = (timestamp: bigint): bigint => {
	const date = new Date(Number(timestamp) * 1000);
	const rounded = new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), 0, 0, 0)
	);
	return BigInt(rounded.getTime() / 1000);
};

export const getTimestamp24hRoundedDown = (timestamp: bigint): bigint => {
	const date = new Date(Number(timestamp) * 1000);
	const rounded = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
	return BigInt(rounded.getTime() / 1000);
};

export const getTimestampByTemporalFrame = (type: string, timestamp: bigint): bigint => {
	switch (type) {
		case "1h":
			return getTimestamp1hRoundedDown(timestamp);
		case "24h":
			return getTimestamp24hRoundedDown(timestamp);
		case "all-time":
		default:
			return 0n;
	}
};

export const getIdByTemporalFrame = (tokenIdentifier: string, type: string, timestamp: bigint): string => {
	switch (type) {
		case "1h":
			return `${tokenIdentifier}-1h-${getTimestamp1hRoundedDown(timestamp)}`;
		case "24h":
			return `${tokenIdentifier}-24h-${getTimestamp24hRoundedDown(timestamp)}`;
		case "all-time":
		default:
			return tokenIdentifier;
	}
};
