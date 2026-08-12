const ALIASED_SSL_MODES = new Set(["prefer", "require", "verify-ca"]);

export function resolveDatabaseUrl(rawUrl: string | undefined): string | undefined {
  if (!rawUrl) return rawUrl;

  const url = new URL(rawUrl);
  const sslmode = url.searchParams.get("sslmode");
  if (sslmode && ALIASED_SSL_MODES.has(sslmode)) {
    url.searchParams.set("sslmode", "verify-full");
  }
  return url.toString();
}
