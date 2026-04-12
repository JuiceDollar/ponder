import { http } from 'viem';

export function citreaTransport(url: string): any {
	const baseTransport = http(url);

	return (config: any) => {
		const transport = baseTransport(config);
		const originalRequest = transport.request;

		return {
			...transport,
			request: async (args: any) => {
				const response = await originalRequest(args);

				if (args.method === 'eth_getLogs' && Array.isArray(response)) {
					const blockCache = new Map<string, any>();

					for (const log of response) {
						if (!log?.blockNumber || !log?.transactionHash) continue;

						let block = blockCache.get(log.blockNumber);
						if (!block) {
							try {
								block = await originalRequest({
									method: 'eth_getBlockByNumber',
									params: [log.blockNumber, true],
								});
								if (block) {
									blockCache.set(log.blockNumber, block);
								}
							} catch {
								continue;
							}
						}

						const txs = block?.transactions ?? [];
						const idx = txs.findIndex((tx: any) => tx?.hash === log.transactionHash);
						if (idx >= 0) {
							log.transactionIndex = `0x${idx.toString(16)}`;
						}
					}
				}

				return response;
			},
		};
	};
}
