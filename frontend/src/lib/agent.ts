export interface Position {
  chain: string;
  chainId: number;
  amount: number;
  token: string;
  currentAPY: number;
}

export interface Recommendation {
  action: "MIGRATE" | "STAY";
  targetPool: {
    protocol: string;
    pair: string;
    chain: string;
    apy: number;
  };
  currentAPY: number;
  bestAPY: number;
  extraYield: number;
  migrationCost: number;
  breakeven: number;
  reasoning: string;
}

export async function getYieldRecommendation(
  position: Position
): Promise<Recommendation> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(position),
  });

  if (!res.ok) {
    throw new Error(`Analysis failed: ${res.statusText}`);
  }

  return res.json();
}
