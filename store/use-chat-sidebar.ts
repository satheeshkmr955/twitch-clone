import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type {} from "@redux-devtools/extension";

export enum ChatVariant {
  CHAT = "CHAT",
  COMMUNITY = "COMMUNITY",
}

interface ChatSidebarStore {
  collapsed: boolean;
  variant: ChatVariant;
  onExpand: () => void;
  onCollapse: () => void;
  onChangeVariant: (variant: ChatVariant) => void;
}

export const useChatSidebar = create<ChatSidebarStore>()(
  devtools(
    immer((set) => ({
      collapsed: false,
      variant: ChatVariant.CHAT,
      onExpand: () => set(() => ({ collapsed: false })),
      onCollapse: () => set(() => ({ collapsed: true })),
      onChangeVariant: (variant: ChatVariant) => set(() => ({ variant })),
    })),
    {
      name: "createSidebar",
      // enabled: process.env.NODE_ENV !== "production",
    }
  )
);
