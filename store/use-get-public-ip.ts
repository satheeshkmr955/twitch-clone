import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type {} from "@redux-devtools/extension";

interface GetClientPublicIPStore {
  ip: string;
  isFetched: boolean | null;
  onUpdate: (newIp: string, isFetched: boolean) => void;
}

export const useGetClientPublicIP = create<GetClientPublicIPStore>()(
  devtools(
    immer((set) => ({
      ip: "-",
      isFetched: null,
      onUpdate: (newIp: string, isFetched: boolean) =>
        set((state) => {
          state.ip = newIp;
          state.isFetched = isFetched;
        }),
    })),
    {
      name: "getClientPublicIp",
      // enabled: process.env.NODE_ENV !== "production",
    }
  )
);
