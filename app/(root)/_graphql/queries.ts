"use client";

import { graphql } from "@/gql";

export const UserDetails = graphql(/* GraphQL */ `
  fragment UserDetails on User {
    id
    name
    email
  }
`);

export const PaginationDetails = graphql(/* GraphQL */ `
  fragment PaginationDetails on Pagination {
    totalRecords
    currentLimit
    currentPage
    hasNextPage
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
        ...PaginationDetails
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

export const GetFollowedUsers = graphql(/* GraphQL */ `
  query GetFollowedUsers {
    getFollowedUsers {
      items {
        id
        following {
          ...UserDetails
        }
      }
    }
  }
`);

export const GetFollowedAndRecommendedUser = graphql(/* GraphQL */ `
  query GetFollowedAndRecommendedUser($input: GetRecommendedInput!) {
    getFollowedUsers {
      items {
        id
        following {
          ...UserDetails
        }
      }
    }
    getRecommended(input: $input) {
      items {
        ...UserDetails
        image
      }
      pagination {
        ...PaginationDetails
      }
    }
  }
`);
