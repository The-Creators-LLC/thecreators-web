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

  if (!isConnected && onboardingFlowFinished) {
    setOnboardingFlowFinished(false);
  }

  const onboardingDone =
    onboardingFlowFinished || !!publicProfile?.onboardingDone;
  console.log("onboardingDone", onboardingDone, onboardingFlowFinished);

  const [hyperspaceActive, setHyperspaceActive] = useState(false);

  useEffect(() => {
    if (onboardingFlowFinished) {
      // Wait 111 milliseconds, then fade out Stars & fade in Hyperspace
      const timer = setTimeout(() => setHyperspaceActive(true), 111);
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
