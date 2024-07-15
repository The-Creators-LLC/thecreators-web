import { Button, Text } from "@chakra-ui/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function Account() {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  return (
    <>
      <Text>Connected to {address}</Text>
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </>
  );
}

function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <Button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </Button>
  ));
}

export function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}
