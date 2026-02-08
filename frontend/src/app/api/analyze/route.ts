import { NextRequest, NextResponse } from "next/server";

// Pool data (mirrors backend src/data/pools.ts)
interface PoolData {
  chain: string;
  chainId: number;
  protocol: string;
  pair: string;
  apy: number;
  tvl: number;
  riskScore: number;
  isUniswap: boolean;
}

const POOLS: PoolData[] = [
  {
    chain: "Base",
    chainId: 8453,
    protocol: "Uniswap V3",
    pair: "USDC/ETH",
    apy: 8.0,
    tvl: 45_000_000,
    riskScore: 2,
    isUniswap: true,
  },
  {
    chain: "Base",
    chainId: 8453,
    protocol: "Uniswap V3",
    pair: "USDC/DAI",
    apy: 6.0,
    tvl: 12_000_000,
    riskScore: 1,
    isUniswap: true,
  },
  {
    chain: "Arbitrum",
    chainId: 42161,
    protocol: "Uniswap V3",
    pair: "USDC/ETH",
    apy: 12.0,
    tvl: 89_000_000,
    riskScore: 2,
    isUniswap: true,
  },
  {
    chain: "Arbitrum",
    chainId: 42161,
    protocol: "Uniswap V3",
    pair: "USDC/DAI",
    apy: 9.0,
    tvl: 23_000_000,
    riskScore: 1,
    isUniswap: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const position = await request.json();
    const { chain, chainId, amount, token, currentAPY } = position;

    // Find best Uniswap pool
    const bestPool = POOLS.reduce((best, current) =>
      current.apy > best.apy ? current : best
    );

    const apyDifference = bestPool.apy - currentAPY;
    const extraYield = (amount * apyDifference) / 100;

    // Estimate migration cost (simplified — real version uses LI.FI SDK)
    const isCrossChain = chainId !== bestPool.chainId;
    const migrationCost = isCrossChain ? 2.5 : 0.5;

    // Calculate breakeven
    const extraDaily = extraYield / 365;
    const breakeven = extraDaily > 0 ? migrationCost / extraDaily : Infinity;

    // Decision
    const shouldMigrate =
      apyDifference > 0 && (breakeven <= 30 || (apyDifference >= 1 && breakeven <= 90));

    const action = shouldMigrate ? "MIGRATE" : "STAY";

    const reasoning = shouldMigrate
      ? `Migrate ${token} from ${chain} to ${bestPool.protocol} ${bestPool.pair} on ${bestPool.chain}. ` +
        `APY improves from ${currentAPY}% to ${bestPool.apy}% (+${apyDifference.toFixed(1)}%). ` +
        `Extra yearly earnings: $${extraYield.toFixed(2)}. Breakeven in ${breakeven.toFixed(1)} days.`
      : `Stay in current position. ${
          apyDifference <= 0
            ? "Already at the best available yield."
            : `Breakeven of ${breakeven.toFixed(1)} days is too long for ${apyDifference.toFixed(1)}% gain.`
        }`;

    return NextResponse.json({
      action,
      targetPool: {
        protocol: bestPool.protocol,
        pair: bestPool.pair,
        chain: bestPool.chain,
        apy: bestPool.apy,
      },
      currentAPY,
      bestAPY: bestPool.apy,
      extraYield,
      migrationCost,
      breakeven: breakeven === Infinity ? -1 : Math.round(breakeven * 10) / 10,
      reasoning,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to analyze position" },
      { status: 500 }
    );
  }
}
