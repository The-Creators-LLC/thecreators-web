"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { system } from "@/lib/theme";
import { ThemeProvider } from "next-themes";
import Hyperspace from "../components/Hyperspace";

export default function Home() {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <Hyperspace visible={true} />
      </ThemeProvider>
    </ChakraProvider>
  );
}
