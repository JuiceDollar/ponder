import { onchainTable } from 'ponder';

export const mint = onchainTable('mint', (t) => ({
	id: t.text().primaryKey(),
	to: t.text().notNull(),
	value: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const burn = onchainTable('burn', (t) => ({
	id: t.text().primaryKey(),
	from: t.text().notNull(),
	value: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const mintBurnAddressMapper = onchainTable('mint_burn_address_mapper', (t) => ({
	id: t.text().primaryKey(),
	mint: t.bigint().notNull(),
	burn: t.bigint().notNull(),
}));

export const minter = onchainTable('minter', (t) => ({
	id: t.text().primaryKey(),
	txHash: t.text().notNull(),
	minter: t.text().notNull(),
	applicationPeriod: t.bigint().notNull(),
	applicationFee: t.bigint().notNull(),
	applyMessage: t.text().notNull(),
	applyDate: t.bigint().notNull(),
	suggestor: t.text().notNull(),
	denyMessage: t.text(),
	denyDate: t.bigint(),
	denyTxHash: t.text(),
	vetor: t.text(),
}));

export const votingPower = onchainTable('voting_power', (t) => ({
	id: t.text().primaryKey(),
	address: t.text().notNull(),
	votingPower: t.bigint().notNull(),
}));

export const poolShare = onchainTable('pool_share', (t) => ({
	id: t.text().primaryKey(),
	profits: t.bigint().notNull(),
	loss: t.bigint().notNull(),
	reserve: t.bigint().notNull(),
}));

export const delegation = onchainTable('delegation', (t) => ({
	id: t.text().primaryKey(),
	owner: t.text().notNull(),
	delegatedTo: t.text().notNull(),
}));

export const trade = onchainTable('trade', (t) => ({
	id: t.text().primaryKey(),
	trader: t.text().notNull(),
	amount: t.bigint().notNull(),
	shares: t.bigint().notNull(),
	price: t.bigint().notNull(),
	time: t.bigint().notNull(),
	txHash: t.text().notNull(),
	frontendCode: t.text(),
}));

export const tradeChart = onchainTable('trade_chart', (t) => ({
	id: t.text().primaryKey(),
	time: t.bigint().notNull(),
	lastPrice: t.bigint().notNull(),
}));

export const savingsRateProposed = onchainTable('savings_rate_proposed', (t) => ({
	id: t.text().primaryKey(),
	created: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	txHash: t.text().notNull(),
	proposer: t.text().notNull(),
	nextRate: t.integer().notNull(),
	nextChange: t.integer().notNull(),
}));

export const savingsRateChanged = onchainTable('savings_rate_changed', (t) => ({
	id: t.text().primaryKey(),
	created: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	txHash: t.text().notNull(),
	approvedRate: t.integer().notNull(),
}));

export const savingsSaved = onchainTable('savings_saved', (t) => ({
	id: t.text().primaryKey(),
	created: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	txHash: t.text().notNull(),
	account: t.text().notNull(),
	amount: t.bigint().notNull(),
	rate: t.integer().notNull(),
	total: t.bigint().notNull(),
	balance: t.bigint().notNull(),
	frontendCode: t.text(),
}));

export const savingsSavedMapping = onchainTable('savings_saved_mapping', (t) => ({
	id: t.text().primaryKey(),
	created: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	updated: t.bigint().notNull(),
	amount: t.bigint().notNull(),
}));

export const savingsInterest = onchainTable('savings_interest', (t) => ({
	id: t.text().primaryKey(),
	created: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	txHash: t.text().notNull(),
	account: t.text().notNull(),
	amount: t.bigint().notNull(),
	rate: t.integer().notNull(),
	total: t.bigint().notNull(),
	balance: t.bigint().notNull(),
}));

export const savingsInterestMapping = onchainTable('savings_interest_mapping', (t) => ({
	id: t.text().primaryKey(),
	created: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	updated: t.bigint().notNull(),
	amount: t.bigint().notNull(),
}));

export const savingsWithdrawn = onchainTable('savings_withdrawn', (t) => ({
	id: t.text().primaryKey(),
	created: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	txHash: t.text().notNull(),
	account: t.text().notNull(),
	amount: t.bigint().notNull(),
	rate: t.integer().notNull(),
	total: t.bigint().notNull(),
	balance: t.bigint().notNull(),
}));

export const savingsWithdrawnMapping = onchainTable('savings_withdrawn_mapping', (t) => ({
	id: t.text().primaryKey(),
	created: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	updated: t.bigint().notNull(),
	amount: t.bigint().notNull(),
}));

export const savingsUserLeaderboard = onchainTable('savings_user_leaderboard', (t) => ({
	id: t.text().primaryKey(),
	amountSaved: t.bigint().notNull(),
	interestReceived: t.bigint().notNull(),
}));

export const savingsStats = onchainTable('savings_stats', (t) => ({
	id: t.text().primaryKey(),
	totalUsers: t.integer().notNull(),
	lastUpdated: t.bigint().notNull(),
}));

export const savingsTotalHistory = onchainTable('savings_total_history', (t) => ({
	id: t.text().primaryKey(),
	time: t.bigint().notNull(),
	total: t.bigint().notNull(),
}));

export const rollerRolled = onchainTable('roller_rolled', (t) => ({
	id: t.text().primaryKey(),
	created: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	owner: t.text().notNull(),
	source: t.text().notNull(),
	collWithdraw: t.bigint().notNull(),
	repay: t.bigint().notNull(),
	target: t.text().notNull(),
	collDeposit: t.bigint().notNull(),
	mint: t.bigint().notNull(),
}));

export const positionV2 = onchainTable('position_v2', (t) => ({
	id: t.text().primaryKey(),
	txHash: t.text().notNull(),
	position: t.text().notNull(),
	owner: t.text().notNull(),
	stablecoinAddress: t.text().notNull(),
	collateral: t.text().notNull(),
	price: t.bigint().notNull(),
	created: t.bigint().notNull(),
	isOriginal: t.boolean().notNull(),
	isClone: t.boolean().notNull(),
	denied: t.boolean().notNull(),
	closed: t.boolean().notNull(),
	original: t.text().notNull(),
	isChallenged: t.boolean().notNull(),
	minimumCollateral: t.bigint().notNull(),
	riskPremiumPPM: t.integer().notNull(),
	reserveContribution: t.integer().notNull(),
	start: t.integer().notNull(),
	cooldown: t.bigint().notNull(),
	expiration: t.integer().notNull(),
	challengePeriod: t.integer().notNull(),
	stablecoinName: t.text().notNull(),
	stablecoinSymbol: t.text().notNull(),
	stablecoinDecimals: t.integer().notNull(),
	collateralName: t.text().notNull(),
	collateralSymbol: t.text().notNull(),
	collateralDecimals: t.integer().notNull(),
	collateralBalance: t.bigint().notNull(),
	limitForClones: t.bigint().notNull(),
	availableForClones: t.bigint().notNull(),
	availableForMinting: t.bigint().notNull(),
	fixedAnnualRatePPM: t.integer().notNull(),
	principal: t.bigint().notNull(),
	virtualPrice: t.bigint().notNull(),
	actualVirtualPrice: t.bigint().notNull(),
}));

export const mintingUpdateV2 = onchainTable('minting_update_v2', (t) => ({
	id: t.text().primaryKey(),
	txHash: t.text().notNull(),
	created: t.bigint().notNull(),
	position: t.text().notNull(),
	owner: t.text().notNull(),
	isClone: t.boolean().notNull(),
	collateral: t.text().notNull(),
	collateralName: t.text().notNull(),
	collateralSymbol: t.text().notNull(),
	collateralDecimals: t.integer().notNull(),
	size: t.bigint().notNull(),
	price: t.bigint().notNull(),
	minted: t.bigint().notNull(),
	sizeAdjusted: t.bigint().notNull(),
	priceAdjusted: t.bigint().notNull(),
	mintedAdjusted: t.bigint().notNull(),
	annualInterestPPM: t.integer().notNull(),
	basePremiumPPM: t.integer().notNull(),
	riskPremiumPPM: t.integer().notNull(),
	reserveContribution: t.integer().notNull(),
	feeTimeframe: t.integer().notNull(),
	feePPM: t.integer().notNull(),
	feePaid: t.bigint().notNull(),
}));

export const challengeV2 = onchainTable('challenge_v2', (t) => ({
	id: t.text().primaryKey(),
	txHash: t.text().notNull(),
	position: t.text().notNull(),
	number: t.bigint().notNull(),
	challenger: t.text().notNull(),
	start: t.integer().notNull(),
	created: t.bigint().notNull(),
	duration: t.integer().notNull(),
	size: t.bigint().notNull(),
	liqPrice: t.bigint().notNull(),
	bids: t.bigint().notNull(),
	filledSize: t.bigint().notNull(),
	acquiredCollateral: t.bigint().notNull(),
	status: t.text().notNull(),
}));

export const challengeBidV2 = onchainTable('challenge_bid_v2', (t) => ({
	id: t.text().primaryKey(),
	txHash: t.text().notNull(),
	position: t.text().notNull(),
	number: t.bigint().notNull(),
	numberBid: t.bigint().notNull(),
	bidder: t.text().notNull(),
	created: t.bigint().notNull(),
	bidType: t.text().notNull(),
	bid: t.bigint().notNull(),
	price: t.bigint().notNull(),
	filledSize: t.bigint().notNull(),
	acquiredCollateral: t.bigint().notNull(),
	challengeSize: t.bigint().notNull(),
}));

export const positionMint = onchainTable('position_mint', (t) => ({
	id: t.text().primaryKey(),
	positionAddress: t.text(),
	to: t.text().notNull(),
	value: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const frontendCodeRegistered = onchainTable('frontend_code_registered', (t) => ({
	id: t.text().primaryKey(),
	created: t.bigint().notNull(),
	owner: t.text().notNull(),
	frontendCode: t.text().notNull(),
	txHash: t.text().notNull(),
}));

export const frontendCodeMapping = onchainTable('frontend_code_mapping', (t) => ({
	id: t.text().primaryKey(),
	frontendCodes: t.text().array().notNull(),
}));

export const investRewardAdded = onchainTable('invest_reward_added', (t) => ({
	id: t.text().primaryKey(),
	frontendCode: t.text().notNull(),
	user: t.text().notNull(),
	amount: t.bigint().notNull(),
	reward: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const redeemRewardAdded = onchainTable('redeem_reward_added', (t) => ({
	id: t.text().primaryKey(),
	frontendCode: t.text().notNull(),
	user: t.text().notNull(),
	amount: t.bigint().notNull(),
	reward: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const savingsRewardAdded = onchainTable('savings_reward_added', (t) => ({
	id: t.text().primaryKey(),
	frontendCode: t.text().notNull(),
	user: t.text().notNull(),
	interest: t.bigint().notNull(),
	reward: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const positionRewardAdded = onchainTable('position_reward_added', (t) => ({
	id: t.text().primaryKey(),
	frontendCode: t.text().notNull(),
	user: t.text().notNull(),
	position: t.text().notNull(),
	amount: t.bigint().notNull(),
	reward: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const frontendRewardsMapping = onchainTable('frontend_rewards_mapping', (t) => ({
	id: t.text().primaryKey(),
	totalReffered: t.integer().notNull(),
	referred: t.text().array().notNull(),
	loansVolume: t.bigint().notNull(),
	investVolume: t.bigint().notNull(),
	savingsVolume: t.bigint().notNull(),
	totalVolume: t.bigint().notNull(),
}));

export const frontendRewardsVolumeMapping = onchainTable('frontend_rewards_volume_mapping', (t) => ({
	id: t.text().primaryKey(),
	frontendCode: t.text().notNull(),
	referred: t.text().notNull(),
	volume: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
}));

export const frontendBonusHistoryMapping = onchainTable('frontend_bonus_history_mapping', (t) => ({
	id: t.text().primaryKey(),
	frontendCode: t.text().notNull(),
	payout: t.bigint().notNull(),
	source: t.text().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const bridgeTx = onchainTable('bridge_tx', (t) => ({
	id: t.text().primaryKey(),
	stablecoinAddress: t.text().notNull(),
	swapper: t.text().notNull(),
	txHash: t.text().notNull(),
	amount: t.bigint().notNull(),
	isMint: t.boolean().notNull(),
	timestamp: t.bigint().notNull(),
}));

export const bridgeVolumeStat = onchainTable('bridge_volume_stat', (t) => ({
	id: t.text().primaryKey(),
	stablecoinAddress: t.text().notNull(),
	timestamp: t.bigint().notNull(),
	txCount: t.integer().notNull(),
	volume: t.bigint().notNull(),
	type: t.text().notNull(),
}));

export const emergencyStopped = onchainTable('emergency_stopped', (t) => ({
	id: t.text().primaryKey(),
	bridgeAddress: t.text().notNull(),
	caller: t.text().notNull(),
	message: t.text().notNull(),
	blockheight: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const forcedSale = onchainTable('forced_sale', (t) => ({
	id: t.text().primaryKey(),
	position: t.text().notNull(),
	amount: t.bigint().notNull(),
	priceE36MinusDecimals: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const positionDeniedByGovernance = onchainTable('position_denied_by_governance', (t) => ({
	id: t.text().primaryKey(),
	position: t.text().notNull(),
	denier: t.text().notNull(),
	message: t.text().notNull(),
	blockheight: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const rateChangesProposed = onchainTable('rate_changes_proposed', (t) => ({
	id: t.text().primaryKey(),
	who: t.text().notNull(),
	nextFeeRate: t.integer().notNull(),
	nextSavingsFeeRate: t.integer().notNull(),
	nextMintingFeeRate: t.integer().notNull(),
	nextChange: t.bigint().notNull(),
	blockheight: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const rateChangesExecuted = onchainTable('rate_changes_executed', (t) => ({
	id: t.text().primaryKey(),
	who: t.text().notNull(),
	nextFeeRate: t.integer().notNull(),
	nextSavingsFeeRate: t.integer().notNull(),
	nextMintingFeeRate: t.integer().notNull(),
	blockheight: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
}));

export const activeUser = onchainTable('active_user', (t) => ({
	id: t.text().primaryKey(),
	lastActiveTime: t.bigint().notNull(),
}));

export const ecosystem = onchainTable('ecosystem', (t) => ({
	id: t.text().primaryKey(),
	value: t.text().notNull(),
	amount: t.bigint().notNull(),
}));

export const stablecoinTransferHistory = onchainTable('stablecoin_transfer_history', (t) => ({
	id: t.text().primaryKey(),
	from: t.text().notNull(),
	to: t.text().notNull(),
	amount: t.bigint().notNull(),
	timestamp: t.bigint().notNull(),
	txHash: t.text().notNull(),
	blockheight: t.bigint().notNull(),
	transactionTo: t.text(),
}));
