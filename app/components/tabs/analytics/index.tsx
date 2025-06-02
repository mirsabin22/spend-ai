"use client"

import { useState, useEffect } from "react"
import { CategoryAnalysis } from "./category-analysis"
import { SpendingTrends } from "./spending-trends"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsTab() {
  const [mounted, setMounted] = useState(false)

  // This ensures hydration mismatch is avoided
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="relative flex h-full flex-col bg-background">
      <div className="flex-1 overflow-auto p-4">
        <h1 className="mb-4 text-xl font-bold">Spending Analysis</h1>

        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends & Averages</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <CategoryAnalysis />
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <SpendingTrends />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
