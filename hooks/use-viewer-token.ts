"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

import { useMutationGraphQL } from "@/hooks/use-graphql";
import { SOMETHING_WENT_WRONG } from "@/constants/message.constants";
import { CreateViewerTokenDocument } from "@/gql/graphql";
import { logger } from "@/lib/logger";

export const useViewerToken = (hostIdentity: string) => {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");

  const { mutate } = useMutationGraphQL(
    CreateViewerTokenDocument,
    {
      input: { hostIdentity },
    },
    {
      onSuccess: (data) => {
        const viewToken = data.data?.createViewerToken.token || null;
        if (viewToken) {
          setToken(viewToken);

          const decodedToken = jwtDecode(viewToken) as JwtPayload & {
            name?: string;
          };

          const name = decodedToken.name;
          const identity = decodedToken.sub;

          if (identity) {
            setIdentity(identity);
          }

          if (name) {
            setName(name);
          }
        }
      },
      onError(error) {
        console.error(error);
        logger.error(error);
        toast.error(SOMETHING_WENT_WRONG);
      },
    }
  );

  useEffect(() => {
    mutate();
  }, [hostIdentity, mutate]);

  return { token, name, identity };
};
