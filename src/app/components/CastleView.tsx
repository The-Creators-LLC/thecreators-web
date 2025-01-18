import { Box, Button, Heading, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Roles from "./Roles";

export default function CastleView() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPhase(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <Box>
      <Box
        visibility={phase === 0 ? "hidden" : "visible"}
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        backdropFilter={phase === 0 ? "blur(0px)" : "blur(5px)"}
        backgroundColor="rgba(0,0,0,0.2)"
        transition="all 5s"
        transitionDelay="8s"
        zIndex={1}
      >
        <Box textAlign="center" color="white">
          {phase === 1 && (
            <Box>
              <Heading as="h1" size="6xl" mb={8}>
                Enter your first dungeon
              </Heading>
              <Button
                paddingX={12}
                paddingY={8}
                color="white"
                backgroundColor="#C1A79F"
                borderWidth="2px"
                borderColor="#ffe6d7"
                borderRadius={8}
                onClick={() => setPhase(2)}
              >
                Get started
              </Button>
            </Box>
          )}
          {phase === 2 && <Roles />}
        </Box>
      </Box>

      <Box height="100vh" width="100vw">
        <Image
          src="castle_outside.svg"
          alt="castle"
          width="100vw"
          zIndex={0}
          position="fixed"
          bottom={phase === 0 ? -700 : 0}
          transform={phase === 0 ? "" : "scale(1.5)"}
          transformOrigin="bottom center"
          transitionProperty="transform, bottom"
          transitionDuration="5s, 5s"
          transitionDelay="2s, 0s"
        />
      </Box>
    </Box>
  );
}
