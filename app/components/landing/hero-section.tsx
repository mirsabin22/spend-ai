import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Globe, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"
import InstallPrompt from "@/app/components/install-prompt"

export function HeroSection() {
  return (
    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <Badge variant="outline" className="mb-4">
          🎉 Now supporting 163 currencies worldwide
        </Badge>
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          Track Expenses in{" "}
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Plain English</span>
        </h1>
        <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
          Just say "I bought coffee for 4.50 dollars" and we'll handle the rest. Perfect for tourists, students, and anyone who
          wants effortless expense tracking across multiple currencies.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/sign-in">
                <Button size="lg" className="text-lg">
                Start Tracking Free
                <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
          <Button size="lg" variant="outline" className="text-lg">
            Watch Demo
          </Button>
        </div>
        <div className="mt-6">
            <InstallPrompt />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <MessageSquare className="mb-2 h-8 w-8 text-primary" />
            <h3 className="font-semibold">Natural Language</h3>
            <p className="text-sm text-muted-foreground">Speak or type naturally</p>
          </div>
          <div className="flex flex-col items-center">
            <Globe className="mb-2 h-8 w-8 text-primary" />
            <h3 className="font-semibold">Multi-Currency</h3>
            <p className="text-sm text-muted-foreground">163 currencies supported</p>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="mb-2 h-8 w-8 text-primary" />
            <h3 className="font-semibold">Smart Analytics</h3>
            <p className="text-sm text-muted-foreground">AI-powered insights</p>
          </div>
        </div>
      </div>
    </section>
  )
}
