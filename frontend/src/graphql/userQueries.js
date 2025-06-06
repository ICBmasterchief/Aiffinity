// frontend/src/graphql/userMutations.js

import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      description
      age
      gender
      searchGender
      searchMinAge
      searchMaxAge
      mainPhoto
      photos {
        id
        filePath
        position
      }
      hasAIProfile
    }
  }
`;

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
    $searchMinAge: Int
    $searchMaxAge: Int
  ) {
    updateProfile(
      description: $description
      age: $age
      gender: $gender
      searchGender: $searchGender
      searchMinAge: $searchMinAge
      searchMaxAge: $searchMaxAge
    ) {
      id
      description
      age
      gender
      searchGender
      searchMinAge
      searchMaxAge
    }
  }
`;
