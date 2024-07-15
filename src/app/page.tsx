"use client";

import {
  Button,
  ChakraProvider,
  HStack,
  ListItem,
  OrderedList,
  Spinner,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { createSigner } from "@guildxyz/sdk";
import { UserProfile } from "@guildxyz/types";
import { useState } from "react";
import useSWR from "swr";
import { useAccount, useSignMessage } from "wagmi";
import guildClient from "../lib/guild";
import dynamic from "next/dynamic";

const ConnectWallet = dynamic(
  () => import("./ConnectWallet").then((mod) => mod.ConnectWallet),
  { ssr: false }
);

// https://api.guild.xyz/v2/guilds/thecreators
const GUILD_ID = 67920;

async function fetchUserMembershipsInGuild(
  address: `0x${string}`,
  guildId: number
) {
  const results = await guildClient.user.getMemberships(address);
  return results.find((item) => item.guildId === guildId);
}

async function fetchRoleNames(guildId: number) {
  return guildClient.guild.role
    .getAll(guildId)
    .then((roles) =>
      Object.fromEntries(roles.map(({ id, name }) => [id, name]))
    );
}

async function fetchLeaderboard(guildIdOrUrlName: number | string) {
  const rewards = await guildClient.guild.reward.getAll(guildIdOrUrlName);

  // platformId === 13 means that the reward is point-based
  const pointsReward = rewards.find((reward) => reward.platformId === 13);

  // The guildPlatformId parameter could also be hardcoded
  return guildClient.guild.getLeaderboard(guildIdOrUrlName, pointsReward!.id);
}

export default function Home() {
  const { address } = useAccount();

  const { signMessageAsync } = useSignMessage();

  const [profile, setProfile] = useState<UserProfile>();

  const { data: userMemberships, isLoading: isUserMembershipsLoading } = useSWR(
    !!address ? ["memberships", address, GUILD_ID] : null,
    ([, ...props]) => fetchUserMembershipsInGuild(...props)
  );

  const { data: roles, isLoading: isRolesLoading } = useSWR(
    ["roles", GUILD_ID],
    ([, ...props]) => fetchRoleNames(...props)
  );

  const { data: leaderboard, isLoading: isLeaderboardLoading } = useSWR(
    ["leaderboard", "walletconnect"],
    ([, ...params]) => fetchLeaderboard(...params)
  );

  return (
    <ChakraProvider>
      <Stack alignItems={"start"} spacing={8} padding={8}>
        <HStack>
          <ConnectWallet />
        </HStack>

        {!!address && (
          <>
            <Text fontSize={"xx-large"}>Fetch user profile</Text>
            {!profile ? (
              <Button
                onClick={() =>
                  guildClient.user
                    .getProfile(
                      address,
                      createSigner.custom(
                        (message) => signMessageAsync({ message }),
                        address
                      )
                    )
                    .then(setProfile)
                }
              >
                Call Guild API
              </Button>
            ) : (
              <Text>{JSON.stringify(profile)}</Text>
            )}
          </>
        )}

        <Text fontSize={"xx-large"}>List Memberships</Text>

        {isUserMembershipsLoading || isRolesLoading ? (
          <Spinner />
        ) : !userMemberships || !roles ? (
          <Text>No data</Text>
        ) : (
          <UnorderedList>
            {userMemberships.roleIds.map((roleId) => (
              <ListItem key={roleId}>
                {roles[roleId]} (#{roleId})
              </ListItem>
            ))}
          </UnorderedList>
        )}

        <Text fontSize={"xx-large"}>Listing Point Leaderboard</Text>

        {isLeaderboardLoading ? (
          <Spinner />
        ) : !leaderboard ? (
          <Text>No data</Text>
        ) : (
          <OrderedList>
            {leaderboard.leaderboard.map(({ userId, address, totalPoints }) => (
              <ListItem key={userId}>
                {address} ({totalPoints} points)
              </ListItem>
            ))}
          </OrderedList>
        )}
      </Stack>
    </ChakraProvider>
  );
}
