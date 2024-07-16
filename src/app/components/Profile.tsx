import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { createSigner } from "@guildxyz/sdk";
import { UserProfile } from "@guildxyz/types";
import { Button, Text } from "@chakra-ui/react";
import { guildClient } from "@/lib/guild";

export default function Profile() {
  const { address } = useAccount();

  const { signMessageAsync } = useSignMessage();

  const [profile, setProfile] = useState<UserProfile>();

  if (!address) {
    return <></>;
  }

  return (
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
  );
}
