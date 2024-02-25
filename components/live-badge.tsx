import { cn } from "@/lib/utils";

interface LiveBadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LiveBadge = (props: LiveBadgeProps) => {
  const { className } = props;

  return (
    <div
      {...props}
      className={cn(
        "bg-rose-500 text-center p-0.5 px-1.5 rounded-md uppercase text-[10px] border border-background font-semibold tracking-wide",
        className
      )}
    >
      Live
    </div>
  );
};
