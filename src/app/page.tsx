"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/lib/theme";
import { useAccount } from "wagmi";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import Onboard from "./components/Onboard";
import Stars from "./components/Stars";
import TopBar from "./components/TopBar";
import { useAtom } from "jotai";
import { publicProfileAtom } from "@/lib/atom";
import WebGLView from "./components/WebGLView";
import Hyperspace from "./components/Hyperspace";

export default function Home() {
  const { isConnected } = useAccount();
  const [onboardingFlowFinished, setOnboardingFlowFinished] = useState(false);
  const [publicProfile] = useAtom(publicProfileAtom);

  // If the user disconnects after finishing onboarding, reset.
  if (!isConnected && onboardingFlowFinished) {
    setOnboardingFlowFinished(false);
  }

  // The user's stored onboarding state or the local finishing step
  const onboardingDone =
    onboardingFlowFinished || !!publicProfile?.onboardingDone;
  console.log("onboardingDone", onboardingDone, onboardingFlowFinished);

  // This state toggles from Stars -> Hyperspace after a 1 second delay
  const [hyperspaceActive, setHyperspaceActive] = useState(false);

  useEffect(() => {
    if (onboardingFlowFinished) {
      // Wait 1 second, then fade out Stars & fade in Hyperspace
      const timer = setTimeout(() => setHyperspaceActive(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // If we revert, show stars again
      setHyperspaceActive(false);
    }
  }, [onboardingFlowFinished]);

  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <Stars
          numStars={200}
          onboardingFlowFinished={false}
          starRadius={1.5}
          minStarRadius={0.5}
          hyperspaceActive={hyperspaceActive}
        />

        <Hyperspace visible={hyperspaceActive} />

        <TopBar resetOnboarding={() => setOnboardingFlowFinished(false)} />

        {onboardingFlowFinished ? (
          <WebGLView />
        ) : (
          <Onboard
            onboardingDoneCallback={() => setOnboardingFlowFinished(true)}
            onboardingDone={isConnected && onboardingDone}
          />
        )}
      </ThemeProvider>
    </ChakraProvider>
  );
}
