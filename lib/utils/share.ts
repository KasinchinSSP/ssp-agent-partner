export function makeLineShareUrl(url: string, text?: string) {
  const shareUrl = text
    ? `https://line.me/R/msg/text/?${encodeURIComponent(`${text}\n${url}`)}`
    : `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        url
      )}`;
  return shareUrl;
}

export async function tryNativeShare({
  title,
  text,
  url,
}: {
  title?: string;
  text?: string;
  url: string;
}) {
  if (typeof navigator !== "undefined" && (navigator as any).share) {
    try {
      await (navigator as any).share({ title, text, url });
      return true;
    } catch {}
  }
  return false;
}
