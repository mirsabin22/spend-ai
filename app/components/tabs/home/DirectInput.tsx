"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Send } from "lucide-react"

type Props = {
    inputText: string
    setInputText: (value: string) => void
    onSubmit: () => void
}

export default function DirectInput({ inputText, setInputText, onSubmit }: Props) {
    return (
        <Card className="border-none p-3 shadow-sm">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Add expense (e.g., Coffee ¥450)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1"
                />
                <Button type="button" size="icon" variant="outline" className="h-10 w-10 shrink-0" aria-label="Voice input">
                    <Mic className="h-5 w-5" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    disabled={!inputText}
                    onClick={onSubmit}
                    aria-label="Send"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </div>
        </Card>
    )
}
