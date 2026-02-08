import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, arbitrum } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "UniYield",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [base, arbitrum],
  ssr: true,
});
