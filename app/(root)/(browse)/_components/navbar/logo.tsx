import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { HOME } from "@/constants/route.constants";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const Logo = () => {
  return (
    <Link href={HOME}>
      <div className="flex lg:flex items-center gax-x-4 hover:opacity-75 transition">
        <div className="bg-white rounded-full p-1 mr-12 shrink-0 lg:mr-0 lg:shrink">
          <Image src="/images/spooky.svg" alt="logo" width="32" height="32" />
        </div>
        <div className={cn("hidden lg:block", font.className, "ml-2")}>
          <p className="text-lg font-semibold">Twitch</p>
          <p className="text-xs text-muted-foreground ">Let&apos;s play</p>
        </div>
      </div>
    </Link>
  );
};
