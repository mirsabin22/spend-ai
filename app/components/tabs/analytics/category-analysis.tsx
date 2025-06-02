"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { getCategoryBreakdownAction, getTopExpensesAction, getUserAction } from "@/app/actions"
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/app/constants"

export function CategoryAnalysis() {
  const [userCurrency, setUserCurrency] = useState<string>()

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
      const data = await getCategoryBreakdownAction()
      setCategoryData(data)

      const topExpenses = await getTopExpensesAction()
      setTopExpenses(topExpenses.map((expense) => ({
        name: expense.name,
        amount: expense.amount,
        originalCurrency: expense.currency,
        convertedAmount: expense.convertedAmount,
        category: expense.category,
        createdAt: expense.createdAt.toISOString(),
      })))
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{CATEGORY_ICONS[category.category as keyof typeof CATEGORY_ICONS]}</span>
                    <span className="text-sm font-medium">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{category.amount.toLocaleString()} {userCurrency}</span>
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
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topExpenses.map((expense, i) => (
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
                  <p className="text-base font-medium">{expense.convertedAmount.toLocaleString()} {userCurrency}</p>
                  <p className="text-xs text-muted-foreground">
                    {expense.amount.toLocaleString()} {expense.originalCurrency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
