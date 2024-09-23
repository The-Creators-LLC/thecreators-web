import React from "react";
import { Text, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Requirement as RequirementType } from "@guildxyz/types";

export default function Requirement({
  requirement,
  access,
}: {
  requirement: RequirementType;
  access: boolean;
}) {
  function getText() {
    switch (requirement.type) {
      case "GUILD_ROLE": {
        const link = `https://guild.xyz/thecreators#role-${requirement.data.roleId}`;
        return (
          <>
            Have the{" "}
            <Link href={link} color="blue.500" isExternal>
              {/* TODO get role name from guild-sdk */}
              role {requirement.data.roleId} <ExternalLinkIcon mx="2px" />
            </Link>
          </>
        );
      }
      case "FARCASTER_PROFILE":
        return <>Have a Farcaster profile</>;
      case "FARCASTER_FOLLOW_CHANNEL": {
        const link = `https://warpcast.com/~/channel/${requirement.data.id}`;
        return (
          <>
            Follow the channel{" "}
            <Link href={link} color="blue.500" isExternal>
              {requirement.data.id} <ExternalLinkIcon mx="2px" />
            </Link>
            channel on 𝕏
          </>
        );
      }
      case "FARCASTER_FOLLOW": {
        return (
          <>
            Follow {requirement.data.id} on Farcaster{" "}
            {/* TODO
          get username from guild-sdk */}
          </>
        );
      }
      case "TWITTER_FOLLOW": {
        const link = `https://x.com/${requirement.data.id}`;
        return (
          <>
            Follow{" "}
            <Link href={link} color="blue.500" isExternal>
              {requirement.data.id} <ExternalLinkIcon mx="2px" />
            </Link>
            on 𝕏
          </>
        );
      }
      case "ERC20":
        return (
          <>
            Hold at least {requirement.data.minAmount}{" "}
            {requirement.symbol ?? requirement.name}
          </>
        );
      case "ERC721":
        return (
          <>
            Own{" "}
            {requirement.name || requirement.symbol
              ? `a(n) '${requirement.name ?? requirement.symbol}' NFT`
              : "a(n) NFT"}{" "}
          </>
        );
      case "FREE":
        return <>Free to join</>;
      case "FORM_SUBMISSION": {
        //TODO get guild id from guild-sdk
        const link = `https://guild.xyz/dev-a67867/forms/${requirement.data.id}`;
        return (
          <>
            Submit{" "}
            <Link href={link} color="blue.500" isExternal>
              this form <ExternalLinkIcon mx="2px" />
            </Link>
          </>
        );
      }
      default:
        console.log("Unknown requirement type", requirement);
        return <>Unknown requirement type (check the console)</>;
    }
  }
  return (
    <Text fontSize="sm" color="gray.500">
      {access ? "✔️" : "❌"} {getText()}
    </Text>
  );
}
