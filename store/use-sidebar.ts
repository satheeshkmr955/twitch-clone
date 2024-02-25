import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type {} from "@redux-devtools/extension";

interface SidebarStore {
  collapsed: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export const useSidebar = create<SidebarStore>()(
  devtools(
    immer((set) => ({
      collapsed: false,
      onExpand: () => set(() => ({ collapsed: false })),
      onCollapse: () => set(() => ({ collapsed: true })),
    })),
    {
      name: "sidebar",
      // enabled: process.env.NODE_ENV !== "production",
    }
  )
);
