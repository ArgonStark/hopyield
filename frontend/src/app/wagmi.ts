import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia, arbitrumSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "UniYield",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [baseSepolia, arbitrumSepolia],
  ssr: true,
});
