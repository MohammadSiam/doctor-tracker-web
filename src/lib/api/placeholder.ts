import type { QueryKey } from "@tanstack/react-query"

const withoutPage = (key: QueryKey) =>
  JSON.stringify(key.map((part) => (part && typeof part === "object" ? { ...part, page: undefined } : part)))

/**
 * `placeholderData` that keeps the previous rows only while paging through the same list.
 * A new search, filter or sort shows skeletons instead of the old results, which would look
 * like an (incorrect) answer to the new query.
 */
export const keepPreviousPage =
  (queryKey: QueryKey) =>
  <T>(previous: T | undefined, previousQuery?: { queryKey: QueryKey }) =>
    previousQuery && withoutPage(previousQuery.queryKey) === withoutPage(queryKey) ? previous : undefined
