// frontend/src/utils/photoUrl.js
export function photoUrl(path = "") {
  if (!path) return "/default.jpg";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return path.startsWith("/") ? path : `/${path}`;
}
