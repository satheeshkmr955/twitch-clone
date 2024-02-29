import axios, { AxiosError, AxiosResponse } from "axios";
import { GraphQLError } from "graphql";

import { Error, Success, TriggerToastProps } from "@/app/_types";
import { getSession } from "./auth";
import { triggerToast } from "./utils";

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
    const isClient = typeof window === "object";

    if (response.data?.errors) {
      if (
        Array.isArray(response.data?.errors) &&
        response.data?.errors.length > 0 &&
        isClient
      ) {
        const errors: GraphQLError[] = response.data.errors;

        errors.forEach((error) => {
          triggerToast(error.extensions?.toast as TriggerToastProps);
        });
      }

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
    triggerToast(data?.toast as TriggerToastProps);
    return response;
  },
  function (error: AxiosError) {
    const data = error.response?.data as Error;
    triggerToast(data?.toast as TriggerToastProps);
    return Promise.reject(error);
  }
);
