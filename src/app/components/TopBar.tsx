import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useAccount, useDisconnect } from "wagmi";
import Link from "next/link";
import { publicProfileAtom } from "@/lib/atom";
import { useAtom } from "jotai";

const DEV_MODE = false;

const TopBar = ({ resetOnboarding }: { resetOnboarding: () => void }) => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [publicProfile, setPublicProfile] = useAtom(publicProfileAtom);

  const logout = () => {
    disconnect();
    setPublicProfile(undefined);
  };

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      width="100%"
      zIndex={10}
      padding={6}
    >
      <Flex
        maxWidth="100vw"
        margin="0 11%"
        alignItems="center"
        justifyContent="space-between"
        gap={4}
      >
        <Link href="/">
          <Image src="/thecreators_logo_white.png" alt="Logo" height="24px" />
        </Link>
        <Box>
          {isConnected && (
            <Button color="white" backgroundColor="black" onClick={logout}>
              Log out
            </Button>
          )}
          {/* {!isConnected && publicProfile?.onboardingDone && (
            <Button color="white" backgroundColor="black">
              Sign In
            </Button>
          )} */}
          {publicProfile?.onboardingDone && DEV_MODE && (
            <Button
              marginLeft={4}
              color="white"
              backgroundColor="black"
              onClick={() => {
                setPublicProfile({ ...publicProfile, onboardingDone: false });
                resetOnboarding();
              }}
            >
              Reset animation (DEV)
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default TopBar;
