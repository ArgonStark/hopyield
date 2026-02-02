import { getQuote, TOKENS, type ChainId } from '../lifi/index.js';
import { getPoolsData, type PoolData } from '../data/pools.js';
import { getGasPrice } from '../data/gas.js';

export interface Position {
  chain: string;
  chainId: number;
  amount: number;
  token: string;
  currentAPY: number;
}

export interface YieldComparison {
  currentPool: PoolData | null;
  bestPool: PoolData;
  apyDifference: number;
  extraYearlyEarnings: number;
}

export interface MigrationCost {
  bridgeFeeUsd: number;
  gasCostUsd: number;
  totalCostUsd: number;
  estimatedTime: number; // in seconds
}

export interface MigrationDecision {
  migrate: boolean;
  reason: string;
  breakeven: number; // days to breakeven
}

export function compareYields(position: Position, availablePools?: PoolData[]): YieldComparison {
  const pools = availablePools ?? getPoolsData();

  // Find current pool (if position matches one)
  const currentPool = pools.find(
    (p) => p.chainId === position.chainId && p.apy === position.currentAPY
  ) ?? null;

  // Find the best yield pool (can be on any chain)
  const bestPool = pools.reduce((best, current) =>
    current.apy > best.apy ? current : best
  );

  const apyDifference = bestPool.apy - position.currentAPY;
  const extraYearlyEarnings = (position.amount * apyDifference) / 100;

  return {
    currentPool,
    bestPool,
    apyDifference,
    extraYearlyEarnings,
  };
}

export async function estimateMigrationCost(
  fromChainId: number,
  toChainId: number,
  amount: number,
  token: string = 'USDC'
): Promise<MigrationCost> {
  // If same chain, no bridge needed
  if (fromChainId === toChainId) {
    const gasCost = getGasPrice(fromChainId);
    return {
      bridgeFeeUsd: 0,
      gasCostUsd: gasCost.estimatedTxCostUsd,
      totalCostUsd: gasCost.estimatedTxCostUsd,
      estimatedTime: 30, // Just a swap, very fast
    };
  }

  try {
    // Get token addresses
    const fromTokens = TOKENS[fromChainId as ChainId];
    const toTokens = TOKENS[toChainId as ChainId];

    if (!fromTokens || !toTokens) {
      throw new Error(`Unsupported chain: ${fromChainId} or ${toChainId}`);
    }

    const fromToken = fromTokens[token as keyof typeof fromTokens];
    const toToken = toTokens[token as keyof typeof toTokens];

    if (!fromToken || !toToken) {
      throw new Error(`Token ${token} not supported on chain`);
    }

    // Convert amount to token units (assuming 6 decimals for USDC)
    const decimals = token === 'USDC' ? 6 : 18;
    const fromAmount = (amount * 10 ** decimals).toString();

    const quote = await getQuote({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      fromAmount,
      fromAddress: '0x0000000000000000000000000000000000000001', // Dummy for quote
    });

    const gasCostUsd = Number(quote.estimate.gasCosts?.[0]?.amountUSD ?? 0);
    const feeCostUsd = Number(quote.estimate.feeCosts?.[0]?.amountUSD ?? 0);

    return {
      bridgeFeeUsd: feeCostUsd,
      gasCostUsd,
      totalCostUsd: gasCostUsd + feeCostUsd,
      estimatedTime: quote.estimate.executionDuration ?? 300,
    };
  } catch (error) {
    // Fallback to estimates if quote fails
    console.warn('Quote failed, using estimates:', error instanceof Error ? error.message : error);

    const sourceGas = getGasPrice(fromChainId);
    const destGas = getGasPrice(toChainId);

    return {
      bridgeFeeUsd: 0.5, // Typical bridge fee estimate
      gasCostUsd: sourceGas.estimatedTxCostUsd + destGas.estimatedTxCostUsd,
      totalCostUsd: 0.5 + sourceGas.estimatedTxCostUsd + destGas.estimatedTxCostUsd,
      estimatedTime: 300, // 5 minutes estimate
    };
  }
}

export function shouldMigrate(
  currentAPY: number,
  bestAPY: number,
  migrationCost: MigrationCost,
  positionSize: number
): MigrationDecision {
  const apyDifference = bestAPY - currentAPY;

  // If no improvement, don't migrate
  if (apyDifference <= 0) {
    return {
      migrate: false,
      reason: 'Current position already has the best or equal APY',
      breakeven: Infinity,
    };
  }

  // Calculate extra daily earnings
  const extraYearlyEarnings = (positionSize * apyDifference) / 100;
  const extraDailyEarnings = extraYearlyEarnings / 365;

  // Calculate breakeven in days
  const breakevenDays = migrationCost.totalCostUsd / extraDailyEarnings;

  // Decision logic:
  // - Migrate if breakeven is less than 30 days (reasonable payback period)
  // - Also consider if APY difference is significant (>1%)
  const reasonableBreakeven = 30;
  const significantApyDiff = 1;

  if (breakevenDays <= reasonableBreakeven) {
    return {
      migrate: true,
      reason: `Migration pays off in ${breakevenDays.toFixed(1)} days. Extra yearly earnings: $${extraYearlyEarnings.toFixed(2)}`,
      breakeven: breakevenDays,
    };
  }

  if (apyDifference >= significantApyDiff && breakevenDays <= 90) {
    return {
      migrate: true,
      reason: `Significant APY improvement of ${apyDifference.toFixed(1)}%. Breakeven in ${breakevenDays.toFixed(1)} days`,
      breakeven: breakevenDays,
    };
  }

  return {
    migrate: false,
    reason: `Breakeven period of ${breakevenDays.toFixed(1)} days is too long for ${apyDifference.toFixed(1)}% APY gain`,
    breakeven: breakevenDays,
  };
}
