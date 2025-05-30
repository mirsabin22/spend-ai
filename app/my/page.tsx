
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

import HomeTab from "@/app/components/tabs/home"
import AnalyticsTab from "@/app/components/tabs/analytics"
import TransactionsTab from "@/app/components/tabs/transactions"
import SettingsTab from "@/app/components/tabs/settings"
import auth from "@/middleware"
import Link from "next/link"

export default async function My() {
    const session = await auth()
    if (!session?.user?.id) return (
        <>
        <p>Not logged in</p>
          <Link href="/api/auth/signin">Sign in</Link>
        </>
      );

  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

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
    </Tabs>
  )
}