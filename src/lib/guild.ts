import { createGuildClient, createSigner } from "@guildxyz/sdk";
import {
  GuildReward,
  Requirement,
  RoleReward,
  Role,
  UserProfile,
} from "@guildxyz/types";
import { SignMessageMutateAsync } from "wagmi/query";

export const guildClient = createGuildClient("the-creators-ui");

// https://api.guild.xyz/v2/guilds/thecreators
export const THE_CREATORS_GUILD_ID = 67920;
export const DEV_GUILD_ID = 73942;

const featuredRoles = {
  [THE_CREATORS_GUILD_ID]: ["Gate 00", "Follow The Goose", "Honkler"],
  [DEV_GUILD_ID]: ["Gate 00", "Gate 01", "n2m u"],
};

export const guildNames: Record<number, string> = {
  [THE_CREATORS_GUILD_ID]: "The Creators",
  [DEV_GUILD_ID]: "Dev Guild",
};

export type Reward = RoleReward & { guildReward?: GuildReward };

export type RoleRequirementsAndRewards = Role & {
  requirements: Requirement[];
  rewards: Reward[];
  guildId: number;
};

async function fetchGuildFeaturedRoles(
  guildId: number,
  featuredRoleNames: string[]
): Promise<RoleRequirementsAndRewards[]> {
  const roles = await guildClient.guild.role.getAll(guildId);
  const guildRewards = await guildClient.guild.reward.getAll(guildId);
  const featuredRoles = roles.filter((role) =>
    featuredRoleNames.includes(role.name)
  );
  const featuredRolesWithRequirements = await Promise.all(
    featuredRoles.map(async (role) => {
      const [requirements, rewards] = await Promise.all([
        guildClient.guild.role.requirement.getAll(guildId, role.id),
        guildClient.guild.role.reward.getAll(guildId, role.id),
      ]);
      return {
        ...role,
        requirements,
        rewards: rewards.map((r) => ({
          ...r,
          guildReward: guildRewards.find((gr) => gr.id === r.guildPlatformId),
        })),
        guildId,
      };
    })
  );
  return featuredRolesWithRequirements;
}

export async function fetchFeaturedRoles() {
  const allRoles = await Promise.all(
    Object.entries(featuredRoles).map(([guildId, roleNames]) =>
      fetchGuildFeaturedRoles(Number(guildId), roleNames)
    )
  );

  return allRoles.flat();
}

export function getSigner(
  signMessageAsync: SignMessageMutateAsync,
  address: string
) {
  return createSigner.custom(
    (message) => signMessageAsync({ message }),
    address
  );
}

export async function fetchUserProfile(
  signMessageAsync: SignMessageMutateAsync,
  address?: string
): Promise<UserProfile | undefined> {
  if (!address) {
    return;
  }
  const userProfile = localStorage.getItem(address);
  if (userProfile) {
    const parsedProfile = JSON.parse(userProfile);
    // TODO check if profile is stale
    return parsedProfile;
  } else {
    const profile = await guildClient.user.getProfile(
      address,
      getSigner(signMessageAsync, address)
    );
    localStorage.setItem(address, JSON.stringify(profile));
    return profile;
  }
}

export async function fetchMemberships(guildUserId?: number) {
  if (!guildUserId) {
    return;
  }
  return guildClient.guild.getUserMemberships(
    THE_CREATORS_GUILD_ID,
    guildUserId
  );
}
