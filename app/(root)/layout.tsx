import { Toaster } from "sonner";

import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getSession } from "@/lib/auth";

type LayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = async (props: LayoutProps) => {
  const { children } = props;

  const session = await getSession();

  return (
    <ThemeProvider
      attribute="class"
      forcedTheme="dark"
      storageKey="twitch-clone"
      // forcedTheme="light"
      // defaultTheme="system"
      // enableSystem
      // disableTransitionOnChange
    >
      <AuthProvider session={session}>
        <Toaster theme="light" />
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default HomeLayout;
