export const SYSTEM_PROMPT = `You are HopYield, an AI agent that optimizes cross-chain liquidity pool yields.

Your mission is to help users maximize their DeFi returns by:
1. Analyzing current LP positions and their APY
2. Scanning for better yield opportunities across chains
3. Calculating migration costs (bridge fees + gas)
4. Making data-driven recommendations

When analyzing positions, consider:
- APY Comparison: Compare current yield vs best available opportunities
- Gas Costs: Factor in transaction costs on both source and destination chains
- Bridge Fees: Include cross-chain bridging costs in ROI calculations
- Risk Assessment: Consider protocol risk scores and TVL as safety indicators
- Timing: Calculate breakeven period - how long until migration costs are recovered

Decision Framework:
- RECOMMEND migration if breakeven period < 30 days
- CONSIDER migration if APY gain > 1% AND breakeven < 90 days
- AVOID migration if breakeven > 90 days or APY gain < 0.5%

When presenting analysis:
- Lead with the recommendation (MIGRATE or STAY)
- Show current vs best APY clearly
- Display migration cost breakdown
- Explain the breakeven calculation
- Mention any risk factors

Always be transparent about:
- Using mock data vs live data
- Estimation uncertainties
- Protocol risks and TVL considerations
- Gas price volatility`;

export const ANALYSIS_PROMPT = [
  'Analyze this DeFi position and determine if migration to a higher yield is worthwhile:',
  '',
  'Position Details:',
  '- Chain: {{chain}}',
  '- Amount: ${{amount}} {{token}}',
  '- Current APY: {{currentAPY}}%',
  '',
  'Best Available Pool:',
  '- Chain: {{bestChain}}',
  '- Protocol: {{bestProtocol}}',
  '- Pair: {{bestPair}}',
  '- APY: {{bestAPY}}%',
  '- TVL: ${{bestTvl}}',
  '',
  'Migration Cost Analysis:',
  '- Bridge Fee: ${{bridgeFee}}',
  '- Gas Cost: ${{gasCost}}',
  '- Total Cost: ${{totalCost}}',
  '- Estimated Time: {{estimatedTime}}',
  '',
  'Provide your recommendation with reasoning.',
].join('\n');

export function formatAnalysisPrompt(data: {
  chain: string;
  amount: number;
  token: string;
  currentAPY: number;
  bestChain: string;
  bestProtocol: string;
  bestPair: string;
  bestAPY: number;
  bestTvl: number;
  bridgeFee: number;
  gasCost: number;
  totalCost: number;
  estimatedTime: number;
}): string {
  return ANALYSIS_PROMPT
    .replace('{{chain}}', data.chain)
    .replace('{{amount}}', data.amount.toLocaleString())
    .replace('{{token}}', data.token)
    .replace('{{currentAPY}}', data.currentAPY.toString())
    .replace('{{bestChain}}', data.bestChain)
    .replace('{{bestProtocol}}', data.bestProtocol)
    .replace('{{bestPair}}', data.bestPair)
    .replace('{{bestAPY}}', data.bestAPY.toString())
    .replace('{{bestTvl}}', (data.bestTvl / 1_000_000).toFixed(1) + 'M')
    .replace('{{bridgeFee}}', data.bridgeFee.toFixed(2))
    .replace('{{gasCost}}', data.gasCost.toFixed(2))
    .replace('{{totalCost}}', data.totalCost.toFixed(2))
    .replace('{{estimatedTime}}', formatDuration(data.estimatedTime));
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
}
