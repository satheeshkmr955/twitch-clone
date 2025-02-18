import { print, type ExecutionResult } from "graphql";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  useQuery,
  type UseQueryResult,
  useMutation,
  type UseMutationResult,
  UseMutationOptions,
  type UseSuspenseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { HttpStatusCode } from "axios";

import { axiosGraphQL } from "@/lib/fetcher";
import { logger } from "@/lib/logger";
import { getServerQueryClient } from "@/lib/queryclient";

/** Your custom fetcher function */
async function customFetcher<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables extends Record<string, never> ? {} : TVariables
): Promise<ExecutionResult<TResult>> {
  try {
    const responseAxios = await axiosGraphQL({
      data: {
        query: print(document),
        variables,
      },
    });

    if (responseAxios.status !== HttpStatusCode.Ok) {
      const error = `Failed to fetch: ${responseAxios.statusText}. Body: ${responseAxios.request?.responseText}`;
      logger.error(error);
    }

    return await responseAxios.data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables extends Record<string, never> ? {} : TVariables
): UseQueryResult<ExecutionResult<TResult>> {
  return useQuery({
    queryKey: [getCacheKey(document), variables],
    queryFn: () => customFetcher(document, variables!),
  });
}

export function useSuspenseQueryGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables extends Record<string, never> ? {} : TVariables
): UseSuspenseQueryResult<ExecutionResult<TResult>> {
  return useSuspenseQuery({
    queryKey: [getCacheKey(document), variables],
    queryFn: () => customFetcher(document, variables!),
  });
}

export async function getServerGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables extends Record<string, never> ? {} : TVariables
) {
  const clientQuery = getServerQueryClient();
  await clientQuery.prefetchQuery({
    queryKey: [getCacheKey(document), variables],
    queryFn: () => customFetcher(document, variables!),
  });
  return clientQuery;
}

export function useMutationGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables extends Record<string, never> ? {} : TVariables,
  mutateOptions?: UseMutationOptions<ExecutionResult<TResult>>
): UseMutationResult<ExecutionResult<TResult>, Error, void, unknown> {
  return useMutation({
    mutationKey: [getCacheKey(document), variables],
    mutationFn: () => customFetcher(document, variables),
    ...mutateOptions,
  });
}

export function getCacheKey<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>
) {
  return (document.definitions[0] as any).name.value;
}
