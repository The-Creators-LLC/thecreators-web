import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body": {
      background: "rgb(0, 0, 32)",
      backgroundColor: "rgb(0, 0, 32)",
      color: "white",
    },
  },
});

export const system = createSystem(defaultConfig, config);
