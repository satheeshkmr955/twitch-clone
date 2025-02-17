"use client";

import { useState, useRef, ElementRef } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  GetFollowedAndRecommendedUserDocument,
  GetSelfByNameDocument,
  GetUserByNameWithAllDetailsDocument,
  UpdateUserDocument,
} from "@/gql/graphql";
import { getCacheKey, useMutationGraphQL } from "@/hooks/use-graphql";
import { triggerToast } from "@/lib/utils";
import { logger } from '@/lib/logger';
import { getQueryClient } from "@/lib/queryclient";

import { TriggerToastProps } from "@/app/_types";

interface BioModalProps {
  initialValue: string | null;
}

export const BioModal = (props: BioModalProps) => {
  const { initialValue } = props;
  const [value, setValue] = useState(initialValue || "");

  const closeRef = useRef<ElementRef<"button">>(null);

  const { mutate, isPending } = useMutationGraphQL(
    UpdateUserDocument,
    {
      input: { bio: value },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.updateUser?.toast! as TriggerToastProps);
        const queryKey1 = [
          getCacheKey(GetUserByNameWithAllDetailsDocument),
          {
            input: {
              name: data.data?.updateUser.user.slugName,
            },
          },
        ];
        const queryKey2 = [getCacheKey(GetFollowedAndRecommendedUserDocument)];
        const queryKey3 = [
          getCacheKey(GetSelfByNameDocument),
          {
            input: {
              name: data.data?.updateUser.user.slugName,
            },
          },
        ];

        const queryClient = getQueryClient();

        queryClient.invalidateQueries({ queryKey: queryKey1 });
        queryClient.invalidateQueries({ queryKey: queryKey2 });
        queryClient.invalidateQueries({ queryKey: queryKey3 });
        closeRef.current?.click();
      },
      onError(error) {
        console.error(error);
        logger.error(error);
      },
    }
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  const onCloseHandler = (e: React.FormEvent<HTMLButtonElement>) => {
    if (e.isTrusted) {
      setTimeout(() => {
        setValue(initialValue || "");
      }, 100);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="ml-auto">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user bio</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Textarea
            placeholder="User bio"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            disabled={isPending}
            className="resize-none"
          />
          <div className="flex justify-between">
            <DialogClose asChild ref={closeRef}>
              <Button type="button" variant="ghost" onClick={onCloseHandler}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending} type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
