import 'dotenv/config';
import { getChains, getQuote, chainConfigs, CHAIN_IDS, TOKENS } from './lifi/index.js';

console.log('HopYield CLI starting...');
console.log('Target chains:', Object.values(chainConfigs).map((c) => c.name).join(', '));

async function main() {
  console.log('\n--- Testing LiFi SDK ---\n');

  // Test 1: Get chains and verify Base & Arbitrum are supported
  const chains = await getChains();

  const baseChain = chains.find((c) => c.id === CHAIN_IDS.BASE);
  const arbitrumChain = chains.find((c) => c.id === CHAIN_IDS.ARBITRUM);

  console.log('\nChain verification:');
  console.log(`  Base (8453): ${baseChain ? '✓ supported' : '✗ not found'}`);
  console.log(`  Arbitrum (42161): ${arbitrumChain ? '✓ supported' : '✗ not found'}`);

  // Test 2: Get quote for 1 USDC from Base to Arbitrum
  console.log('\n--- Testing Quote ---\n');

  // Use a dummy address for quote (doesn't need to be real for quote)
  const testAddress = '0x0000000000000000000000000000000000000001';
  const oneUSDC = '1000000'; // 1 USDC = 1,000,000 (6 decimals)

  try {
    const quote = await getQuote({
      fromChainId: CHAIN_IDS.BASE,
      toChainId: CHAIN_IDS.ARBITRUM,
      fromToken: TOKENS[CHAIN_IDS.BASE].USDC,
      toToken: TOKENS[CHAIN_IDS.ARBITRUM].USDC,
      fromAmount: oneUSDC,
      fromAddress: testAddress,
    });

    console.log('Quote received:');
    console.log(`  From: ${quote.action.fromAmount} ${quote.action.fromToken.symbol} on ${quote.action.fromChainId}`);
    console.log(`  To: ${quote.estimate.toAmount} ${quote.action.toToken.symbol} on ${quote.action.toChainId}`);
    console.log(`  Tool: ${quote.toolDetails.name}`);
    console.log(`  Estimated gas: $${(Number(quote.estimate.gasCosts?.[0]?.amountUSD) || 0).toFixed(4)}`);
  } catch (error) {
    console.error('Quote error:', error instanceof Error ? error.message : error);
  }

  console.log('\nSDK test complete!');
}

main().catch(console.error);
