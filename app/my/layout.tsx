"use client"

import AppHeader from "@/components/ui/app-header"
import { redirect } from "next/navigation"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSession } from "next-auth/react"

const queryClient = new QueryClient()

export default function MyLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()

    if (!session?.user?.id) {
        // redirect to sign in
        redirect("/sign-in")
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
