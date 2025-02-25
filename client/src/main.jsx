import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "react-hot-toast";
import { defineChain } from "viem";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const queryClient = new QueryClient();
const CreatorChain = defineChain({
  id: 66665,
  name: "Creator Chain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether (ETH)",
    symbol: "CETH",
  },
  rpcUrls: {
    default: {
      http: ["https://66665.rpc.thirdweb.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Creator Testnet Explorers",
      url: "https://explorer.creatorchain.io",
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: "SkillSwap",
  projectId: "1dc569e57043de895371d229a390afda",
  chains: [CreatorChain],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

createRoot(document.getElementById("root")).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider showRecentTransactions={true}>
        <StrictMode>
          <App />

          <Toaster position="bottom-right" reverseOrder={true} />
        </StrictMode>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
