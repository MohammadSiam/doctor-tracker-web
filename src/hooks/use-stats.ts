"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { statsApi } from "@/lib/api/endpoints"
import { queryKeys } from "@/lib/api/query-keys"
import type { TimeseriesRange } from "@/lib/types"

export function useStatsOverview() {
  return useQuery({ queryKey: queryKeys.stats.overview, queryFn: statsApi.overview })
}

export function useTimeseries(range: TimeseriesRange) {
  return useQuery({
    queryKey: queryKeys.stats.timeseries(range),
    queryFn: () => statsApi.timeseries(range),
    placeholderData: keepPreviousData,
  })
}
