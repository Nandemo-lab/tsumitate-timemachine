/** 既存の検索流入が確認できているプログラマティックページだけindexを維持する。 */
export const PROGRAMMATIC_INDEX_EXCEPTIONS = new Set([
  "/orukan/monthly/30000",
]);

export function isProgrammaticIndexException(pathname: string): boolean {
  return PROGRAMMATIC_INDEX_EXCEPTIONS.has(pathname);
}
