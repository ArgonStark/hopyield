import 'dotenv/config';
import { YieldAgent, formatRecommendation, type Position } from './agent/index.js';
import { CHAIN_IDS } from './lifi/index.js';

console.log('HopYield - AI Yield Optimization Agent');
console.log('=====================================\n');

async function main() {
  // Create mock position: user has $1000 USDC on Base earning 8% APY
  const position: Position = {
    chain: 'base',
    chainId: CHAIN_IDS.BASE,
    amount: 1000,
    token: 'USDC',
    currentAPY: 8,
  };

  console.log('Analyzing your position...\n');
  console.log(`Position: $${position.amount} ${position.token} on ${position.chain}`);
  console.log(`Current APY: ${position.currentAPY}%\n`);

  // Initialize agent and run analysis
  const agent = new YieldAgent();

  try {
    const result = await agent.analyze(position);

    // Display formatted recommendation
    console.log(formatRecommendation(result));

    // Show detailed numbers
    console.log('Summary:');
    console.log(`  Current APY: ${result.details.currentAPY}%`);
    console.log(`  Best APY: ${result.details.bestAPY}%`);
    console.log(`  APY Gain: +${(result.details.bestAPY - result.details.currentAPY).toFixed(1)}%`);
    console.log(`  Extra Yearly Earnings: $${result.details.extraYearlyEarnings.toFixed(2)}`);
    console.log(`  Migration Cost: $${result.details.migrationCost.totalCostUsd.toFixed(2)}`);
    console.log(`  Breakeven: ${result.details.breakeven === Infinity ? 'N/A' : result.details.breakeven.toFixed(1) + ' days'}`);
  } catch (error) {
    console.error('Analysis failed:', error instanceof Error ? error.message : error);
  }
}

main().catch(console.error);
