import { accessAtom, publicProfileAtom } from "@/lib/atom";
import { fetchUserProfile, getSigner, guildClient } from "@/lib/guild";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import {
  RiArrowRightSLine,
  RiCheckDoubleFill,
  RiCheckLine,
} from "react-icons/ri";
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

export function ConnectWallet() {
  const { isConnected, address } = useAccount();
  if (isConnected && address) return <Account address={address} />;
  return <WalletOptions />;
}

export function ConnectWalletLarge() {
  const { connectors, connect } = useConnect();
  const { address } = useAccount();

  if (address) {
    return (
      <Button
        color="white"
        backgroundColor="black"
        variant="solid"
        height="4em"
        width="90%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="2em"
        borderRadius="10px"
        borderColor="#004CBE"
        borderWidth="1px"
      >
        <Text fontSize="sm" maxWidth="80%" overflow="clip">
          {address}
        </Text>{" "}
        <Flex
          backgroundColor="white"
          borderRadius="50%"
          width="2em"
          height="2em"
          justifyContent="center"
          alignItems="center"
          scale="70%"
        >
          <RiCheckLine color="black" fontSize="xs" />
        </Flex>
      </Button>
    );
  }

  return (
    <DialogRoot placement="center">
      <DialogTrigger asChild>
        <Button
          color="white"
          backgroundColor="black"
          variant="solid"
          height="4em"
          width="90%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="2em"
        >
          <Text>Connect your wallet</Text> <RiArrowRightSLine />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Flex direction="column" gap={4}>
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => connect({ connector })}
              >
                {connector.name}
              </Button>
            ))}
          </Flex>
        </DialogBody>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
