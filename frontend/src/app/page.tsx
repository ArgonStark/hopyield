"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const [autoMigrate, setAutoMigrate] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 gap-8">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🦘 HopYield</h1>
          <p className="text-xs text-gray-500 mt-1">AI-Powered Uniswap V4 Yield Optimizer</p>
        </div>
        <ConnectButton />
      </div>

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
            <span className="font-medium text-green-400">8%</span>
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
        <p className="text-lg font-semibold mb-4">
          Migrate to Uniswap V3 USDC/ETH on Arbitrum for 12% APY
        </p>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Extra yield</span>
            <span className="font-medium text-green-400">+$40/year</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Migration cost</span>
            <span className="font-medium">~$2.50</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Breakeven</span>
            <span className="font-medium">23 days</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        disabled
        className="w-full max-w-lg rounded-xl bg-indigo-600 py-4 text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500"
      >
        🚀 Migrate Now
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
    </div>
  );
}
