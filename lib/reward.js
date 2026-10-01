/**
 * Block reward of Tidecoin mainnet (src/validation.cpp, GetBlockSubsidy): NOT a simple fixed-interval halving.
 * The subsidy QUARTERS (>>2, not >>1) at each step, and the interval between steps DOUBLES every time
 * (262800, then 525600, then 1051200, ...), starting from consensus.nSubsidyHalvingInterval = 262800. The
 * genesis block's 50 TDC is a one-off special case baked into CreateGenesisBlock and is unspendable by the
 * usual Bitcoin-Core convention -- the real ongoing base subsidy is 40 TDC. No dev/treasury tax exists.
 * Amounts in atomic units (1 TDC = 1e8). Fees on top come from the pool reading the exact reward of its own
 * blocks from its wallet, same as every other pool of this family.
 **/
const TDC_BASE = 100000000;
const BASE_SUBSIDY = 40 * TDC_BASE;
const HALVING_INTERVAL = 262800;

exports.minerReward = function (height) {
	if (!(height >= 0)) return 0;
	let halvings = 0;
	let high = 0;
	let interval = HALVING_INTERVAL;
	for (let i = 0; i <= 64; i++) {
		high += interval;
		if (height >= high) {
			halvings++;
		} else {
			break;
		}
		interval *= 2;
	}
	if (halvings * 2 >= 64) return 0;
	return Math.floor(BASE_SUBSIDY / Math.pow(4, halvings));
};
