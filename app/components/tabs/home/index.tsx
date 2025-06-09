"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DirectInput from "./direct-input"
import CategoryBadge from "./category-badges"
import ExpenseModal from "./expense-modal"
import { formatDistanceToNow } from "date-fns"
import {
  createTransactionFromTextAction,
  getTransactionsAction,
  deleteTransactionAction,
  updateTransactionAction,
  getUserAction,
} from "@/app/actions"
import { getBestLocale } from "@/app/utils"
import { ChevronRight, ChevronUp, ChevronDown, PieChart } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/app/constants"
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Expense = {
  id: string
  name: string
  description: string
  category: string
  amount: number
  currency: string
  convertedAmount: number
  convertedCurrency: string
  createdAt: string
}

export default function HomeTab() {
  const [userCurrency, setUserCurrency] = useState<string>()
  const [text, setText] = useState("")
  const [transactions, setTransactions] = useState<Expense[]>([])
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "newest">("newest")
  const [loading, setLoading] = useState(false)  // Loading state
  const [isExpanded, setIsExpanded] = useState(false)
  const [parent] = useAutoAnimate();  // animation

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)              // Start loading
    const user = await getUserAction()
    setUserCurrency(user?.currency)
    // Set startOfDay and endOfDay for today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const result = await getTransactionsAction({
      startDate: startOfDay,
      endDate: endOfDay,
    })
    setTransactions(result.data.map(tx => ({
      ...tx,
      description: tx.description || "",
      createdAt: tx.createdAt.toISOString(),
      convertedAmount: tx.convertedAmount,
      convertedCurrency: tx.convertedCurrency,
    })))
    setLoading(false)             // End loading
  }

  const onSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    await createTransactionFromTextAction(text)
    setText("")
    await fetchData()
    setLoading(false)
  }

  const onDelete = async (id: string) => {
    setLoading(true)
    await deleteTransactionAction(id)
    await fetchData()
    setLoading(false)
  }

  const onSave = async (updated: Expense) => {
    setLoading(true)
    await updateTransactionAction(updated)
    await fetchData()
    setLoading(false)
  }

  const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  }

  const filteredAndSorted = transactions
    .filter(tx => isToday(tx.createdAt))
    .filter(tx => selectedCategory === "all" || tx.category === selectedCategory)
    .sort((a, b) => {
      if (sortOrder === "asc") return a.amount - b.amount
      if (sortOrder === "desc") return b.amount - a.amount
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // newest
    })

  const uniqueCategories = Array.from(new Set(transactions.map(tx => tx.category)))

  const totalSpent = filteredAndSorted.reduce((sum, tx) => sum + tx.convertedAmount, 0)

  const categoryMap = new Map<string, number>()
  filteredAndSorted.forEach(tx => {
    categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.convertedAmount)
  })
  const categoryTotals = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
  }))

  const getCategoryBarColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: CATEGORY_COLORS.Food,
      Transportation: CATEGORY_COLORS.Transportation,
      Shopping: CATEGORY_COLORS.Shopping,
      "Health and Fitness": CATEGORY_COLORS["Health and Fitness"],
      Entertainment: CATEGORY_COLORS.Entertainment,
      Education: CATEGORY_COLORS.Education,
      Utilities: CATEGORY_COLORS.Utilities,
      Other: CATEGORY_COLORS.Other,
    }
    return colors[category] || "bg-gray-400"
  }

  // Skeleton loader component for placeholder cards
  const SkeletonCard = () => (
    <Card className="animate-pulse">
      <CardContent className="px-4 py-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-full">
            <div className="h-5 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-5 w-5 bg-gray-300 rounded"></div>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="h-5 bg-gray-300 rounded w-16"></div>
          <div className="h-5 bg-gray-300 rounded w-10"></div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <DirectInput inputText={text} setInputText={setText} onSubmit={onSubmit} />

      <div className="flex items-center justify-between mb-2 gap-4 flex-wrap">
        <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={loading}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={(val) => setSortOrder(val as "asc" | "desc" | "newest")} disabled={loading}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Low to High</SelectItem>
            <SelectItem value="desc">High to Low</SelectItem>
            <SelectItem value="newest">Latest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-none shadow-sm transition-all duration-200 cursor-pointer mt-4" onClick={() => setIsExpanded(!isExpanded)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Today's Overview</CardTitle>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-bold">
                {totalSpent.toLocaleString(getBestLocale(), {
                  style: "currency",
                  currency: userCurrency || "USD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-muted-foreground">spent today</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{filteredAndSorted.length} transactions</p>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Category Breakdown</p>
              </div>

              {categoryTotals.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{CATEGORY_ICONS[category.category as keyof typeof CATEGORY_ICONS]} {category.category}</span>
                    <span>
                      {category.amount.toLocaleString(getBestLocale(), {
                        style: "currency",
                        currency: userCurrency || "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} ({category.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${getCategoryBarColor(category.category)}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div ref={parent} className="space-y-2">
        <h2 className="text-lg font-semibold mb-2 mt-4">Today's Expenses</h2>

        {filteredAndSorted.map((tx) => (
          <Card
            key={tx.id}
            onClick={() => setSelectedExpense(tx)}
            className="cursor-pointer hover:shadow-md transition shadow-none"
          >
            <CardContent className="px-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold"> {tx.name.length > 40 ? tx.name.slice(0, 40) + "..." : tx.name}</div>
                  <div className="text-sm text-muted-foreground"> {tx.description.length > 40 ? tx.description.slice(0, 40) + "..." : tx.description}</div>
                  <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={tx.category} />
                </div>
                {/* show original and converted amount */}
                <div className="text-right">
                  <p className="text-base font-medium">
                    {tx.convertedAmount.toLocaleString(getBestLocale(), {
                      style: "currency",
                      currency: tx.convertedCurrency,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.amount.toLocaleString(getBestLocale(), {
                      style: "currency",
                      currency: tx.currency,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedExpense && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}
