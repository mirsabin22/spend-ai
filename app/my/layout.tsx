export default function MyLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full max-w-md min-h-screen mx-auto bg-gray-50">
            {children}
        </div>
    )
}