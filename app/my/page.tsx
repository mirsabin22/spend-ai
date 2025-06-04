"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Home, PieChart, Clock, Settings } from "lucide-react"

import HomeTab from "@/app/components/tabs/home"
import AnalyticsTab from "@/app/components/tabs/analytics"
import TransactionsTab from "@/app/components/tabs/transactions"
import SettingsTab from "@/app/components/tabs/settings"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function My() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = searchParams.get("tab") || "home"
  const [tab, setTab] = useState(initialTab)
  const [mountedTabs, setMountedTabs] = useState(new Set([initialTab]))

  useEffect(() => {
    router.replace(`?tab=${tab}`)
    setMountedTabs((prev) => new Set(prev).add(tab))
  }, [tab])

  return (
    <Tabs value={tab} onValueChange={setTab} className="flex flex-col min-h-screen w-full">
      {/* Main content */}
      <div className="flex-1 overflow-auto pb-20">
      {mountedTabs.has("home") && (
          <div className={tab === "home" ? "" : "hidden"}>
            <HomeTab />
          </div>
        )}
        {mountedTabs.has("analytics") && (
          <div className={tab === "analytics" ? "" : "hidden"}>
            <AnalyticsTab/>
          </div>
        )}
        {mountedTabs.has("transactions") && (
          <div className={tab === "transactions" ? "" : "hidden"}>
            <TransactionsTab />
          </div>
        )}
        {mountedTabs.has("settings") && (
          <div className={tab === "settings" ? "" : "hidden"}>
            <SettingsTab/>
          </div>
        )}
      </div>

      {/* Bottom nav bar */}
      <TabsList className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t bg-white shadow-md h-20 px-2 w-full sm:max-w-md sm:mx-auto">
        <TabsTrigger
          value="home"
          className="flex flex-col items-center justify-center h-full w-full gap-1 text-muted-foreground data-[state=active]:text-gray-600 data-[state=active]:font-semibold"
          aria-label="Home"
        >
          <Home className="h-6 w-6" />
          <span className="text-sm">Home</span>
        </TabsTrigger>

        <TabsTrigger
          value="analytics"
          className="flex flex-col items-center justify-center h-full w-full gap-1 text-muted-foreground data-[state=active]:text-gray-600 data-[state=active]:font-semibold"
          aria-label="Analytics"
        >
          <PieChart className="h-6 w-6" />
          <span className="text-sm">Analytics</span>
        </TabsTrigger>

        <TabsTrigger
          value="transactions"
          className="flex flex-col items-center justify-center h-full w-full gap-1 text-muted-foreground data-[state=active]:text-gray-600 data-[state=active]:font-semibold"
          aria-label="Transactions"
        >
          <Clock className="h-6 w-6" />
          <span className="text-sm">History</span>
        </TabsTrigger>

        <TabsTrigger
          value="settings"
          className="flex flex-col items-center justify-center h-full w-full gap-1 text-muted-foreground data-[state=active]:text-gray-600 data-[state=active]:font-semibold"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6" />
          <span className="text-sm">Settings</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
