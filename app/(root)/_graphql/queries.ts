"use client";

import { graphql } from "@/gql";

export const UserDetails = graphql(/* GraphQL */ `
  fragment UserDetails on User {
    id
    name
    email
  }
`);

export const GetRecommendedUsers = graphql(/* GraphQL */ `
  query GetRecommended($input: GetRecommendedInput) {
    getRecommended(input: $input) {
      items {
        ...UserDetails
        image
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

export const isFollowingUser = graphql(/* GraphQL */ `
  query IsFollowingUser($input: IsFollowingUserInput!) {
    isFollowingUser(input: $input) {
      isFollowing
    }
  }
`);

export const GetUserByNameWithFollowingStatus = graphql(/* GraphQL */ `
  query GetUserByNameWithFollowingStatus(
    $input: GetUserByNameWithFollowingStatus!
  ) {
    getUserByNameWithFollowingStatus(input: $input) {
      user {
        ...UserDetails
      }
      isFollowing
    }
  }
`);

export const GetUserByName = graphql(/* GraphQL */ `
  query GetUserByName($input: GetUserByNameInput!) {
    getUserByName(input: $input) {
      ...UserDetails
    }
  }
`);

export const FollowUser = graphql(/* GraphQL */ `
  mutation FollowUser($input: FollowUserInput!) {
    followUser(input: $input) {
      follow {
        id
        followerId
        followingId
        follower {
          ...UserDetails
        }
        following {
          ...UserDetails
        }
      }
      toast {
        text
        type
      }
    }
  }
`);

export const UnFollowUser = graphql(/* GraphQL */ `
  mutation UnFollowUser($input: FollowUserInput!) {
    unFollowUser(input: $input) {
      follow {
        id
        followerId
        followingId
        following {
          ...UserDetails
        }
      }
      toast {
        text
        type
      }
    }
  }
`);
