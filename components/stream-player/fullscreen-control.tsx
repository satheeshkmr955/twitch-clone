"use client";

import { MaximizeIcon, MinimizeIcon } from "lucide-react";

import { Hint } from "@/components/hint";

interface FullscreenControlProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

export const FullscreenControl = (props: FullscreenControlProps) => {
  const { isFullscreen, onToggle } = props;

  const Icon = isFullscreen ? MinimizeIcon : MaximizeIcon;

  const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";

  return (
    <div className="flex items-center justify-center gap-4">
      <Hint label={label} asChild>
        <button
          onClick={onToggle}
          className="text-white p-1.5 hover:bg-white/10 rounded-lg"
        >
          <Icon className="h-5 w-5" />
        </button>
      </Hint>
    </div>
  );
};
