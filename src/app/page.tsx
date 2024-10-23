"use client";

import { ChakraProvider, Stack } from "@chakra-ui/react";

import dynamic from "next/dynamic";
import { system } from "@/lib/theme";
import { useAccount } from "wagmi";
import { ThemeProvider } from "next-themes";
import { publicProfileAtom } from "@/lib/atom";
import { useAtom } from "jotai";
import { useState } from "react";
import Onboard from "./components/Onboard";
import Stars from "./components/Stars";
import TopBar from "./components/TopBar";
import Roles from "./components/Roles";

export default function Home() {
  const { isConnected } = useAccount();
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [publicProfile] = useAtom(publicProfileAtom);

  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <Stars />
        <TopBar />
        {isConnected && (publicProfile?.onboardingDone || onboardingDone) ? (
          <Stack alignItems={"start"} gap={8} padding={8} paddingTop={16}>
            <Roles />
          </Stack>
        ) : (
          <Onboard onboardingDone={() => setOnboardingDone(true)} />
        )}
      </ThemeProvider>
    </ChakraProvider>
  );
}
