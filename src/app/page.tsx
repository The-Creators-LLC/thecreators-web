"use client";

import { ChakraProvider, Stack } from "@chakra-ui/react";

import dynamic from "next/dynamic";

const ConnectWallet = dynamic(() => import("./components/ConnectWallet"), {
  ssr: false,
});

const Gates = dynamic(() => import("./components/Gates"), { ssr: false });

const Profile = dynamic(() => import("./components/Profile"), { ssr: false });

export default function Home() {
  return (
    <ChakraProvider>
      <Stack alignItems={"start"} spacing={8} padding={8}>
        <ConnectWallet />
        <Profile />
        <Gates />
      </Stack>
    </ChakraProvider>
  );
}
