# 🦘 HopYield

**AI-Powered Uniswap Yield Optimizer**

[![Built at HackMoney 2026](https://img.shields.io/badge/Built%20at-HackMoney%202026-blueviolet?style=for-the-badge)](https://ethglobal.com)
[![Uniswap V4](https://img.shields.io/badge/Uniswap-V4%20Hook-ff007a?style=for-the-badge)](https://uniswap.org)
[![LI.FI](https://img.shields.io/badge/Powered%20by-LI.FI-7b3fe4?style=for-the-badge)](https://li.fi)

---

## Overview

HopYield is an AI-powered yield optimizer that automatically finds the best Uniswap liquidity pool yields across chains and migrates your position via LI.FI — all in one click.

**The Problem:** Uniswap LPs leave money on the table. The same USDC/ETH pool can yield 8% on Base but 12% on Arbitrum. Manually tracking yields across chains, estimating bridge costs, and executing migrations is tedious and error-prone.

**The Solution:** HopYield's AI agent continuously monitors Uniswap pool APYs across chains, calculates whether migrating is profitable after bridge/gas costs, and executes cross-chain migrations through LI.FI when the math makes sense.

**Target Users:** Uniswap liquidity providers who want to maximize yield without manually monitoring pools across multiple chains.

---

## Features

- 🧠 **AI-Powered Yield Analysis** — Compares APYs across Uniswap pools on multiple chains with breakeven analysis
- 🌉 **Cross-Chain Migration via LI.FI** — One-click bridge + swap to move liquidity to higher-yield pools
- 🦄 **Uniswap V4 Hook** — On-chain tracking of LP positions with `beforeAddLiquidity` and `afterRemoveLiquidity` hooks
- ⚡ **Auto-Migration** — Set a threshold (e.g., >3% APY difference) and let the AI handle the rest
- 💰 **Breakeven Calculator** — Only recommends migrations that pay for themselves within 30 days

---

## How It Works

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  1. Connect  │────▶│  2. AI Agent  │────▶│ 3. Recommend    │────▶│ 4. Execute   │
│    Wallet    │     │   Analyzes   │     │   Migration     │     │  via LI.FI   │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘
                          │                      │                       │
                    Compare APYs           Calculate cost          Bridge + Swap
                    across chains          & breakeven            cross-chain
```

1. **Connect Wallet** — User connects via RainbowKit (Base, Arbitrum)
2. **AI Analyzes** — Agent scans Uniswap pools across chains, compares yields
3. **Recommends Migration** — Shows target pool, extra yield, migration cost, and breakeven period
4. **Execute via LI.FI** — Cross-chain bridge and liquidity migration in a single transaction

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, RainbowKit, wagmi, Tailwind CSS |
| **AI Agent** | TypeScript, yield analysis engine |
| **Cross-Chain** | LI.FI SDK (bridging + swaps) |
| **Smart Contracts** | Solidity, Uniswap V4 Hooks, Foundry |
| **Chains** | Base, Arbitrum |

---

## Deployments

| Contract | Network | Address |
|----------|---------|---------|
| HopYieldHook | Base Sepolia | [`0x3C0d10f5126ff4a547fd60B0B3d532c04C1D4900`](https://sepolia.basescan.org/address/0x3C0d10f5126ff4a547fd60B0B3d532c04C1D4900) |

---

## Project Structure

```
hopyield/
├── frontend/          # Next.js app with RainbowKit
│   ├── src/app/       # Pages, API routes, providers
│   └── src/lib/       # Agent client library
├── contracts/         # Foundry project
│   ├── src/           # HopYieldHook.sol (V4 Hook)
│   └── script/        # Deployment scripts (CREATE2)
└── src/               # Backend agent
    ├── agent/         # AI yield analysis engine
    ├── data/          # Pool data, gas estimates
    └── lifi/          # LI.FI SDK integration
```

---

## Getting Started

```bash
# Frontend
cd frontend
cp .env.local.example .env.local  # Add WalletConnect project ID
npm install && npm run dev

# Contracts
cd contracts
cp .env.example .env              # Add private key
forge build
forge script script/DeployHook.s.sol --rpc-url base_sepolia --broadcast

# Backend Agent
cp .env.example .env              # Add API keys
npm install && npm run dev
```

---

## Prize Tracks

### LI.FI — AI x Smart App
HopYield uses LI.FI SDK for cross-chain yield migration. The AI agent estimates bridge costs via LI.FI quotes and executes migrations through LI.FI's routing engine.

### Uniswap — V4 Hook
HopYieldHook is a Uniswap V4 hook deployed on Base Sepolia that tracks LP positions on-chain using `beforeAddLiquidity` and `afterRemoveLiquidity` hooks, enabling automated yield optimization.

---

## Team

- [ArgonStark]
- [Esquirebrazy]

Built for HackMoney 2026

---

## License

MIT
