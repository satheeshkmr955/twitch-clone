import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

import { Error, Success, Toast } from "@/app/_types";

export const axiosGraphQL = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
  method: "POST",
  headers: { "content-type": "application/json" },
});

axiosGraphQL.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosGraphQL.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const publicAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/`,
});

publicAxios.interceptors.response.use(
  function (response: AxiosResponse) {
    const data = response.data as Success;
    if (data?.toast !== undefined) {
      const toastObj = data?.toast as Toast;
      const toastByType = toast[toastObj.type] as typeof toast.success;
      toastByType(toastObj.text);
    }
    return response;
  },
  function (error: AxiosError) {
    const data = error.response?.data as Error;
    if (data?.toast !== undefined) {
      const toastObj = data?.toast as Toast;
      const toastByType = toast[toastObj.type] as typeof toast.success;
      toastByType(toastObj.text);
    }
    return Promise.reject(error);
  }
);
