"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RotateCcw } from "lucide-react"
import { Info } from "lucide-react"
import { DEFAULT_SYSTEM, INSIGHTS_SYSTEM } from "@/app/constants"
import { updateUserAction } from "@/app/actions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { User } from "@prisma/client"
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function AiPromptSettings({
    user,
}: {
    user: User
}) {
    const [openAiExpenseGuide, setOpenAiExpenseGuide] = useState(false)
    const [openAiInsightGuide, setOpenAiInsightGuide] = useState(false)
    const [expensePrompt, setExpensePrompt] = useState<string | undefined>(undefined)
    const [insightPrompt, setInsightPrompt] = useState<string | undefined>(undefined)
    const [isSaved, setIsSaved] = useState(false)
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: updateUserAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mySettings'] })
            setIsSaved(true)
            setTimeout(() => {
                setIsSaved(false)
            }, 2000)
        },
    })
    const [parent] = useAutoAnimate()

    useEffect(() => {
        setExpensePrompt(user?.aiExpensePrompt || DEFAULT_SYSTEM)
        setInsightPrompt(user?.aiInsightPrompt || INSIGHTS_SYSTEM)
    }, [user])

    return (
        <div ref={parent} className="space-y-4 mt-8 p-6 bg-white rounded-lg shadow">
            {/* AI Settings (experimental) */}
            <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">AI Settings (experimental)</h1>
            <p className="text-sm text-muted-foreground">
                These settings allow you to customize the behavior of the AI assistant. Don't change them unless you know what you're doing.
            </p>

            <div className="space-y-2">
                <div className="justify-between flex">
                    <div className="flex items-center gap-1">
                        <Label htmlFor="ai-expense-prompt">Expense Style Prompt</Label>
                        <Info
                            size="14"
                            onClick={() => setOpenAiExpenseGuide(true)}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setExpensePrompt(DEFAULT_SYSTEM)}
                    >
                        <RotateCcw size={12} />
                        <span className="sr-only">Reset to default</span>
                    </Button>
                </div>
                <textarea
                    id="ai-expense-prompt"
                    value={expensePrompt}
                    onChange={(e) => {
                        setExpensePrompt(e.target.value)
                    }}
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows={3}
                />
            </div>

            {/* AI Insight Prompt */}
            <div className="space-y-2">
                <div className="justify-between flex">
                    <div className="flex items-center gap-1">
                        <Label htmlFor="ai-insight-prompt">Insight Style Prompt</Label>
                        <Info
                            size="14"
                            onClick={() => setOpenAiInsightGuide(true)}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setInsightPrompt(INSIGHTS_SYSTEM)
                        }}
                    >
                        <RotateCcw size={12} />
                        <span className="sr-only">Reset to default</span>
                    </Button>
                </div>
                <textarea
                    id="ai-insight-prompt"
                    value={insightPrompt}
                    onChange={(e) => {
                        setInsightPrompt(e.target.value)
                    }}
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows={3}
                />
            </div>
            <div className="flex justify-between items-center">
                <Button
                    onClick={() => {
                        updateMutation.mutateAsync({
                            aiExpensePrompt: expensePrompt,
                            aiInsightPrompt: insightPrompt,
                        })
                    }}
                >
                    Save prompts
                </Button>
                {isSaved && (
                    <p className="text-xs text-gray-500">
                        Prompts saved!
                    </p>
                )}
            </div>

            <Dialog open={openAiExpenseGuide} onOpenChange={setOpenAiExpenseGuide}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Expense Style</DialogTitle>
                    </DialogHeader>
                    <p className="text-xs text-muted-foreground">
                        These prompts are used to style the generated expenses from your text, edit them to change the style of the generated expenses to the style you like.
                    </p>
                    {/* examples */}
                    <p className="text-xs text-muted-foreground">
                        Examples:
                    </p>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                        <li>"Always output in english."</li>
                        <li>"Always minimize the output to 1 or 2 words."</li>
                        <li>"Add 1 dollar to the amount for every expense."</li>
                    </ul>
                </DialogContent>
            </Dialog>

            <Dialog open={openAiInsightGuide} onOpenChange={setOpenAiInsightGuide}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insight Style</DialogTitle>
                    </DialogHeader>
                    <p className="text-xs text-muted-foreground">
                        These prompts are used to style the generated insights from your expenses, edit them to change the style of the generated insights to the style you like.
                    </p>
                    {/* examples */}
                    <p className="text-xs text-muted-foreground">
                        Examples:
                    </p>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                        <li>"Always output in english."</li>
                        <li>"Always minimize the output."</li>
                        <li>"Act as a financial advisor."</li>
                    </ul>
                </DialogContent>
            </Dialog>
        </div>
    )
}