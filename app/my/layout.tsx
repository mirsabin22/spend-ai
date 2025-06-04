import AppHeader from "@/components/ui/app-header"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function MyLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    if (!session?.user?.id) {
        // redirect to sign in
        redirect("/sign-in")
    }
    return (
        <div className="w-full max-w-md min-h-screen mx-auto bg-gray-50">
            <AppHeader />
            <main className="p-4">
                {children}
            </main>
        </div>
    )
}
