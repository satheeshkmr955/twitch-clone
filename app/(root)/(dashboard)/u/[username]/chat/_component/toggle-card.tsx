"use client";

import { Switch } from "@/components/ui/switch";

import { getCacheKey, useMutationGraphQL } from "@/hooks/use-graphql";
import { GetStreamByUserIdDocument, UpdateStreamDocument } from "@/gql/graphql";
import { TriggerToastProps } from "@/app/_types";
import { triggerToast } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { getQueryClient } from "@/lib/queryclient";
import { Skeleton } from "@/components/ui/skeleton";

type FieldTypes = "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";

interface ToggleCardProps {
  label: string;
  value: boolean;
  field: FieldTypes;
}

export const ToggleCard = (props: ToggleCardProps) => {
  const { label, value, field } = props;

  const { mutate, isPending } = useMutationGraphQL(
    UpdateStreamDocument,
    {
      input: { [field]: !value },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.updateStream?.toast! as TriggerToastProps);
        const queryClient = getQueryClient();
        const queryKey = [getCacheKey(GetStreamByUserIdDocument)];
        queryClient.invalidateQueries({ queryKey });
      },
      onError(error) {
        console.error(error);
        logger.error(error);
      },
    }
  );

  const onChangeHandler = () => {
    mutate();
  };

  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-center justify-between">
        <p className="font-semibold shrink-0">{label}</p>
        <div className="space-y-2">
          <Switch
            disabled={isPending}
            onCheckedChange={onChangeHandler}
            checked={value}
          >
            {value ? "On" : "Off"}
          </Switch>
        </div>
      </div>
    </div>
  );
};

export const ToggleCardSkeleton = () => {
  return <Skeleton className="rounded-xl p-10 w-full" />;
};

ToggleCard.Skeleton = ToggleCardSkeleton;
