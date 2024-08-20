import React from "react";
import { Text, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Requirement as RequirementType } from "@guildxyz/types";

export default function Requirement({
  requirement,
  index,
}: {
  requirement: RequirementType;
  index: number;
}) {
  switch (requirement.type) {
    case "GUILD_ROLE": {
      const link = `https://guild.xyz/thecreators#role-${requirement.data.roleId}`;
      return (
        <Text fontSize="sm" color="gray.500">
          Requirement {index}: Have the{" "}
          <Link href={link} color="blue.500" isExternal>
            {/* TODO get role name from guild-sdk */}
            role {requirement.data.roleId} <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>
      );
    }
    case "FARCASTER_PROFILE":
      return (
        <Text fontSize="sm" color="gray.500">
          Requirement {index}: Have a Farcaster profile
        </Text>
      );
    case "FARCASTER_FOLLOW_CHANNEL": {
      const link = `https://warpcast.com/~/channel/${requirement.data.id}`;
      return (
        <Text fontSize="sm" color="gray.500">
          Requirement {index}: Follow the channel{" "}
          <Link href={link} color="blue.500" isExternal>
            {requirement.data.id} <ExternalLinkIcon mx="2px" />
          </Link>
          channel on Farcaster
        </Text>
      );
    }
    case "FARCASTER_FOLLOW": {
      const link = `https://warpcast.com/${requirement.data.id}`;
      return (
        <Text fontSize="sm" color="gray.500">
          Requirement {index}: Follow {requirement.data.id} on Farcaster (TODO
          get username from guild-sdk)
        </Text>
      );
    }
    case "ERC20":
      return (
        <Text fontSize="sm" color="gray.500">
          Requirement {index}: Hold at least {requirement.data.minAmount}{" "}
          {requirement.symbol ?? requirement.name}
        </Text>
      );
    default:
      return (
        <Text fontSize="sm" color="gray.500">
          Requirement {index}: {JSON.stringify(requirement, null, 2)}
        </Text>
      );
  }
}
