// Mainnet Chain IDs
export const CHAIN_IDS = {
  BASE: 8453,
  ARBITRUM: 42161,
} as const;

// Mainnet token addresses per chain
export const TOKENS = {
  [CHAIN_IDS.BASE]: {
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    WETH: '0x4200000000000000000000000000000000000006',
  },
  [CHAIN_IDS.ARBITRUM]: {
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
} as const;

// Chain configurations for easy access
export const chainConfigs = {
  base: {
    id: CHAIN_IDS.BASE,
    name: 'Base',
    tokens: TOKENS[CHAIN_IDS.BASE],
  },
  arbitrum: {
    id: CHAIN_IDS.ARBITRUM,
    name: 'Arbitrum',
    tokens: TOKENS[CHAIN_IDS.ARBITRUM],
  },
} as const;

export type ChainId = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS];
