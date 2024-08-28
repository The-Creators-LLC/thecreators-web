"use client";

import { Inter } from "next/font/google";
import React from "react";
import { http } from "viem";
import { base } from "viem/chains";
import { WagmiProvider, createConfig } from "wagmi";
import "../lib/guild";
import "./globals.css";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
    }),
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <html lang="en">
            <body className={inter.className}>{children}</body>
          </html>
        </JotaiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
