/** Raw attribution value from a query string, or null when absent. */
export function sourceFromSearch(search: string): string | null {
  const v = new URLSearchParams(search).get("source");
  return v && v.trim() ? v.trim().slice(0, 40) : null;
}

const KEY = "openmaps_source";

/**
 * Resolve attribution for this visit. A ?source= value wins and is remembered for the
 * session, so a visitor who reads /privacy and comes back is still attributed correctly.
 */
export function resolveSource(search: string, storage?: Pick<Storage, "getItem" | "setItem">): string {
  const fromUrl = sourceFromSearch(search);
  try {
    if (fromUrl) {
      storage?.setItem(KEY, fromUrl);
      return fromUrl;
    }
    return storage?.getItem(KEY) ?? "direct";
  } catch {
    return fromUrl ?? "direct";
  }
}
