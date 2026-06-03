// One place to swap when the new domain ships.
export const SITE_URL = "https://spuk.lovable.app";
export const SITE_NAME = "Lexora";

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
