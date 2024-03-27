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

export const UserCountDetails = graphql(/* GraphQL */ `
  fragment UserCountDetails on UserCount {
    followedBy
  }
`);

export const UserPublicDetails = graphql(/* GraphQL */ `
  fragment UserPublicDetails on UserPublic {
    id
    name
    email
    slugName
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

export const StreamPublicDetailsWithUser = graphql(/* GraphQL */ `
  fragment StreamPublicDetailsWithUser on StreamPublicWithUser {
    id
    name
    thumbnailUrl
    isLive
    userId
  }
`);

export const StreamPublicDetails = graphql(/* GraphQL */ `
  fragment StreamPublicDetails on StreamPublic {
    isLive
  }
`);

export const UserWithStreamDetails = graphql(/* GraphQL */ `
  fragment UserWithStreamDetails on User {
    ...UserDetails
    stream {
      ...StreamDetails
    }
  }
`);

export const UserPublicWithStreamDetails = graphql(/* GraphQL */ `
  fragment UserPublicWithStreamDetails on UserPublic {
    ...UserPublicDetails
    stream {
      ...StreamPublicDetails
    }
  }
`);

export const ToastDetails = graphql(/* GraphQL */ `
  fragment ToastDetails on Toast {
    text
    type
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
        ...UserPublicDetails
        image
        stream {
          ...StreamPublicDetails
        }
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
        stream {
          ...StreamDetails
        }
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
          ...UserPublicWithStreamDetails
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
          ...UserPublicDetails
        }
      }
    }
    getRecommended(input: $input) {
      items {
        ...UserPublicDetails
        image
        stream {
          ...StreamPublicDetails
        }
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
      bio
      stream {
        ...StreamDetails
      }
      _count {
        ...UserCountDetails
      }
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

export const CreateViewerToken = graphql(/* GraphQL */ `
  mutation CreateViewerToken($input: CreateViewerTokenInput!) {
    createViewerToken(input: $input) {
      token
    }
  }
`);

export const UpdateUser = graphql(/* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        ...UserDetails
        bio
      }
      toast {
        ...ToastDetails
      }
    }
  }
`);

export const GetStreams = graphql(/* GraphQL */ `
  query GetStreams {
    getStreams {
      streams {
        ...StreamPublicDetailsWithUser
        user {
          ...UserDetails
        }
      }
    }
  }
`);
