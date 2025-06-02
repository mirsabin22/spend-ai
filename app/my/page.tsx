import Link from "next/link"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

import { Home, PieChart, Clock, Settings } from "lucide-react"

import HomeTab from "@/app/components/tabs/home"
import AnalyticsTab from "@/app/components/tabs/analytics"
import TransactionsTab from "@/app/components/tabs/transactions"
import SettingsTab from "@/app/components/tabs/settings"

import auth from "@/middleware"

export default async function My() {
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p>You are not logged in.</p>
        <Link
          href="/api/auth/signin"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <Tabs defaultValue="home" className="flex flex-col min-h-screen w-full">
      {/* Main content */}
      <div className="flex-1 overflow-auto pb-20">
        <TabsContent value="home">
          <HomeTab />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </div>

      {/* Bottom nav bar */}
      <TabsList className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t bg-white shadow-md h-20 px-2 w-full sm:max-w-md sm:mx-auto">
        <TabsTrigger
          value="home"
          className="flex flex-col items-center justify-center h-full w-full gap-1"
          aria-label="Home"
        >
          <Home className="h-6 w-6" />
          <span className="text-sm">Home</span>
        </TabsTrigger>

        <TabsTrigger
          value="analytics"
          className="flex flex-col items-center justify-center h-full w-full gap-1"
          aria-label="Analytics"
        >
          <PieChart className="h-6 w-6" />
          <span className="text-sm">Analytics</span>
        </TabsTrigger>

        <TabsTrigger
          value="transactions"
          className="flex flex-col items-center justify-center h-full w-full gap-1"
          aria-label="Transactions"
        >
          <Clock className="h-6 w-6" />
          <span className="text-sm">History</span>
        </TabsTrigger>

        <TabsTrigger
          value="settings"
          className="flex flex-col items-center justify-center h-full w-full gap-1"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6" />
          <span className="text-sm">Settings</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
