import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { RiArrowRightSLine, RiArrowUpSLine, RiCheckLine } from "react-icons/ri";
import { ConnectWalletLarge } from "./ConnectWallet";
import { useAccount } from "wagmi";
import { useAtom } from "jotai";
import { publicProfileAtom } from "@/lib/atom";

const ROTATE_Y = "15"; // Changes the height of the diamond

const FirstButton = ({ setIsUnlocked }: { setIsUnlocked: Function }) => {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      setIsUnlocked(true);
    }, 800);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };
  return (
    <Center
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
    >
      <Stack paddingTop={32} gap={32} align="center">
        <Button
          as={Box}
          width="100px"
          height="100px"
          borderRadius={16}
          backgroundColor={
            isPressed ? "rgba(0,76,190,1)" : "rgba(0,76,190,0.4)"
          }
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor={isPressed ? "grabbing" : "pointer"}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onTouchCancel={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          transition="transform 1s"
          transform={`rotateY(${ROTATE_Y}deg) rotateZ(45deg) ${
            isPressed ? "scale(1.5)" : ""
          }`}
          _hover={{
            backgroundColor: isPressed
              ? "rgba(0,76,190,1)"
              : "rgba(0,76,190,0.6)",
            transform: `rotateY(${ROTATE_Y}deg) rotateZ(45deg) ${
              isPressed ? "scale(1.5)" : "scale(1.08)"
            }`,
          }}
        >
          <Image
            src="/key.svg"
            alt="Icon"
            width="70%"
            transform="rotateZ(-45deg) rotateY(-10deg) scaleX(1.1)"
            pointerEvents="none"
          />
        </Button>
        <Text fontSize="md" color="white">
          {isPressed ? "UNLOCKING" : "CLICK AND HOLD"}
        </Text>
      </Stack>
    </Center>
  );
};

const ConnectAccounts = ({ onClaimed }: { onClaimed: Function }) => {
  const { isConnected } = useAccount();

  const [publicProfile] = useAtom(publicProfileAtom);
  return (
    <Center position="absolute" top="30%" left="20%" width="60%">
      <Flex
        direction="column"
        justify="center"
        align="center"
        gap={3}
        width="100%"
      >
        <Heading
          as="h2"
          size="3xl"
          paddingBottom={8}
          paddingTop={8}
          paddingLeft={4}
        >
          <Image
            src="/clankercon.svg"
            alt="Clankercon"
            width="90%"
            color="white"
          />
        </Heading>
        <Text
          color="gray.300"
          fontSize="md"
          width="60%"
          textAlign="center"
          paddingBottom={4}
        >
          Connect your wallet {/* and a social account */}
        </Text>
        <ConnectWalletLarge />
        {/* <Button
          color="white"
          backgroundColor="black"
          variant="solid"
          height="4em"
          width="90%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="2em"
          disabled
        >
          <Text>Connect social (WIP)</Text> <RiArrowRightSLine />
        </Button> */}
        {isConnected && publicProfile && (
          <Button
            backgroundColor="#004CBE"
            color="white"
            width="90%"
            padding="2em"
            marginTop={8}
            disabled={!isConnected}
            onClick={() => onClaimed()}
          >
            <Text>Claim 1 GATE POINT</Text>
          </Button>
        )}
      </Flex>
    </Center>
  );
};

const Content = ({
  ready,
  onboardingDone,
  setReady,
}: {
  ready: boolean;
  onboardingDone: boolean;
  setReady: Function;
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [publicProfile, setPublicProfile] = useAtom(publicProfileAtom);
  const { isConnected } = useAccount();

  if (publicProfile && (onboardingDone || claimed)) {
    return (
      <Box
        transform={ready ? "scale(30)" : ""}
        opacity={ready ? "0" : "1"}
        transition="all 4s"
      >
        <Center
          position="absolute"
          top="56%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Stack paddingTop={32} gap={16} align="center">
            <Box
              width="100px"
              height="100px"
              borderRadius={16}
              backgroundColor="rgba(0,76,190,0.4)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="transform 20s"
              transform={`rotateY(${ROTATE_Y}deg) rotateZ(45deg)`}
              _hover={{
                transform: `rotateY(${ROTATE_Y}deg) rotateZ(45deg) scale(1.08)`,
              }}
            >
              <Flex
                backgroundColor="white"
                borderRadius="50%"
                width="3em"
                height="3em"
                justifyContent="center"
                alignItems="center"
                transform="rotateZ(-45deg) rotateY(-10deg) scaleX(1.1)"
              >
                <RiCheckLine color="black" transform="scale(2)" />
              </Flex>
            </Box>
            <Heading as="h2" size="3xl" paddingLeft={4}>
              <Image
                src="/clankercon.svg"
                alt="Clankercon"
                width="90%"
                color="white"
              />
            </Heading>
            <Button
              backgroundColor="#004CBE"
              color="white"
              width="90%"
              padding="2em"
              transition="background-color 1.5s ease"
              _hover={{
                backgroundColor: "white",
                color: "white",
              }}
              disabled={!isConnected}
              onClick={() => {
                setPublicProfile({ ...publicProfile, onboardingDone: true });
                setReady(true);
              }}
            >
              <RiArrowUpSLine />
              <Text>
                Enter{" "}
                <Image
                  src="/clankercon.svg"
                  alt="Clankercon"
                  height="0.8em"
                  marginLeft={1}
                  marginTop={4.2}
                />
              </Text>
              <RiArrowUpSLine />
            </Button>
          </Stack>
        </Center>
      </Box>
    );
  }

  if (isUnlocked || isConnected) {
    return <ConnectAccounts onClaimed={() => setClaimed(true)} />;
  }
  return <FirstButton setIsUnlocked={setIsUnlocked} />;
};

const Onboard = ({
  onboardingDoneCallback,
  onboardingDone,
}: {
  onboardingDoneCallback: Function;
  onboardingDone: boolean;
}) => {
  const [ready, setReady] = useState(false);

  const triggerAnimation = () => {
    setReady(true);
    setTimeout(() => {
      console.log("onboardingDoneCallback");
      onboardingDoneCallback();
    }, 4500);
  };

  if (!ready && onboardingDone) {
    console.log("set timout for triggerAnimation");
    setTimeout(() => {
      console.log("triggerAnimation");
      triggerAnimation();
    }, 100);
  }

  return (
    <>
      <Center height="100vh" flexDirection="column" padding={4}>
        <Box position="relative" width="100%" maxWidth="534px">
          <Image
            src="/gate.png"
            alt="Gate"
            width="100%"
            pointerEvents="none"
            transition="transform 10s"
            zIndex={ready ? 100 : 0}
            transform={ready ? "scale(10)" : ""}
          />
          <Content
            ready={ready}
            onboardingDone={onboardingDone}
            setReady={triggerAnimation}
          />
        </Box>
      </Center>
    </>
  );
};

export default Onboard;
