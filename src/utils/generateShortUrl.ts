import { v4 as uuidv4 } from "uuid";

/**
 * Stores the url in the database and returns the shortened url
 *
 * @param url The original url to be shortened
 * @returns The shortened url
 */
function generateShortUrl(): string {
  const key = uuidv4();

  const shortenedUrl = `${window.location.origin}/short/${key}`;
  return shortenedUrl;
}

export default generateShortUrl;
