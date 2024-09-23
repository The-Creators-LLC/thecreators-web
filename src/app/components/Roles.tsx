import React, { useState } from "react";
import {
  Text,
  Flex,
  IconButton,
  useBreakpointValue,
  VStack,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import useSWR from "swr";
import {
  fetchFeaturedRoles,
  fetchMemberships,
  fetchUserProfile,
  getSigner,
  guildClient,
  guildNames,
  RoleRequirementsAndRewards,
} from "@/lib/guild";
import Requirement from "./Requirement";
import { useAccount, useSignMessage } from "wagmi";
import Reward from "./Reward";
import { useAtom } from "jotai";
import { accessAtom, publicProfileAtom } from "@/lib/atom";

const Role = ({ role }: { role: RoleRequirementsAndRewards }) => {
  const [access, setAccess] = useAtom(accessAtom);
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();

  const userAccess = access[role.id] ?? { access: false };

  const checkAccess = async () => {
    try {
      if (!address) {
        throw new Error("No address found");
      }
      const userProfile = await fetchUserProfile(signMessageAsync, address);
      if (!userProfile) {
        throw new Error("No user profile found");
      }
      const requirements = await guildClient.guild.getUserMemberships(
        role.guildId,
        userProfile.id
      );

      setAccess((prev) => ({
        ...prev,
        ...requirements.reduce(
          (acc, r) => ({
            ...acc,
            [r.roleId]: { access: r.access, updated: new Date() },
          }),
          {}
        ),
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const join = async () => {
    try {
      console.log("join", role.guildId, role.id);
      if (!address) {
        throw new Error("No address found");
      }
      const userProfile = await fetchUserProfile(signMessageAsync, address);
      if (!userProfile) {
        throw new Error("No user profile found");
      }
      // TODO only join if not already a member
      const signer = getSigner(signMessageAsync, address);
      const { success, accessedRoleIds } = await guildClient.guild.join(
        role.guildId,
        signer
      );
      console.log("join success", success);
      console.log("accessedRoleIds", accessedRoleIds);

      const rolesAndAccess = await guildClient.guild.accessCheck(
        role.guildId,
        getSigner(signMessageAsync, address)
      );
      console.log("rolesAndAccess", rolesAndAccess);
      setAccess((prev) => ({
        ...prev,
        ...rolesAndAccess.reduce(
          (acc, r) => ({
            ...acc,
            [r.roleId]: { ...r, updated: new Date() },
          }),
          {}
        ),
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <VStack
      bg="white"
      boxShadow="xl"
      borderRadius="lg"
      p={6}
      textAlign="center"
      w="60%"
      h="80%"
      maxH="80%"
      overflowY="auto"
      spacing={4}
    >
      <Text fontSize="xl" fontWeight="bold">
        {role.name}
      </Text>

      <Text fontSize="md" color="gray.500">
        <i>{guildNames[role.guildId]}</i>
      </Text>

      {role.description && (
        <Text fontSize="md" color="gray.600">
          {role.description}
        </Text>
      )}

      <Text fontSize="sm" color="blue.500">
        Members: {role.memberCount}
      </Text>

      {userAccess.updated ? (
        <>
          <Button colorScheme="blue" onClick={join}>
            Update Access
          </Button>
          <Text fontSize="sm" color="gray.500">
            Access: {userAccess.access ? "Granted" : "Denied"} (last updated:{" "}
            {userAccess.updated.toISOString()})
          </Text>
        </>
      ) : (
        <Button colorScheme="blue" onClick={checkAccess}>
          Check Access
        </Button>
      )}

      <Text fontSize="md" color="gray.600">
        {userAccess.access ? "✅ " : "🔒 "}Requirements:
      </Text>

      {role.requirements.map((requirement, index) => (
        <Requirement
          key={index}
          requirement={requirement}
          access={
            (userAccess.access ||
              userAccess.requirements?.find(
                (r) => r.requirementId === requirement.id
              )?.access) ??
            false
          }
        />
      ))}

      <Text fontSize="md" color="gray.600">
        Rewards:
      </Text>

      {role.rewards.map((reward, index) => (
        <Reward key={index} reward={reward} access={userAccess.access} />
      ))}
    </VStack>
  );
};

const RolesCarousel = ({ roles }: { roles: RoleRequirementsAndRewards[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const nextRole = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % roles.length);
  };

  const prevRole = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + roles.length) % roles.length
    );
  };

  return (
    <Flex direction="column" align="center" w="100%" h="77vh">
      <Flex
        flex={1}
        w="100%"
        justify="center"
        align="center"
        position="relative"
      >
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={prevRole}
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
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
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
              <Role role={role} />
            </motion.div>
          ))}
        </Flex>
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={nextRole}
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

export default function Roles() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [publicProfile] = useAtom(publicProfileAtom);

  const { data: publicRoles, isLoading: isPublicRolesLoading } = useSWR(
    ["roles", "public"],
    fetchFeaturedRoles
  );

  const { data: userProfile, isLoading: isUserProfileLoading } = useSWR(
    ["user", address],
    () => fetchUserProfile(signMessageAsync, address)
  );

  console.log("userProfile", userProfile);

  const { data: memberships, isLoading: isMembershipsLoading } = useSWR(
    address ? ["memberships", userProfile?.id] : null,
    () => fetchMemberships(userProfile?.id)
  );

  console.log("memberships", memberships);

  if (isPublicRolesLoading) {
    return <Text>Loading gates...</Text>;
  }

  console.log("publicRoles", publicRoles);

  if (!publicRoles || publicRoles.length === 0) {
    return <Text>No public gates available.</Text>;
  }

  if (address && !publicProfile?.publicKey) {
    return (
      <Text>You need to create an guild.xyz account to access gates.</Text>
    );
  }

  return <RolesCarousel roles={publicRoles} />;
}
