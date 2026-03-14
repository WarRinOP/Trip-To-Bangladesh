/**
 * Ping search engines via IndexNow protocol when new content is published.
 * Call after publishing a new blog post or major page update.
 */
export async function pingSearchEngines(url: string): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;

  const encodedUrl = encodeURIComponent(url);

  const pings = [
    `https://www.bing.com/indexnow?url=${encodedUrl}&key=${key}`,
    `https://api.indexnow.org/indexnow?url=${encodedUrl}&key=${key}`,
    `https://yandex.com/indexnow?url=${encodedUrl}&key=${key}`,
  ];

  await Promise.allSettled(
    pings.map((ping) =>
      fetch(ping, { method: 'GET' }).catch(() => null)
    )
  );
}
