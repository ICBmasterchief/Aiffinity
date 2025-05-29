// frontend/src/graphql/photoMutations.js
import { gql } from "@apollo/client";

export const UPLOAD_PHOTOS = gql`
  mutation Upload($files: [Upload!]!) {
    uploadUserPhotos(files: $files) {
      id
      filePath
      position
    }
  }
`;

export const DELETE_PHOTO = gql`
  mutation Del($photoId: ID!) {
    deleteUserPhoto(photoId: $photoId)
  }
`;

export const REORDER_PHOTOS = gql`
  mutation Reorder($order: [ID!]!) {
    reorderUserPhotos(order: $order) {
      id
      position
    }
  }
`;
