"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CopyButton } from "./copy-button";

interface KeyCardProps {
  value: string | null;
}

export const KeyCard = (props: KeyCardProps) => {
  const { value } = props;

  const [show, setShow] = useState(false);

  const onClickHandler = () => {
    setShow((prevState) => !prevState);
  };

  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-start gap-x-10 flex-wrap md:flex-nowrap">
        <p className="font-semibold shrink-0">Stream Key</p>
        <div className="space-y-2 w-full">
          <div className="w-full flex items-center gap-x-2">
            <Input
              value={value || ""}
              type={show ? "text" : "password"}
              disabled
              placeholder="Stream key"
            />
            <CopyButton value={value || ""} />
          </div>
          <Button variant="link" size="sm" onClick={onClickHandler}>
            {show ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
    </div>
  );
};
