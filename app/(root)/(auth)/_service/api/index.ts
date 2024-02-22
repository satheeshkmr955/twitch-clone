import axios from "axios";

import { CHECK_EMAIL_EXISTS, SIGNUP_EXISTS } from "@/constants/api.constants";
import { publicAxios } from "@/lib/fetcher";
import {
  CheckEmailExistsSuccess,
  CheckEmailsExistsInput,
  SignupError,
  SignupInput,
  SignupSuccess,
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
    const data: CheckEmailExistsSuccess = response.data;
    return data.isEmailExists;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.error(error);
    }
    return false;
  }
};

export type SignUpApiProps = {
  body: SignupInput;
  onSuccess: (data: SignupSuccess, statusCode: number) => void;
  onError: (error: SignupError | SignupSuccess, statusCode: number) => void;
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
    if (axios.isAxiosError(error)) {
      onError?.(error.response?.data, error.response?.status!);
    } else {
      console.error(error);
    }
  }
};
