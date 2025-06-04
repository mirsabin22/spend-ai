"use client"

import { getBestLocale } from "@/app/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { formatDistanceToNow, startOfWeek, endOfWeek } from "date-fns"
import { format } from "date-fns"
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
import { getCategoryBreakdownAction, getTopExpensesAction, getUserAction } from "@/app/actions"
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/app/constants"
import DatePickerWithRange from "@/app/components/DatePickerWithRange"
import type { DateRange } from "react-day-picker"
import { useAutoAnimate } from "@formkit/auto-animate/react";

export function CategoryAnalysis() {
  const [parent] = useAutoAnimate();  // animation
  const [userCurrency, setUserCurrency] = useState<string>()

  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }),
    to: endOfWeek(new Date(), { weekStartsOn: 1 }),
  })

  const [limit, setLimit] = useState("5")

  const [categoryData, setCategoryData] = useState<{
    category: string;
    amount: number;
    percentage: number;
  }[]>([])

  const [topExpenses, setTopExpenses] = useState<{
    name: string;
    amount: number;
    originalCurrency: string;
    convertedAmount: number;
    convertedCurrency: string;
    category: string;
    createdAt: string;
  }[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserAction()
      setUserCurrency(user?.currency)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!date?.from || !date?.to) return

      const data = await getCategoryBreakdownAction(date.from, date.to)
      setCategoryData(data)

      const topExpenses = await getTopExpensesAction({ limit: Number(limit), startDate: date.from, endDate: date.to })
      setTopExpenses(topExpenses.map((expense) => ({
        name: expense.name,
        amount: expense.amount,
        originalCurrency: expense.currency,
        convertedAmount: expense.convertedAmount,
        convertedCurrency: expense.convertedCurrency,
        category: expense.category,
        createdAt: expense.createdAt.toISOString(),
      })))
    }
    fetchData()
  }, [date, limit])

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-wrap items-center gap-4 justify-between">
        <DatePickerWithRange date={date} setDate={setDate} />
        <Select
          onValueChange={(value) => {
            const now = new Date()
            if (value === "today") {
              setDate({ from: startOfToday(), to: endOfToday() })
            } else if (value === "this_week") {
              setDate({
                from: startOfWeek(now, { weekStartsOn: 1 }),
                to: endOfWeek(now, { weekStartsOn: 1 }),
              })
            } else if (value === "this_month") {
              setDate({ from: startOfMonth(now), to: endOfMonth(now) })
            } else if (value === "this_year") {
              setDate({ from: startOfYear(now), to: endOfYear(now) })
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
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={parent} className="space-y-4">
            {categoryData.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No expenses found starting from {date?.from ? format(date.from, "PPP") : "the selected date"}.
              </p>
            ) : (
              categoryData.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {CATEGORY_ICONS[category.category as keyof typeof CATEGORY_ICONS]}
                      </span>
                      <span className="text-sm font-medium">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {category.amount.toLocaleString(getBestLocale(), {
                          style: "currency",
                          currency: userCurrency,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">({category.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${CATEGORY_COLORS[category.category as keyof typeof CATEGORY_COLORS]}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Top Expenses</CardTitle>
          <Select value={limit} onValueChange={setLimit}>
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
            {topExpenses.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No expenses found starting from {date?.from ? format(date.from, "PPP") : "the selected date"}.
              </p>
            ) : (
              topExpenses.map((expense, i) => (
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
                        currency: expense.originalCurrency,
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
    </div>
  )
}
