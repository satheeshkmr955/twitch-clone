"use client";

import { graphql } from "@/gql";

export const UserDetails = graphql(/* GraphQL */ `
  fragment UserDetails on User {
    id
    image
    name
    email
  }
`);

export const GetRecommendedUsers = graphql(/* GraphQL */ `
  query GetRecommended($input: GetRecommendedInput) {
    getRecommended(input: $input) {
      items {
        ...UserDetails
      }
      pagination {
        totalRecords
        currentLimit
        currentPage
        hasNextPage
      }
    }
  }
`);
