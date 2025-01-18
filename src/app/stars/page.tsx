"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { system } from "@/lib/theme";
import { ThemeProvider } from "next-themes";
import Stars from "../components/Stars";

export default function Home() {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <Stars numStars={1000} starRadius={2} minStarRadius={1.0} />
      </ThemeProvider>
    </ChakraProvider>
  );
}
