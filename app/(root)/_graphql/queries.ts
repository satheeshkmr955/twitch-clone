"use client";

import { graphql } from "@/gql";

export const UserDetails = graphql(/* GraphQL */ `
  fragment UserDetails on User {
    id
    name
    email
    slugName
  }
`);

export const ToastDetails = graphql(/* GraphQL */ `
  fragment ToastDetails on Toast {
    text
    type
  }
`);

export const StreamDetails = graphql(/* GraphQL */ `
  fragment StreamDetails on Stream {
    id
    name
    thumbnailUrl
    ingressId
    serverUrl
    streamKey
    isLive
    isChatEnabled
    isChatDelayed
    isChatFollowersOnly
    userId
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

export const GetUserByNameWithAllDetails = graphql(/* GraphQL */ `
  query GetUserByNameWithAllDetails($input: GetUserByNameWithAllDetailsInput!) {
    getUserByNameWithAllDetails(input: $input) {
      user {
        ...UserDetails
      }
      isFollowing
      isBlocked
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
        ...ToastDetails
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
        ...ToastDetails
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

export const IsBlockedByUser = graphql(/* GraphQL */ `
  query IsBlockedByUser($input: IsBlockedByUserInput!) {
    isBlockedByUser(input: $input) {
      isBlocked
    }
  }
`);

export const BlockUser = graphql(/* GraphQL */ `
  mutation BlockUser($input: BlockUserInput!) {
    blockUser(input: $input) {
      block {
        id
        blocked {
          ...UserDetails
        }
      }
      toast {
        ...ToastDetails
      }
    }
  }
`);

export const UnBlockUser = graphql(/* GraphQL */ `
  mutation UnBlockUser($input: UnBlockUserInput!) {
    unBlockUser(input: $input) {
      block {
        id
        blocked {
          ...UserDetails
        }
      }
      toast {
        ...ToastDetails
      }
    }
  }
`);

export const GetSelfByName = graphql(/* GraphQL */ `
  query GetSelfByName($input: GetSelfByNameInput!) {
    getSelfByName(input: $input) {
      ...UserDetails
    }
  }
`);

export const GetStreamByUserId = graphql(/* GraphQL */ `
  query GetStreamByUserId($input: GetStreamByUserIdInput!) {
    getStreamByUserId(input: $input) {
      ...StreamDetails
    }
  }
`);

export const UpdateStream = graphql(/* GraphQL */ `
  mutation UpdateStream($input: UpdateStreamInput!) {
    updateStream(input: $input) {
      stream {
        ...StreamDetails
      }
      toast {
        ...ToastDetails
      }
    }
  }
`);

export const CreateIngress = graphql(/* GraphQL */ `
  mutation CreateIngress($input: CreateIngressInput!) {
    createIngress(input: $input) {
      stream {
        ...StreamDetails
      }
      toast {
        ...ToastDetails
      }
    }
  }
`);

export const ResetIngress = graphql(/* GraphQL */ `
  mutation ResetIngress($input: ResetIngressInput!) {
    resetIngress(input: $input) {
      stream {
        ...StreamDetails
      }
      toast {
        ...ToastDetails
      }
    }
  }
`);
