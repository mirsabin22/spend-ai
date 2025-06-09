"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CATEGORY_COLORS } from "@/app/constants"
import { getTransactionsAction } from "@/app/actions"

type Transaction = {
    id: string
    name: string
    description: string | null
    amount: number
    currency: string
    category: string
    userId: string
    createdAt: Date
    updatedAt: Date
    convertedAmount: number
    convertedCurrency: string
    date: string
}

export function HistoryView() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3

    const fetchTransactions = async () => {
        const { data, total } = await getTransactionsAction({
            search: searchQuery,
            category: categoryFilter === "all" ? undefined : categoryFilter,
            page: currentPage,
            limit: itemsPerPage,
        })

        const formatted = data.map((tx: any) => ({
            ...tx,
            date: new Date(tx.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        }))

        setTransactions(formatted)
        setTotalCount(total)
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, categoryFilter])

    useEffect(() => {
        fetchTransactions()
    }, [searchQuery, categoryFilter, currentPage])

    const totalPages = Math.ceil(totalCount / itemsPerPage)

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search transactions..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="transport">Transportation</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="health and fitness">Health</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {transactions.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No transactions found.</p>
                        ) : (
                            transactions.reduce((acc, transaction, i, arr) => {
                                const date = transaction.date
                                const prevDate = i > 0 ? arr[i - 1].date : null

                                if (i === 0 || date !== prevDate) {
                                    acc.push(
                                        <div key={`date-${i}`} className="pt-2 first:pt-0">
                                            <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
                                        </div>
                                    )
                                }

                                acc.push(
                                    <div key={transaction.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                                        <div>
                                            <p className="font-medium">{transaction.name}</p>
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    CATEGORY_COLORS[transaction.category as keyof typeof CATEGORY_COLORS] ??
                                                    "bg-gray-100 text-gray-800"
                                                }
                                            >
                                                {transaction.category}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground mt-1">{transaction.description}</p>
                                        </div>
                                        <p className="font-medium">
                                            {transaction.convertedCurrency} {transaction.convertedAmount.toLocaleString()}
                                        </p>
                                    </div>
                                )

                                return acc
                            }, [] as React.ReactNode[])
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-end pt-6 space-x-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                                disabled={currentPage >= totalPages}
                                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
