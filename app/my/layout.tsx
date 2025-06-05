"use client"

import AppHeader from "@/components/ui/app-header"
import { redirect } from "next/navigation"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

const queryClient = new QueryClient()

export default function MyLayout({ children }: { children: React.ReactNode }) {
    const { status } = useSession()

    if (status === "unauthenticated") {
        // redirect to sign in
        redirect("/sign-in")
    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin" />
            </div>
        )
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className="w-full max-w-md min-h-screen mx-auto bg-gray-50">
                <AppHeader />
                <main className="p-4">
                    {children}
                </main>
            </div>
        </QueryClientProvider>
    )
}
