"use client"

import CategoryAnalysis from "./category-analysis"
import { SpendingTrends } from "./spending-trends"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery, useQueryClient } from "@tanstack/react-query"

// use query for last active tab
const getLastActiveTabQuery = () => {
    const queryClient = useQueryClient()
    const { data: lastActiveTab } = useQuery({
        queryKey: ['analyticsLastActiveTab'],
        queryFn: async () => {
            const lastActiveTab = queryClient.getQueryData<string>(['analyticsLastActiveTab'])
            return lastActiveTab
        },
        initialData: "categories"
    })
    const setLastActiveTab = (tab: string) => {
        queryClient.setQueryData(['analyticsLastActiveTab'], tab)
    }
    return { lastActiveTab, setLastActiveTab }
}


export default function AnalyticsTab() {

    const { lastActiveTab, setLastActiveTab } = getLastActiveTabQuery()

  return (
    <main className="relative flex h-full flex-col bg-background rounded-lg">
      <div className="flex-1 overflow-auto p-4">
        {/* <h1 className="mb-4 text-xl font-bold">Spending Analysis</h1> */}

        <Tabs defaultValue={lastActiveTab || "categories"} className="space-y-4" onValueChange={setLastActiveTab}>
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
