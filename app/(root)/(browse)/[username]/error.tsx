"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HOME } from "@/constants/route.constants";

const Errorpage = () => {
  return (
    <div className="h-full flex flex-col space-y-4 items-center justify-center text-muted-foreground">
      <p>Something went wrong</p>
      <Button variant="secondary" asChild>
        <Link href={HOME}>Go back home</Link>
      </Button>
    </div>
  );
};

export default Errorpage;
