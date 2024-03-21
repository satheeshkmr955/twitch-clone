import { db } from "@/lib/db";
import {
  NOT_AUTHORIZED,
  STREAM_NOT_FOUND,
  UPDATE_STREAM_SUCCESS,
} from "@/constants/message.constants";
import { Toast, ToastTypes } from "@/gql/types";
import { InvalidInput, NotAuthorized, StreamNotFound } from "@/lib/errors";
import { streamUpdateInputSchema } from "@/lib/validation.schema";
import { GetStreamByUserIdProps, UpdateStreamProps } from "@/app/_types";

export const getStreamByUserId = async (inputObj: GetStreamByUserIdProps) => {
  const { input } = inputObj;
  const { userId } = input || {};

  const stream = await db.stream.findUnique({
    where: {
      userId: userId,
    },
    include: {
      user: true,
    },
  });

  return stream;
};

export const updateStream = async (inputObj: UpdateStreamProps) => {
  const { input, user } = inputObj;

  if (!user) {
    throw NotAuthorized(NOT_AUTHORIZED);
  }

  const selfStream = await getStreamByUserId({ input: { userId: user.id } });
  if (!selfStream) {
    throw StreamNotFound(STREAM_NOT_FOUND);
  }

  const result = streamUpdateInputSchema.safeParse(input);
  if (!result.success) {
    throw InvalidInput(
      JSON.stringify({ errors: result.error.formErrors.fieldErrors })
    );
  }

  const updatedStream = await db.stream.update({
    where: { id: selfStream.id },
    data: { ...result.data },
  });

  const toast: Toast = {
    text: `${UPDATE_STREAM_SUCCESS}`,
    type: ToastTypes.Success,
  };

  return { stream: updatedStream, toast };
};
