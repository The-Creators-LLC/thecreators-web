import { createGuildClient } from "@guildxyz/sdk";
import { Requirement, Role } from "@guildxyz/types";

export const guildClient = createGuildClient("the-creators-ui");

// https://api.guild.xyz/v2/guilds/thecreators
export const THE_CREATORS_GUILD_ID = 67920;

const featuredRoles = {
  [THE_CREATORS_GUILD_ID]: ["Gate 00", "Follow The Goose", "Honkler"],
};

export type RoleAndRequirements = Role & { requirements: Requirement[] };

async function fetchGuildFeaturedRoles(
  guildId: number,
  featuredRoleNames: string[]
): Promise<RoleAndRequirements[]> {
  const roles = await guildClient.guild.role.getAll(guildId);
  const featuredRoles = roles.filter((role) =>
    featuredRoleNames.includes(role.name)
  );
  const featuredRolesWithRequirements = await Promise.all(
    featuredRoles.map(async (role) => {
      const requirements = await guildClient.guild.role.requirement.getAll(
        guildId,
        role.id
      );
      return { ...role, requirements };
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
