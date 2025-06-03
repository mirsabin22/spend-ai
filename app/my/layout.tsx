import AppHeader from "@/components/ui/app-header"

export default function MyLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full max-w-md min-h-screen mx-auto bg-gray-50">
            <AppHeader />
            <main className="p-4">
                {children}
            </main>
        </div>
    )
}
