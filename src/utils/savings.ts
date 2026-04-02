import { SavingsGatewayV2ABI, SavingsV3ABI } from '@juicedollar/jusd';
import { ADDR } from '../../ponder.config';
import { zeroAddress } from 'viem';
import { ponder } from 'ponder:registry';

type Client = Parameters<Parameters<typeof ponder.on>[1]>[0]['context']['client'];

/** Read the combined amountSaved for an account across V2 and V3 Savings contracts. */
export async function readCombinedAmountSaved(client: Client, account: `0x${string}`): Promise<bigint> {
	const [v2Result, v3Result] = await Promise.all([
		client.readContract({
			abi: SavingsGatewayV2ABI,
			address: ADDR.savingsGateway,
			functionName: 'savings',
			args: [account],
		}),
		ADDR.savings && ADDR.savings !== zeroAddress
			? client.readContract({
					abi: SavingsV3ABI,
					address: ADDR.savings,
					functionName: 'savings',
					args: [account],
				})
			: Promise.resolve([0n] as const),
	]);
	return v2Result[0] + v3Result[0];
}
