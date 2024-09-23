import { accessAtom } from "@/lib/atom";
import { Button, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function Account() {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  const [_, setAccess] = useAtom(accessAtom);

  const showUserData = () => {
    // Logic to show user data
    alert(`User data for address: ${address}`);
  };

  return (
    <>
      <Text>Connected to {address}</Text>
      <Button
        onClick={() => {
          disconnect();
          setAccess({});
        }}
      >
        Disconnect
      </Button>
      <Button onClick={showUserData}>Show User Data</Button>
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
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}
