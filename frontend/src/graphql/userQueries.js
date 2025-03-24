// frontend/src/graphql/userQueries.js

import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
      description
      age
      gender
      photoUrl
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      description
      age
      gender
      photoUrl
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $description: String
    $age: Int
    $gender: String
    $photoUrl: String
  ) {
    updateProfile(
      description: $description
      age: $age
      gender: $gender
      photoUrl: $photoUrl
    ) {
      id
      description
      age
      gender
      photoUrl
    }
  }
`;
