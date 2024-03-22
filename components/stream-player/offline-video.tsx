import { WifiOffIcon } from "lucide-react";

interface OfflineVideoProps {
  username: string;
}

export const OfflineVideo = (props: OfflineVideoProps) => {
  const { username } = props;

  return (
    <div className="h-full flex flex-col space-y-4 justify-center items-center">
      <WifiOffIcon className="h-10 w-10 text-muted-foreground" />
      <p className="text-muted-foreground">{username} is offline</p>
    </div>
  );
};
