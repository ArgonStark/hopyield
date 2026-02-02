import { createConfig, getChains as lifiGetChains, getQuote as lifiGetQuote } from '@lifi/sdk';
import { CHAIN_IDS, chainConfigs } from './config.js';

// Configure LiFi SDK for testnet
createConfig({
  integrator: 'hopyield',
});

export interface QuoteParams {
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  fromAddress: string;
}

/**
 * Get supported chains from LiFi and log for testing
 */
export async function getChains() {
  console.log('Fetching chains from LiFi SDK...');

  const chains = await lifiGetChains();

  // Check if our testnets are supported
  const targetIds = Object.values(CHAIN_IDS);
  const supportedTestnets = chains.filter((chain) => (targetIds as number[]).includes(chain.id));

  console.log(`Total chains: ${chains.length}`);
  console.log('Our testnet chains found:', supportedTestnets.map((c) => `${c.name} (${c.id})`));

  return chains;
}

/**
 * Get a quote for bridging tokens between chains
 */
export async function getQuote(params: QuoteParams) {
  const { fromChainId, toChainId, fromToken, toToken, fromAmount, fromAddress } = params;

  console.log(`Getting quote: ${fromChainId} -> ${toChainId}`);

  const quote = await lifiGetQuote({
    fromChain: fromChainId,
    toChain: toChainId,
    fromToken,
    toToken,
    fromAmount,
    fromAddress,
  });

  return quote;
}

export { CHAIN_IDS, chainConfigs };
