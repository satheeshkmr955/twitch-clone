import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type {} from "@redux-devtools/extension";
import { Session } from "next-auth";

interface GetSessionStore {
  session: Session | null;
  isLogged: boolean | null;
  onUpdate: (newSession: Session | null, isLogged: boolean) => void;
}

export const useGetSession = create<GetSessionStore>()(
  devtools(
    immer((set) => ({
      session: null,
      isLogged: null,
      onUpdate: (newSession: Session | null, isLogged: boolean) =>
        set((state) => {
          state.session = newSession;
          state.isLogged = isLogged;
        }),
    })),
    {
      name: "getSession",
      // enabled: process.env.NODE_ENV !== "production",
    }
  )
);
