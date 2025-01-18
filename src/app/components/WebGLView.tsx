/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function WebGLView() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    console.log("WebGLView", phase);
    const timeout = setTimeout(() => {
      setPhase(1);
      console.log("WebGLView", 1);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <Box>
      <Box
        //visibility={phase === 0 ? "hidden" : "visible"}
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        //backdropFilter={phase === 0 ? "blur(0px)" : "blur(4px)"}
        //backgroundColor="rgba(0,0,0,0.2)"
        transition="all 5s"
        //transitionDelay="1s"
        zIndex={1}
      >
        <Box textAlign="center" color="white">
          <iframe
            src="https://www.spatial.io/embed/ClankerCon25-6781dd28a1f3d115184d1c93?share=2956007549698098091"
            allow="camera; fullscreen; autoplay; display-capture; microphone; clipboard-write"
            style={{
              zIndex: 200,
              transition: "all 1s",
              transitionDelay: "4s",
              width: phase === 0 ? "0vw" : "100vw",
              height: phase === 0 ? "0vh" : "100vh",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
