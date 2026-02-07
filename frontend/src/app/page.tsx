"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-5xl font-bold">🦘 HopYield</h1>
      <p className="text-lg text-gray-500">Cross-chain yield optimizer</p>
      <ConnectButton />
    </div>
  );
}
