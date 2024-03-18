"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useState, useRef, ElementRef } from "react";
import { IngressInput } from "livekit-server-sdk";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCacheKey, useMutationGraphQL } from "@/hooks/use-graphql";
import {
  CreateIngressDocument,
  GetStreamByUserIdDocument,
} from "@/gql/graphql";
import { TriggerToastProps } from "@/app/_types";
import { getQueryClient } from "@/lib/queryclient";
import { triggerToast } from "@/lib/utils";

const RTMP = String(IngressInput.RTMP_INPUT);
const WHIP = String(IngressInput.WHIP_INPUT);

type IngressType = typeof RTMP | typeof WHIP;

export const ConnectModal = () => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [ingressType, setIngressType] = useState<IngressType>(RTMP);

  const { mutate, isPending } = useMutationGraphQL(
    CreateIngressDocument,
    {
      input: { ingressType: parseInt(ingressType) },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.createIngress?.toast! as TriggerToastProps);
        const queryClient = getQueryClient();
        const queryKey = [getCacheKey(GetStreamByUserIdDocument)];
        queryClient.invalidateQueries({ queryKey });
        closeRef.current?.click();
      },
      onError(error) {
        // console.log("error", error);
      },
    }
  );

  const onSubmitHandler = () => {
    mutate();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Generate connection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate connection</DialogTitle>
        </DialogHeader>
        <Select
          disabled={isPending}
          value={ingressType}
          onValueChange={(value) => setIngressType(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ingress Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={RTMP}>RTMP</SelectItem>
            <SelectItem value={WHIP}>WHIP</SelectItem>
          </SelectContent>
        </Select>
        <Alert>
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            This action will reset all active streams using the current
            connection
          </AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <DialogClose asChild ref={closeRef}>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            variant="primary"
            onClick={onSubmitHandler}
            disabled={isPending}
          >
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
