import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

import { Error, Success, Toast, ToastTypes } from "@/app/_types";
import { getSession } from "./auth";

export const axiosGraphQL = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
  method: "POST",
  headers: { "content-type": "application/json" },
});

axiosGraphQL.interceptors.request.use(
  async function (config) {
    const isServer = typeof window === "undefined";
    if (isServer) {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers["Authorization"] = `Bearer ${session.accessToken}`;
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosGraphQL.interceptors.response.use(
  function (response) {
    if (response.data?.errors) {
      return Promise.reject(response.data?.errors);
    }
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
      const toastByType = toast[
        toastObj.type as ToastTypes
      ] as typeof toast.success;
      toastByType(toastObj.text);
    }
    return response;
  },
  function (error: AxiosError) {
    const data = error.response?.data as Error;
    if (data?.toast !== undefined) {
      const toastObj = data?.toast as Toast;
      const toastByType = toast[
        toastObj.type as ToastTypes
      ] as typeof toast.success;
      toastByType(toastObj.text);
    }
    return Promise.reject(error);
  }
);
