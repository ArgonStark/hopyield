"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getYieldRecommendation, type Recommendation } from "../lib/agent";

const MOCK_POSITION = {
  chain: "Base",
  chainId: 8453,
  amount: 1000,
  token: "USDC",
  currentAPY: 8,
};

export default function Home() {
  const { isConnected } = useAccount();
  const [autoMigrate, setAutoMigrate] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setRecommendation(null);
      return;
    }

    setLoading(true);
    getYieldRecommendation(MOCK_POSITION)
      .then(setRecommendation)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isConnected]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 gap-8">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🦄 UniYield</h1>
          <p className="text-xs text-gray-500 mt-1">
            AI-Powered Uniswap V4 Yield Optimizer
          </p>
        </div>
        <ConnectButton />
      </div>

      {!isConnected ? (
        <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900/50 p-12 shadow-lg text-center">
          <p className="text-gray-400 text-lg">
            Connect your wallet to get started
          </p>
        </div>
      ) : (
        <>
          {/* Position Card */}
          <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-lg">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
              🦄 Your Uniswap Position
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Pool</span>
                <span className="font-medium">USDC/ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Chain</span>
                <span className="font-medium">Base</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="font-medium">$1,000 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current APY</span>
                <span className="font-medium text-green-400">
                  {recommendation ? `${recommendation.currentAPY}%` : "8%"}
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                disabled
                className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500"
              >
                Deposit
              </button>
              <button
                disabled
                className="flex-1 rounded-lg border border-gray-600 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
              >
                Withdraw
              </button>
            </div>
          </div>

          {/* AI Recommendation Card */}
          <div className="w-full max-w-lg rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-6 shadow-lg">
            <h2 className="text-sm font-medium text-indigo-400 uppercase tracking-wide mb-4">
              🧠 AI Recommendation
            </h2>
            {loading ? (
              <div className="flex items-center gap-3 py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
                <span className="text-gray-400">Analyzing yields...</span>
              </div>
            ) : recommendation ? (
              <>
                <p className="text-lg font-semibold mb-4">
                  {recommendation.action === "MIGRATE"
                    ? `Migrate to ${recommendation.targetPool.protocol} ${recommendation.targetPool.pair} on ${recommendation.targetPool.chain} for ${recommendation.bestAPY}% APY`
                    : "Stay in current position"}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Extra yield</span>
                    <span className="font-medium text-green-400">
                      +${recommendation.extraYield.toFixed(0)}/year
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Migration cost</span>
                    <span className="font-medium">
                      ~${recommendation.migrationCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Breakeven</span>
                    <span className="font-medium">
                      {recommendation.breakeven > 0
                        ? `${recommendation.breakeven} days`
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  {recommendation.reasoning}
                </p>
              </>
            ) : (
              <p className="text-gray-400">No data yet</p>
            )}
          </div>

          {/* Action Button */}
          <button
            disabled
            className="w-full max-w-lg rounded-xl bg-indigo-600 py-4 text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500"
          >
            🚀 Migrate Now
            <span className="block text-xs font-normal text-indigo-300 mt-1">
              Cross-chain via LI.FI
            </span>
          </button>

          {/* Auto-Migration Card */}
          <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                ⚙️ Auto-Migration
              </h2>
              <button
                onClick={() => setAutoMigrate(!autoMigrate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoMigrate ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    autoMigrate ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-sm mb-2">
              Auto migrate when APY difference &gt; 3%
            </p>
            <p className="text-xs text-gray-500">
              AI will automatically move your funds to higher yield pools
            </p>
          </div>

          {/* V4 Hook Status Card */}
          <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-lg">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
              🦄 V4 Hook Status
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Tracks your Uniswap V4 LP positions on-chain
            </p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Contract</span>
                <a
                  href="https://sepolia.basescan.org/address/0x3C0d10f5126ff4a547fd60B0B3d532c04C1D4900"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  0x3C0d...4900
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network</span>
                <span className="font-medium">Base Sepolia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="flex items-center gap-2 font-medium text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="w-full max-w-lg text-center pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">
          Powered by LI.FI &middot; Uniswap V4
        </p>
      </div>
    </div>
  );
}
