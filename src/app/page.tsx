"use client";

import { ChakraProvider, Stack } from "@chakra-ui/react";

import dynamic from "next/dynamic";

const ConnectWallet = dynamic(() => import("./components/ConnectWallet"), {
  ssr: false,
});

const Roles = dynamic(() => import("./components/Roles"), { ssr: false });

export default function Home() {
  return (
    <ChakraProvider>
      <Stack alignItems={"start"} spacing={8} padding={8}>
        <ConnectWallet />
        <Roles />
      </Stack>
    </ChakraProvider>
  );
}
