// backend/src/graphql/typeDefs/userPhoto.js
import { gql } from "apollo-server-express";

const userPhotoTypeDefs = gql`
  scalar Upload

  type Photo {
    id: ID!
    filePath: String!
    position: Int!
  }

  extend type User {
    photos: [Photo!]!
  }

  extend type Mutation {
    uploadUserPhotos(files: [Upload!]!): [Photo!]!
    deleteUserPhoto(photoId: ID!): Boolean!
    reorderUserPhotos(order: [ID!]!): [Photo!]!
  }
`;

export default userPhotoTypeDefs;
