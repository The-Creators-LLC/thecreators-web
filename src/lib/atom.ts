import { atom } from "jotai";
import { PublicUserProfile } from "@guildxyz/types";
import { atomWithStorage } from "jotai/utils";

export const accessAtom = atom<
  Record<
    string,
    {
      access: boolean;
      updated: Date;
      requirements?: {
        requirementId: number;
        access: boolean | null;
        amount?: number;
      }[];
    }
  >
>({});

export const publicProfileAtom = atomWithStorage<
  (PublicUserProfile & { onboardingDone?: boolean }) | undefined
>("publicProfile", undefined);
