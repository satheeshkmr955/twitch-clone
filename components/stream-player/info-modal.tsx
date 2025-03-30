"use client";

import { ElementRef, useRef, useState } from "react";
import { AxiosResponse } from "axios";
import { LoaderIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Hint } from "@/components/hint";

import { getCacheKey, useMutationGraphQL } from "@/hooks/use-graphql";
import {
  GetSelfByNameDocument,
  GetStreamByUserIdDocument,
  UpdateStreamDocument,
} from "@/gql/graphql";
import { triggerToast } from "@/lib/utils";
import { getQueryClient } from "@/lib/queryclient";
import { axiosFileUpload } from "@/lib/fetcher";
import { logger } from "@/lib/clientLogger";

import {
  FILE_UPLOAD_SIZE_LIMIT,
  S3_PROFILE_URL,
} from "@/constants/common.constants";
import { TriggerToastProps } from "@/app/_types";

interface InfoModalProps {
  initialName: string;
  initialThumbnailUrl: string | null;
}

export const InfoModal = (props: InfoModalProps) => {
  const { initialName, initialThumbnailUrl } = props;

  const closeRef = useRef<ElementRef<"button">>(null);

  const [name, setName] = useState(initialName);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);
  const [isPendingFile, setIsPendingFile] = useState(false);

  const { data: session } = useSession();

  const { mutate, isPending: isPendingUpdate } = useMutationGraphQL(
    UpdateStreamDocument,
    {
      input: { name, thumbnailUrl },
    },
    {
      onSuccess: (data) => {
        triggerToast(data.data?.updateStream?.toast! as TriggerToastProps);
        const queryClient = getQueryClient();
        const queryKey1 = [getCacheKey(GetStreamByUserIdDocument)];
        const queryKey2 = [getCacheKey(GetSelfByNameDocument)];
        queryClient.invalidateQueries({ queryKey: queryKey1 });
        queryClient.invalidateQueries({ queryKey: queryKey2 });
        closeRef.current?.click();
      },
      onError(error) {
        console.error(error);
        logger.error(error);
      },
    }
  );

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onFileUploadHandler = async ({ formData }: { formData: FormData }) => {
    const response: AxiosResponse = await axiosFileUpload({
      data: formData,
    });
    setThumbnailUrl(`${S3_PROFILE_URL}${response.data[0].Key}`);
    setIsPendingFile(false);
  };

  const onRemoveFileHandler = () => {
    setThumbnailUrl(null);
  };

  const onChangeFileHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileInput = e.target;
    if (fileInput.files) {
      if (fileInput.files[0].size < FILE_UPLOAD_SIZE_LIMIT) {
        const userId = session?.user?.id || "";
        const timestamp = Date.now();
        const fileName = fileInput.files[0].name;

        const uploadFileName = `${userId}--${timestamp}--${fileName}`;

        const formData = new FormData();
        formData.append("file", fileInput.files[0], uploadFileName);

        try {
          setIsPendingFile(true);
          onFileUploadHandler({ formData });
        } catch (error) {
          console.error(error);
          logger.error(error);
          toast.error("File upload failed");
          setIsPendingFile(false);
        }
      } else {
        toast.warning("Image file should be less than 4 MB");
      }
    }
  };

  const onCloseHandler = () => {
    setTimeout(() => {
      setThumbnailUrl(initialThumbnailUrl);
    }, 100);
  };

  const isPending = isPendingUpdate || isPendingFile;

  return (
    <Dialog
      onOpenChange={onCloseHandler}
    >
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="ml-auto">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit stream info</DialogTitle>
        </DialogHeader>
        <form className="space-y-14" onSubmit={onSubmitHandler}>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Stream name"
              onChange={onChangeHandler}
              value={name}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            {thumbnailUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <div className="absolute top-2 right-2 z-10">
                  <Hint label="Remove thumbnail" asChild side="left">
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={onRemoveFileHandler}
                      className="h-auto w-auto p-1.5"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </Hint>
                </div>
                <Image
                  alt="thumbnail"
                  src={thumbnailUrl}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            ) : (
              <div className="rounded-xl border outline-dashed outline-muted relative">
                <Input
                  id="picture"
                  type="file"
                  onChange={onChangeFileHandler}
                  accept="image/*"
                  disabled={isPendingFile}
                />
                {isPendingFile && (
                  <div className="absolute top-[6px] flex justify-center w-full">
                    <LoaderIcon className="h-7 w-7 text-muted-foreground animate-spin" />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <DialogClose asChild ref={closeRef}>
              <Button type="button" variant="ghost" onClick={onCloseHandler}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending} variant="primary" type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
