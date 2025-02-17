import axios from "axios";

import { CHECK_EMAIL_EXISTS, SIGNUP_EXISTS } from "@/constants/api.constants";
import { publicAxios } from "@/lib/fetcher";
import { logger } from "@/lib/logger";
import {
  Success,
  Error,
  SignupInput,
  CheckEmailsExistsInput,
} from "@/app/_types";

import type { AxiosResponse } from "axios";
import { POST } from "@/constants/message.constants";

type CheckEmailsExistsApiHandlerProps = {
  body: CheckEmailsExistsInput;
};

export const checkEmailsExistsApiHandler = async (
  obj: CheckEmailsExistsApiHandlerProps
) => {
  const { body } = obj;
  try {
    const response: AxiosResponse = await publicAxios({
      data: body,
      url: CHECK_EMAIL_EXISTS,
      method: POST,
    });
    const data: Success = response.data;
    return data.isEmailExists;
  } catch (error) {
    let tempError = error;
    if (axios.isAxiosError(error)) {
      tempError = error.response?.data;
    }
    logger.error(tempError);
    return false;
  }
};

export type SignUpApiProps = {
  body: SignupInput;
  onSuccess: (data: Success, statusCode: number) => void;
  onError: (error: Error | Success, statusCode: number) => void;
};

export const signUpApiHandler = async (obj: SignUpApiProps) => {
  const { body, onSuccess, onError } = obj;

  try {
    const response: AxiosResponse = await publicAxios({
      data: body,
      url: SIGNUP_EXISTS,
      method: POST,
    });
    onSuccess?.(response.data, response.status);
  } catch (error) {
    let tempError = error;
    if (axios.isAxiosError(error)) {
      tempError = error.response?.data;
      onError?.(error.response?.data, error.response?.status!);
    }
    logger.error(tempError);
  }
};
