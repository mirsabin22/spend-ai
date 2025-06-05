import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDistanceToNow } from "date-fns"
import { format } from "date-fns"
import { getBestLocale } from "@/app/utils"
import { CATEGORY_COLORS } from "@/app/constants"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getTopExpensesAction } from "@/app/actions"
import { Badge } from "@/components/ui/badge"
import type { DateRange } from "react-day-picker"

const getTopExpensesQuery = (limit: string, startDate: Date | undefined, endDate: Date | undefined) => {
    return useQuery({
      queryKey: ['topExpenses', limit, startDate, endDate],
      queryFn: async () => {
        const expenses = await getTopExpensesAction({ limit: Number(limit), startDate, endDate })
        return expenses
      },
    })
}

const getLimitQuery = () => {
    const queryClient = useQueryClient()
    const limitQuery = useQuery({
        queryKey: ['limitTopExpenses'],
        queryFn: async () => {
            return queryClient.getQueryData<string>(['limitTopExpenses'])
        },
        initialData: "5",
    })
    const setLimit = (limit: string) => {
        queryClient.setQueryData(['limitTopExpenses'], limit)
    }
    return { query: limitQuery, setLimit }
}

export default function TopExpenses(
    {
        dateRange
    }: {
        dateRange: DateRange | undefined;
    }
) {
    const [parent] = useAutoAnimate();
    const { query: limitQuery, setLimit } = getLimitQuery()
    const { data: topExpenses } = getTopExpensesQuery(limitQuery.data ?? "5", dateRange?.from, dateRange?.to)

    return (
        <Card className="border-none shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Top Expenses</CardTitle>
          <Select value={limitQuery.data} onValueChange={setLimit}>
            <SelectTrigger className="h-8 w-20 text-xs">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div ref={parent} className="space-y-3">
            {topExpenses?.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No expenses found starting from {dateRange?.from ? format(dateRange.from, "PPP") : "the selected date"}.
              </p>
            ) : (
              topExpenses?.map((expense, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{expense.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={CATEGORY_COLORS[expense.category as keyof typeof CATEGORY_COLORS]}
                      >
                        {expense.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(expense.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium">
                      {expense.convertedAmount.toLocaleString(getBestLocale(), {
                        style: "currency",
                        currency: expense.convertedCurrency,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {expense.amount.toLocaleString(getBestLocale(), {
                        style: "currency",
                        currency: expense.currency,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
}