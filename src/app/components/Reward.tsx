import React from "react";
import { Text, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Reward as RewardType } from "@/lib/guild";

export default function Reward({
  reward,
}: {
  reward: RewardType;
  index: number;
}) {
  const platFormGuildIdValues = reward.guildReward?.platformGuildId.split("-");
  const type = platFormGuildIdValues?.[0];
  switch (type) {
    case "text": {
      return (
        <Text fontSize="sm" color="gray.500">
          Secret: {reward.guildReward?.platformGuildData.name}
        </Text>
      );
    }
    case "form": {
      return (
        <Text fontSize="sm" color="gray.500">
          Form: {reward.guildReward?.platformGuildData.formId}
        </Text>
      );
    }
    case "points": {
      return (
        <Text fontSize="sm" color="gray.500">
          Points: {reward.guildReward?.platformGuildData.name}
        </Text>
      );
    }
    case "BASE_MAINNET": {
      return (
        <Text fontSize="sm" color="gray.500">
          Base NFT: {reward.guildReward?.platformGuildData.name}{" "}
          {reward.guildReward?.platformGuildData.contractAddress}
        </Text>
      );
    }
    default:
      if (
        reward.guildReward?.platformGuildData.inviteChannel &&
        reward.guildReward?.platformGuildData.invite
      ) {
        const link = reward.guildReward?.platformGuildData.invite;
        return (
          <Text fontSize="sm" color="gray.500">
            Discord:{" "}
            <Link href={link} color="blue.500" isExternal>
              {reward.guildReward?.platformGuildData.name}{" "}
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
        );
      }
      console.log("Unknown reward type", reward);
      return (
        <Text fontSize="sm" color="gray.500">
          Unknown reward type (check the console)
        </Text>
      );
  }
}
