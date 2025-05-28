"use client"

import { useState } from "react"
import { textToExpense } from "@/app/ai_actions"
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
        currency: "",
    })
    const [system, setSystem] = useState(DEFAULT_SYSTEM)
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
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}