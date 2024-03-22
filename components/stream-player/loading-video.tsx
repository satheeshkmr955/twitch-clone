import { LoaderIcon } from "lucide-react";

interface LoadingVideoProps {
  label: string;
}

export const LoadingVideo = (props: LoadingVideoProps) => {
  const { label } = props;

  return (
    <div className="h-full flex flex-col space-y-4 justify-center items-center">
      <LoaderIcon className="h-10 w-10 text-muted-foreground animate-spin" />
      <p className="text-muted-foreground capitalize">{label}</p>
    </div>
  );
};
