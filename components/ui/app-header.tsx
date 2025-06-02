"use client"

import { CreditCard } from "lucide-react"

export function AppHeader() {
    return (
        <div className="flex h-14 items-center justify-between bg-primary px-4 text-primary-foreground">
            <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <h1 className="text-lg font-medium">SpendTrack</h1>
            </div>
        </div>
    )
}
