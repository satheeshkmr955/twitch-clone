import axios from "axios";

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
