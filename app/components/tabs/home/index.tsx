"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Trash } from "lucide-react"
import DirectInput from "./direct-input"
import {
    createTransactionFromTextAction,
    getTransactionsAction,
    deleteTransactionAction,
} from "@/app/actions"

export default function HomeTab() {
    const [text, setText] = useState("")
    const [transactions, setTransactions] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const result = await getTransactionsAction()
            setTransactions(result)
        }
        fetchData()
    }, [])

    const onSubmit = async () => {
        if (!text.trim()) return
        await createTransactionFromTextAction(text)
        setText("")
        const updated = await getTransactionsAction()
        setTransactions(updated)
    }

    const onDelete = async (id: string) => {
        await deleteTransactionAction(id)
        const updated = await getTransactionsAction()
        setTransactions(updated)
    }

    return (
        <div className="space-y-6">
            <DirectInput inputText={text} setInputText={setText} onSubmit={onSubmit} />

            <div className="space-y-2">
                {transactions.map((tx) => (
                    <Card key={tx.id}>
                        <CardContent className="px-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-semibold">{tx.name}</div>
                                    <div className="text-sm text-muted-foreground">{tx.description}</div>
                                </div>
                                <button onClick={() => onDelete(tx.id)} className="text-red-500 hover:text-red-700">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-2 flex justify-between text-sm">
                                <span>{tx.category}</span>
                                <span>
                                    {tx.currency} {tx.amount.toLocaleString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
