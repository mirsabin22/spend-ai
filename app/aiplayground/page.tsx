"use client"

import { useEffect, useState } from "react"
import { textToExpense } from "@/app/ai_actions"
import { convertCurrencyAction } from "@/app/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DEFAULT_SYSTEM } from "@/app/constants"
import { Textarea } from "@/components/ui/textarea"

export default function AiPlaygorund() {
    const [text, setText] = useState("")
    const [expense, setExpense] = useState({
        name: "",
        description: "",
        category: "",
        amount: 0,
        currency: "USD",
    })
    const [system, setSystem] = useState(DEFAULT_SYSTEM)
    const [userCurrency, setUserCurrency] = useState("IDR")
    const [convertedAmount, setConvertedAmount] = useState(0)

    useEffect(() => {
        if (expense.currency !== userCurrency) {
            convertCurrencyAction(expense.currency, userCurrency, expense.amount)
                .then((amount) => setConvertedAmount(amount))
        }
    }, [userCurrency, expense])

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6">
                <CardHeader>
                    <CardTitle>AI Playground</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>System</Label>
                        <Textarea
                            id="system"
                            value={system}
                            onChange={(e) => setSystem(e.target.value)}
                            placeholder="e.g. You are a helpful assistant"
                        />
                        <Label htmlFor="expense-text">Enter user expense</Label>
                        <Input
                            id="expense-text"
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="e.g. Bought lunch for 50k"
                        />
                        <Label htmlFor="currency">Currency</Label>
                        <select
                            id="currency"
                            className="w-full border rounded px-3 py-2"
                            value={userCurrency}
                            onChange={(e) => setUserCurrency(e.target.value)}
                        >
                            <option value="IDR">IDR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                    <Button className="w-full" onClick={async () => setExpense(await textToExpense({input: text}))}>
                        Submit
                    </Button>
                    <div className="space-y-1">
                        {/* Json show code in pretty */}
                        <div>
                            <strong>JSON:</strong>
                            <pre className="bg-muted text-sm p-4 rounded-md overflow-auto">
                                <code>{JSON.stringify(expense, null, 2)}</code>
                            </pre>
                        </div>
                        {/* converted amount */}
                        <div>
                            <strong>Converted Amount to {userCurrency}:</strong>
                            <p>{convertedAmount}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}