"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Trash } from "lucide-react"
import DirectInput from "./direct-input"
import CategoryBadge from "./category-badges"
import ExpenseModal from "./expense-modal"
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

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const result = await getTransactionsAction()
        setTransactions(result)
    }

    const onSubmit = async () => {
        if (!text.trim()) return
        await createTransactionFromTextAction(text)
        setText("")
        await fetchData()
    }

    const onDelete = async (id: string) => {
        await deleteTransactionAction(id)
        await fetchData()
    }

    const onSave = async (updated: Expense) => {
        await updateTransactionAction(updated)
        await fetchData()
    }

    const formatDateTime = (iso: string) => {
        const date = new Date(iso)
        const now = new Date()

        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()

        const time = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })

        if (isToday) {
            return time
        }

        const day = date.toLocaleDateString("en-US", { weekday: "long" })
        const fullDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        })

        return `${time}, ${day}, ${fullDate}`
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

    return (
        <div className="space-y-6">
            <DirectInput inputText={text} setInputText={setText} onSubmit={onSubmit} />

            <div className="space-y-2">
                <h2 className="text-lg font-semibold mb-2">Today's Expenses</h2>
                {transactions
                    .filter(tx => isToday(tx.createdAt))
                    .map((tx) => (
                        <Card
                            key={tx.id}
                            onClick={() => setSelectedExpense(tx)}
                            className="cursor-pointer hover:shadow-md transition"
                        >
                            <CardContent className="px-4 py-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold">{tx.name}</div>
                                        <div className="text-sm text-muted-foreground">{tx.description}</div>
                                        <div className="text-xs text-muted-foreground">{formatDateTime(tx.createdAt)}</div>
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
                                        {tx.currency} {tx.amount.toLocaleString()}
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
