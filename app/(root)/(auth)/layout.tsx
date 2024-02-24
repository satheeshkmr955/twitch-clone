import { Logo } from "./_component/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full py-8 flex flex-col items-center justify-center space-y-6">
      <Logo />
      {children}
    </div>
  );
}
