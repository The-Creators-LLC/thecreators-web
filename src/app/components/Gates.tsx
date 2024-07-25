import React, { useState } from "react";
import {
  Text,
  Flex,
  IconButton,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import useSWR from "swr";
import { fetchFeaturedRoles, RoleAndRequirements } from "@/lib/guild";

const GatesCarousel = ({ gates }: { gates: RoleAndRequirements[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const nextGate = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gates.length);
  };

  const prevGate = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + gates.length) % gates.length
    );
  };

  return (
    <Flex direction="column" align="center" w="100%" h="60vh">
      <Flex
        flex={1}
        w="100%"
        justify="center"
        align="center"
        position="relative"
      >
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={prevGate}
          position="absolute"
          left={2}
          zIndex={2}
          colorScheme="blue"
          variant="ghost"
          aria-label="Previous gate"
        />
        <Flex
          w={isMobile ? "100%" : "80%"}
          h="100%"
          overflowX="hidden"
          justify="center"
          align="center"
          position="relative"
        >
          {gates.map((gate, index) => (
            <motion.div
              key={gate.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0.5,
                scale: index === currentIndex ? 1 : 0.8,
                x: `${(index - currentIndex) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VStack
                bg="white"
                boxShadow="xl"
                borderRadius="lg"
                p={6}
                textAlign="center"
                w={isMobile ? "90%" : "60%"}
                h="auto"
                maxH="80%"
                overflowY="auto"
                spacing={4}
              >
                <Text fontSize="xl" fontWeight="bold">
                  {gate.name}
                </Text>
                <Text fontSize="md" color="gray.600">
                  {gate.description}
                </Text>
                <Text fontSize="sm" color="blue.500">
                  Members: {gate.memberCount}
                </Text>
                {gate.requirements.map((requirement, index) => (
                  <Text key={index} fontSize="sm" color="gray.500">
                    Requirement {index}: {JSON.stringify(requirement, null, 2)}
                  </Text>
                ))}
              </VStack>
            </motion.div>
          ))}
        </Flex>
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={nextGate}
          position="absolute"
          right={2}
          zIndex={2}
          colorScheme="blue"
          variant="ghost"
          aria-label="Next gate"
        />
      </Flex>
    </Flex>
  );
};

export default function Gates() {
  const { data: publicGates, isLoading: isPublicGatesLoading } = useSWR(
    ["gates", "public"],
    fetchFeaturedRoles
  );

  if (isPublicGatesLoading) {
    return <Text>Loading gates...</Text>;
  }

  console.log("publicGates", publicGates);

  if (!publicGates || publicGates.length === 0) {
    return <Text>No public gates available.</Text>;
  }

  return <GatesCarousel gates={publicGates} />;
}
