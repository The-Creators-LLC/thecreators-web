import React from "react";
import { Text, Link, Button } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { getSigner, guildClient, Reward as RewardType } from "@/lib/guild";
import { useAccount, useSignMessage } from "wagmi";

function SecretReward({
  reward,
  access,
}: {
  reward: RewardType;
  access: boolean;
}) {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const [secret, setSecret] = React.useState<string | undefined>(undefined);
  return (
    <Text fontSize="sm" color="gray.500">
      Secret: {reward.guildReward?.platformGuildData.name ?? "Unknown secret"}
      {access &&
        (secret ? (
          <i>
            <br />
            {secret}
          </i>
        ) : (
          <Button
            colorScheme="blue"
            size="xs"
            ml="5px"
            onClick={async () => {
              if (!address) {
                throw new Error("No address found");
              }
              const signer = getSigner(signMessageAsync, address);
              const rewards =
                reward.guildPlatformId &&
                (await guildClient.guild.reward.getAll(reward.guildId, signer));
              if (rewards === 0) {
                console.log("No rewards revealed");
                return;
              }
              console.log("Revealed rewards", rewards);
              const secretReward = rewards.find(
                (r) => r.platformGuildId === reward.guildReward?.platformGuildId
              );
              console.log("Secret reward", secretReward);
              if (!secretReward) {
                console.log("No secret reward found");
                return;
              }
              setSecret(secretReward.platformGuildData.text);
            }}
          >
            Reveal
          </Button>
        ))}
    </Text>
  );
}
export default function Reward({
  reward,
  access,
}: {
  reward: RewardType;
  access: boolean;
}) {
  const platFormGuildIdValues = reward.guildReward?.platformGuildId.split("-");
  const type = platFormGuildIdValues?.[0];
  switch (type) {
    case "text": {
      return <SecretReward reward={reward} access={access} />;
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
            <Link href={link} color="blue.500">
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
