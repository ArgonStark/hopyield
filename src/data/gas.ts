import { CHAIN_IDS } from '../lifi/index.js';

export interface GasEstimate {
  chainId: number;
  gasPrice: bigint; // in wei
  gasPriceGwei: number;
  estimatedTxCostUsd: number;
}

// Mock gas prices (in gwei)
const mockGasPrices: Record<number, number> = {
  [CHAIN_IDS.BASE]: 0.01, // Base has very low gas
  [CHAIN_IDS.ARBITRUM]: 0.1, // Arbitrum also cheap
};

// Mock ETH price for USD conversion
const ETH_PRICE_USD = 3000;

export function getGasPrice(chainId: number): GasEstimate {
  const gasPriceGwei = mockGasPrices[chainId] ?? 1;
  const gasPrice = BigInt(Math.floor(gasPriceGwei * 1e9));

  // Estimate for a typical swap/LP operation (~200k gas)
  const typicalGasUnits = 200_000;
  const txCostWei = gasPrice * BigInt(typicalGasUnits);
  const txCostEth = Number(txCostWei) / 1e18;
  const estimatedTxCostUsd = txCostEth * ETH_PRICE_USD;

  return {
    chainId,
    gasPrice,
    gasPriceGwei,
    estimatedTxCostUsd,
  };
}

export function getGasPriceForChains(chainIds: number[]): Map<number, GasEstimate> {
  const estimates = new Map<number, GasEstimate>();
  for (const chainId of chainIds) {
    estimates.set(chainId, getGasPrice(chainId));
  }
  return estimates;
}
