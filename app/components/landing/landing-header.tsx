import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"
import Link from "next/link"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Spend AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary">
            How It Works
          </a>
          <a href="#features" className="text-sm font-medium hover:text-primary">
            Features
          </a>
          <a href="#users" className="text-sm font-medium hover:text-primary">
            For You
          </a>
          <Link href="/sign-in">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
