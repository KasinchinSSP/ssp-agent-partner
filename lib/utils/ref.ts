export function withRef(path: string, ref?: string | null) {
  if (!ref) return path;
  const hasQ = path.includes("?");
  return `${path}${hasQ ? "&" : "?"}ref=${encodeURIComponent(ref)}`;
}
