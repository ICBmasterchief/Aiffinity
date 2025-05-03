// frontend/src/utils/photoUrl.js
export function photoUrl(path = "") {
  if (!path) return "/default.jpg";

  if (path.startsWith("http")) {
    try {
      const { pathname } = new URL(path);
      return pathname;
    } catch {
      return path;
    }
  }

  return path.startsWith("/") ? path : `/${path}`;
}
