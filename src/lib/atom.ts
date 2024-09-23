import { atom } from "jotai";
import { PublicUserProfile } from "@guildxyz/types";

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

export const publicProfileAtom = atom<PublicUserProfile | null>(null);
