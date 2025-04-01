// frontend/src/graphql/userMutations.js

import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $description: String
    $age: Int
    $gender: String
    $searchGender: String
    $photoUrl: String
  ) {
    updateProfile(
      description: $description
      age: $age
      gender: $gender
      searchGender: $searchGender
      photoUrl: $photoUrl
    ) {
      id
      description
      age
      gender
      searchGender
      photoUrl
    }
  }
`;
