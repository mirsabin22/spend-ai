import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="bg-primary py-24 text-primary-foreground">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Simplify Your Expense Tracking?</h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of users who've already simplified their financial tracking with Spend AI
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/sign-in">
                <Button size="lg" variant="secondary" className="text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-lg text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
