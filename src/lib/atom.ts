import { atom } from "jotai";

export const accessAtom = atom<
  Record<string, { access: boolean; updated: Date }>
>({});
