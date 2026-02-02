import {
  compareYields,
  estimateMigrationCost,
  shouldMigrate,
  type Position,
  type MigrationCost,
  type MigrationDecision,
} from './tools.js';
import { type PoolData } from '../data/pools.js';

export interface AnalysisResult {
  action: 'MIGRATE' | 'STAY';
  reasoning: string;
  details: {
    currentAPY: number;
    bestAPY: number;
    bestPool: PoolData;
    extraYearlyEarnings: number;
    migrationCost: MigrationCost;
    breakeven: number;
    decision: MigrationDecision;
  };
}

export class YieldAgent {
  async analyze(position: Position): Promise<AnalysisResult> {
    // Step 1: Compare yields
    const yieldComparison = compareYields(position);

    // Step 2: Estimate migration cost
    const migrationCost = await estimateMigrationCost(
      position.chainId,
      yieldComparison.bestPool.chainId,
      position.amount,
      position.token
    );

    // Step 3: Make decision
    const decision = shouldMigrate(
      position.currentAPY,
      yieldComparison.bestPool.apy,
      migrationCost,
      position.amount
    );

    // Build result
    const action = decision.migrate ? 'MIGRATE' : 'STAY';
    const reasoning = this.buildReasoning(position, yieldComparison, migrationCost, decision);

    return {
      action,
      reasoning,
      details: {
        currentAPY: position.currentAPY,
        bestAPY: yieldComparison.bestPool.apy,
        bestPool: yieldComparison.bestPool,
        extraYearlyEarnings: yieldComparison.extraYearlyEarnings,
        migrationCost,
        breakeven: decision.breakeven,
        decision,
      },
    };
  }

  private buildReasoning(
    position: Position,
    yieldComparison: ReturnType<typeof compareYields>,
    migrationCost: MigrationCost,
    decision: MigrationDecision
  ): string {
    const { bestPool, apyDifference, extraYearlyEarnings } = yieldComparison;

    const lines: string[] = [];

    // Current position summary
    lines.push(`Current Position: $${position.amount.toLocaleString()} ${position.token} on ${position.chain} @ ${position.currentAPY}% APY`);
    lines.push('');

    // Best opportunity
    if (apyDifference > 0) {
      lines.push(`Best Opportunity Found: ${bestPool.protocol} ${bestPool.pair} on ${bestPool.chain}`);
      lines.push(`  APY: ${bestPool.apy}% (+${apyDifference.toFixed(1)}%)`);
      lines.push(`  TVL: $${(bestPool.tvl / 1_000_000).toFixed(1)}M`);
      lines.push(`  Risk Score: ${bestPool.riskScore}/10`);
      lines.push('');
    } else {
      lines.push('You already have the best available yield.');
      lines.push('');
    }

    // Migration cost breakdown
    if (position.chainId !== bestPool.chainId) {
      lines.push('Migration Cost Breakdown:');
      lines.push(`  Bridge Fee: $${migrationCost.bridgeFeeUsd.toFixed(2)}`);
      lines.push(`  Gas Cost: $${migrationCost.gasCostUsd.toFixed(2)}`);
      lines.push(`  Total: $${migrationCost.totalCostUsd.toFixed(2)}`);
      lines.push(`  Estimated Time: ${this.formatDuration(migrationCost.estimatedTime)}`);
      lines.push('');
    }

    // Financial analysis
    if (apyDifference > 0) {
      lines.push('Financial Analysis:');
      lines.push(`  Extra Yearly Earnings: $${extraYearlyEarnings.toFixed(2)}`);
      lines.push(`  Breakeven Period: ${decision.breakeven === Infinity ? 'N/A' : decision.breakeven.toFixed(1) + ' days'}`);
      lines.push('');
    }

    // Decision
    lines.push(`Decision: ${decision.reason}`);

    return lines.join('\n');
  }

  private formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    return `${(seconds / 3600).toFixed(1)} hours`;
  }
}

export function formatRecommendation(result: AnalysisResult): string {
  const banner = result.action === 'MIGRATE'
    ? '🚀 RECOMMENDATION: MIGRATE'
    : '✋ RECOMMENDATION: STAY';

  const separator = '═'.repeat(50);

  return `
${separator}
${banner}
${separator}

${result.reasoning}

${separator}
`;
}
