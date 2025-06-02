"use client"

import { useState } from "react"
import { CreditCard, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type DateRange = "day" | "week" | "month" | "year"

export function AppHeader() {
    const [dateRange, setDateRange] = useState<DateRange>("day")

    const getDateDisplay = () => {
        const now = new Date()
        switch (dateRange) {
            case "day":
                return now.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            case "week":
                return "This Week"
            case "month":
                return now.toLocaleDateString("en-US", { month: "long" })
            case "year":
                return now.getFullYear().toString()
        }
    }

    return (
        <div className="flex h-14 items-center justify-between bg-primary px-4 text-primary-foreground">
            <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <h1 className="text-lg font-medium">SpendTrack</h1>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-primary-foreground hover:bg-primary/90">
                        {getDateDisplay()}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setDateRange("day")}>Today</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange("week")}>This Week</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange("month")}>This Month</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange("year")}>This Year</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
