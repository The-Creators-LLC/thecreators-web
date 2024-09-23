import { accessAtom, publicProfileAtom } from "@/lib/atom";
import { fetchUserProfile, getSigner, guildClient } from "@/lib/guild";
import { Button, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import useSWR from "swr";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

function Account({ address }: { address: string }) {
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [_, setAccess] = useAtom(accessAtom);
  const [__, setPublicProfile] = useAtom(publicProfileAtom);

  const { data: publicProfile, isLoading: isPublicProfileLoading } = useSWR(
    ["publicProfile", address],
    async () => {
      const p = await guildClient.user.getProfile(address);
      setPublicProfile(p);
      return p;
    }
  );

  const createAccount = async () => {
    console.log("Public profile", publicProfile);
    /*  const userAddress = await guildClient.user.address.update(
      address,
      address,
      { isPrimary: true },
      getSigner(signMessageAsync, address)
    );
    console.log("User address", userAddress); */

    /* const createPlatform = await guildClient.user.platform.create(
      address,
      { platformName: "GOOGLE" },
      getSigner(signMessageAsync, address)
    );
    console.log("Create platform", createPlatform); */

    const p = await guildClient.user.getProfile(address);
    console.log("Public profile", p);
    setPublicProfile(p);
  };

  return (
    <>
      <Text>Connected to {address}</Text>
      {!isPublicProfileLoading && !publicProfile?.publicKey && (
        <Button onClick={createAccount}>Create account</Button>
      )}
      <Button
        onClick={() => {
          disconnect();
          setAccess({});
        }}
      >
        Disconnect
      </Button>
    </>
  );
}

function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <>
      <Text>Connect your wallet</Text>
      {connectors.map((connector) => (
        <Button key={connector.uid} onClick={() => connect({ connector })}>
          {connector.name}
        </Button>
      ))}
    </>
  );
}

export default function ConnectWallet() {
  const { isConnected, address } = useAccount();
  if (isConnected && address) return <Account address={address} />;
  return <WalletOptions />;
}
