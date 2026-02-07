import { CHAIN_IDS } from '../lifi/index.js';

export interface PoolData {
  chain: string;
  chainId: number;
  protocol: string;
  pair: string;
  apy: number;
  tvl: number;
  riskScore: number; // 1-10, lower is safer
  isUniswap: boolean;
}

const mockPools: PoolData[] = [
  // Uniswap V3 pools
  {
    chain: 'base',
    chainId: CHAIN_IDS.BASE,
    protocol: 'Uniswap V3',
    pair: 'USDC/ETH',
    apy: 8,
    tvl: 5_000_000,
    riskScore: 3,
    isUniswap: true,
  },
  {
    chain: 'arbitrum',
    chainId: CHAIN_IDS.ARBITRUM,
    protocol: 'Uniswap V3',
    pair: 'USDC/ETH',
    apy: 12,
    tvl: 3_000_000,
    riskScore: 4,
    isUniswap: true,
  },
  {
    chain: 'base',
    chainId: CHAIN_IDS.BASE,
    protocol: 'Uniswap V3',
    pair: 'USDC/DAI',
    apy: 6,
    tvl: 8_000_000,
    riskScore: 2,
    isUniswap: true,
  },
  {
    chain: 'arbitrum',
    chainId: CHAIN_IDS.ARBITRUM,
    protocol: 'Uniswap V3',
    pair: 'USDC/DAI',
    apy: 9,
    tvl: 6_000_000,
    riskScore: 3,
    isUniswap: true,
  },
];

export function getPoolsData(): PoolData[] {
  return mockPools;
}

export function getPoolsByChain(chainId: number): PoolData[] {
  return mockPools.filter((pool) => pool.chainId === chainId);
}

export function getUniswapPools(): PoolData[] {
  return mockPools.filter((pool) => pool.isUniswap);
}

export function getBestPool(excludeChainId?: number): PoolData | null {
  const pools = excludeChainId
    ? mockPools.filter((p) => p.chainId !== excludeChainId)
    : mockPools;

  if (pools.length === 0) return null;

  return pools.reduce((best, current) => (current.apy > best.apy ? current : best));
}

export function getBestUniswapPool(excludeChainId?: number): PoolData | null {
  let pools = mockPools.filter((p) => p.isUniswap);

  if (excludeChainId) {
    pools = pools.filter((p) => p.chainId !== excludeChainId);
  }

  if (pools.length === 0) return null;

  return pools.reduce((best, current) => (current.apy > best.apy ? current : best));
}
