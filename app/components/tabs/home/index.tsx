"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Trash } from "lucide-react"
import DirectInput from "./direct-input"
import CategoryBadge from "./category-badges"
import ExpenseModal from "./expense-modal"
import { formatDistanceToNow } from "date-fns"
import {
    createTransactionFromTextAction,
    getTransactionsAction,
    deleteTransactionAction,
    updateTransactionAction,
} from "@/app/actions"

type Expense = {
    id: string
    name: string
    description: string
    category: string
    amount: number
    currency: string
    createdAt: string
}

export default function HomeTab() {
    const [text, setText] = useState("")
    const [transactions, setTransactions] = useState<Expense[]>([])
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [loading, setLoading] = useState(false)  // Loading state

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)              // Start loading
        const result = await getTransactionsAction()
        setTransactions(result.map(tx => ({
            ...tx,
            description: tx.description || "",
            createdAt: tx.createdAt.toISOString(),
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
        .sort((a, b) => (sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount))

    const uniqueCategories = Array.from(new Set(transactions.map(tx => tx.category)))

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
                <select
                    className="border px-3 py-1 rounded-md text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={loading}
                >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <select
                    className="border px-3 py-1 rounded-md text-sm"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    disabled={loading}
                >
                    <option value="asc">Amount: Low to High</option>
                    <option value="desc">Amount: High to Low</option>
                </select>
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold mb-2 mt-4">Today's Expenses</h2>

                {loading
                    ? // Show 4 skeleton cards while loading
                    Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                    : filteredAndSorted.map((tx) => (
                        <Card
                            key={tx.id}
                            onClick={() => setSelectedExpense(tx)}
                            className="cursor-pointer hover:shadow-md transition"
                        >
                            <CardContent className="px-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold"> {tx.name.length > 30 ? tx.name.slice(0, 30) + "..." : tx.name}</div>
                                        <div className="text-sm text-muted-foreground"> {tx.description.length > 30 ? tx.description.slice(0, 30) + "..." : tx.description}</div>
                                        <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}</div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete(tx.id)
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-2 flex justify-between text-sm">
                                    <CategoryBadge category={tx.category} />
                                    <span>
                                        {tx.amount.toLocaleString()} {tx.currency}
                                    </span>
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
