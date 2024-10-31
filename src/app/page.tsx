"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { system } from "@/lib/theme";
import { useAccount } from "wagmi";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import Onboard from "./components/Onboard";
import Stars from "./components/Stars";
import TopBar from "./components/TopBar";
import CastleView from "./components/CastleView";
import { useAtom } from "jotai";
import { publicProfileAtom } from "@/lib/atom";
import { on } from "events";

export default function Home() {
  const { isConnected } = useAccount();
  const [onboardingFlowFinished, setOnboardingFlowFinished] = useState(false);

  const [publicProfile] = useAtom(publicProfileAtom);

  if (!isConnected && onboardingFlowFinished) {
    // Reset onboarding flow when user disconnects
    setOnboardingFlowFinished(false);
  }

  const onboardingDone =
    onboardingFlowFinished || !!publicProfile?.onboardingDone;

  console.log("onboardingDone", onboardingDone, onboardingFlowFinished);

  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <Stars onboardingFlowFinished={onboardingFlowFinished} />
        <TopBar />
        {onboardingFlowFinished ? (
          <CastleView />
        ) : (
          <Onboard
            onboardingDoneCallback={() => setOnboardingFlowFinished(true)}
            onboardingDone={onboardingDone}
          />
        )}
      </ThemeProvider>
    </ChakraProvider>
  );
}
