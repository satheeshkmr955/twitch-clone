"use client";

import { useState } from "react";
import { CheckCheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  value?: string;
}

export const CopyButton = (props: CopyButtonProps) => {
  const { value } = props;

  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    if (!value) return;

    setIsCopied(true);

    navigator.clipboard.writeText(value);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const Icon = isCopied ? CheckCheckIcon : CopyIcon;

  return (
    <Button
      onClick={onCopy}
      disabled={!value || isCopied}
      variant="ghost"
      size="sm"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};
