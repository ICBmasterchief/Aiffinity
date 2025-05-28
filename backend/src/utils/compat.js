// backend/src/utils/compat.js

export const toF32 = (buf) =>
  new Float32Array(
    buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  );

export const cosine = (a, b) => {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

export const compatScore = (cos) => {
  const y = 1 / (1 + Math.exp(-12 * (cos - 0.7)));
  return Math.round(y * 100);
};

export const compatBetween = (profA, profB) => {
  if (!profA || !profB) return null;
  const cos = cosine(toF32(profA.embedding), toF32(profB.embedding));
  return compatScore(cos);
};
