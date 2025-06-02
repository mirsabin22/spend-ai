"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon, AlertTriangle, Dot } from "lucide-react"
import { useEffect, useState } from "react"
import { getSpendingTrendsAction, getCategorySpendingComparisonAction } from "@/app/actions"
import { getInsights } from "@/app/ai_actions"
import { format } from "date-fns"
import { CATEGORY_ICONS } from "@/app/constants"

export function SpendingTrends() {
    const [spendingData, setSpendingData] = useState<{ period: string, total: number }[]>([])
    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
    const [comparisonData, setComparisonData] = useState<{ category: string, current: number, average: number, status: "over" | "under", percentage: number }[]>([])
    const [historyCount, setHistoryCount] = useState<number>(3)
    const [userCurrency, setUserCurrency] = useState<string>("USD")
    const [insights, setInsights] = useState<string[]>([])
    const [initialized, setInitialized] = useState<boolean>(false)

    // Find the max value for scaling the chart
    const maxSpendingAmount = Math.max(...spendingData.map((d) => d.total))

    useEffect(() => {
        const fetchComparisonData = async () => {
            const trends = await getCategorySpendingComparisonAction(historyCount, userCurrency, period)
            setComparisonData(trends.map(t => ({
                category: t.category,
                current: Math.round(t.current),
                average: Math.round(t.average),
                status: t.current > t.average ? "over" : "under",
                percentage: Math.round(((t.current - t.average) / t.average) * 100),
            })))
        }
        fetchComparisonData()
    }, [period])


    useEffect(() => {
        const fetchSpendingData = async () => {
            const trends = await getSpendingTrendsAction(period, userCurrency)
            setSpendingData(trends.map(t => ({
                period: format(t.period, "dd/MM"), // day format
                total: Math.round(t.total)
            })))
        }
        fetchSpendingData()
    }, [period])

    useEffect(() => {
        const fetchInsights = async () => {
            const insights = await getInsights({ 
                input: "Period: " + period + "\n" + 
                "Spending data: " + JSON.stringify(spendingData) + "\n" +
                "Comparison data: " + JSON.stringify(comparisonData) })
            setInsights(insights)
        }
        if (!initialized) {
            fetchInsights()
            setInitialized(true)
        }
    }, [period])

    return (
        <div className="space-y-4">
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Daily Spending</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[150px] items-end justify-between">
                        {spendingData.map((day, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div
                                    className="w-8 rounded-t bg-primary"
                                    style={{
                                        height: `${(day.total / maxSpendingAmount) * 120}px`,
                                    }}
                                />
                                <span className="mt-2 text-xs">{day.period}</span>
                                <span className="text-xs text-muted-foreground">¥{day.total}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Spending vs. Average</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* if no data */}
                        {comparisonData.length === 0 ? (
                            <div className="flex items-center justify-center">
                                <span className="text-sm text-muted-foreground">No data available</span>
                            </div>
                        ) : (
                            comparisonData.map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{CATEGORY_ICONS[item.category as keyof typeof CATEGORY_ICONS]} {item.category}</span>
                                        <div className="flex items-center gap-1">
                                            {item.status === "over" ? (
                                                <Badge variant="destructive" className="flex items-center gap-1 px-1.5 py-0">
                                                    <ArrowUpIcon className="h-3 w-3" />
                                                    {item.percentage}%
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="flex items-center gap-1 bg-green-100 px-1.5 py-0 text-green-800"
                                                >
                                                    <ArrowDownIcon className="h-3 w-3" />
                                                    {item.percentage}%
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <div className="h-2 w-full rounded-full bg-secondary">
                                                <div
                                                    className={`h-full rounded-full ${item.status === "over" ? "bg-red-500" : "bg-green-500"}`}
                                                    style={{
                                                        width: `${(item.current / maxSpendingAmount) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                                                <span>Current: {item.current.toLocaleString()} {userCurrency}</span>
                                                <span>Avg: {item.average.toLocaleString()} {userCurrency}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {insights.map((insight, i) => (
                            <li key={i} className="flex items-start">
                                <Dot className="mr-2 h-4 w-4 shrink-0 text-amber-500" />
                                <span className="text-sm">{insight}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
