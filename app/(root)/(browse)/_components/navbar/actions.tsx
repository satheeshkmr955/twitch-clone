import Link from "next/link";
import { ClapperboardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/UserButton/UserButton";
import { getSession } from "@/lib/auth";
import { SIGN_IN } from "@/constants/route.constants";

export const Actions = async () => {
  const session = await getSession();

  const slugName = decodeURI(session?.user?.name! || "")
  const href = `/u/${slugName}`;

  return (
    <div className="flex items-center justify-end gap-x-2 ml-4 lg:ml-0">
      {!session && (
        <Button asChild size="sm" variant="primary">
          <Link href={`${SIGN_IN}`}>Login</Link>
        </Button>
      )}
      {!!session && (
        <div className="flex items-center gap-x-4">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href={href}>
              <ClapperboardIcon className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </Button>
          <UserButton />
        </div>
      )}
    </div>
  );
};
