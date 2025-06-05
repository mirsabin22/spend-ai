"use client"

import { startOfWeek, endOfWeek } from "date-fns"
import {
  startOfToday,
  endOfToday,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DatePickerWithRange from "@/app/components/DatePickerWithRange"
import type { DateRange } from "react-day-picker"
import CategoryBreakdown from "./category-breaksown"
import TopExpenses from "./top-expenses"
import { useQuery, useQueryClient } from "@tanstack/react-query"

// use query date range
const getDateRangeQuery = () => {
    const queryClient = useQueryClient()
    const dateRangeQuery = useQuery({
        queryKey: ['dateRange'],
        queryFn: async () => {
            return queryClient.getQueryData<DateRange | undefined>(['dateRange'])
        },
        initialData: {
          // this week
            from: startOfWeek(new Date(), { weekStartsOn: 1 }),
            to: endOfWeek(new Date(), { weekStartsOn: 1 })
        },
    })
    const setDateRange = (dateRange: DateRange | undefined ) => {
        queryClient.setQueryData(['dateRange'], dateRange)
    }
    return { query: dateRangeQuery, setDateRange }
}

export default function CategoryAnalysis() {
  const { query: dateRangeQuery, setDateRange } = getDateRangeQuery()

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-wrap items-center gap-4 justify-between">
        <DatePickerWithRange date={dateRangeQuery.data} setDate={setDateRange} />
        <Select
          onValueChange={(value) => {
            const now = new Date()
            if (value === "today") {
              setDateRange({ from: startOfToday(), to: endOfToday() })
            } else if (value === "this_week") {
              setDateRange({
                from: startOfWeek(now, { weekStartsOn: 1 }),
                to: endOfWeek(now, { weekStartsOn: 1 }),
              })
            } else if (value === "this_month") {
              setDateRange({ from: startOfMonth(now), to: endOfMonth(now) })
            } else if (value === "this_year") {
              setDateRange({ from: startOfYear(now), to: endOfYear(now) })
            }
          }}
        >
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Quick select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CategoryBreakdown dateRange={dateRangeQuery.data} />

      <TopExpenses dateRange={dateRangeQuery.data} />
    </div>
  )
}
