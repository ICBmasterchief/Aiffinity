// frontend/src/utils/photoUrl.js
export function photoUrl(path) {
  if (path.startsWith("http")) {
    try {
      const { pathname } = new URL(path);
      return window.location.origin + pathname;
    } catch {
      return path;
    }
  }
  
  const clean = path.startsWith("/") ? path : `/${path}`;
  return window.location.origin + clean;
}

