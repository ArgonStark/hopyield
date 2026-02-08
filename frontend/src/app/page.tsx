"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const [autoMigrate, setAutoMigrate] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 gap-8">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between">
        <h1 className="text-3xl font-bold">🦘 HopYield</h1>
        <ConnectButton />
      </div>

      {/* Position Card */}
      <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-lg">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
          Your Position
        </h2>
        <div className="space-y-3">
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
          Migrate to Arbitrum for 12% APY
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
    </div>
  );
}
