import { CHAIN_IDS } from '../lifi/index.js';

export interface PoolData {
  chain: string;
  chainId: number;
  protocol: string;
  pair: string;
  apy: number;
  tvl: number;
  riskScore: number; // 1-10, lower is safer
}

const mockPools: PoolData[] = [
  {
    chain: 'base',
    chainId: CHAIN_IDS.BASE,
    protocol: 'Uniswap V3',
    pair: 'USDC/ETH',
    apy: 8,
    tvl: 5_000_000,
    riskScore: 3,
  },
  {
    chain: 'arbitrum',
    chainId: CHAIN_IDS.ARBITRUM,
    protocol: 'Uniswap V3',
    pair: 'USDC/ETH',
    apy: 12,
    tvl: 3_000_000,
    riskScore: 4,
  },
  {
    chain: 'base',
    chainId: CHAIN_IDS.BASE,
    protocol: 'Aerodrome',
    pair: 'USDC/DAI',
    apy: 5,
    tvl: 10_000_000,
    riskScore: 2,
  },
  {
    chain: 'arbitrum',
    chainId: CHAIN_IDS.ARBITRUM,
    protocol: 'Camelot',
    pair: 'USDC/DAI',
    apy: 7,
    tvl: 8_000_000,
    riskScore: 3,
  },
];

export function getPoolsData(): PoolData[] {
  return mockPools;
}

export function getPoolsByChain(chainId: number): PoolData[] {
  return mockPools.filter((pool) => pool.chainId === chainId);
}

export function getBestPool(excludeChainId?: number): PoolData | null {
  const pools = excludeChainId
    ? mockPools.filter((p) => p.chainId !== excludeChainId)
    : mockPools;

  if (pools.length === 0) return null;

  return pools.reduce((best, current) => (current.apy > best.apy ? current : best));
}
