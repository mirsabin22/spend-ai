import { HeroSection } from "@/app/components/landing/hero-section"
import { HowItWorks } from "@/app/components/landing/how-it-work"
import { TargetUsers } from "@/app/components/landing/target-users"
import { Features } from "@/app/components/landing/features"
import { Testimonials } from "@/app/components/landing/testimonials"
import { CTA } from "@/app/components/landing/cta"
import { Footer } from "@/app/components/landing/footer"
import { LandingHeader } from "@/app/components/landing/landing-header"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <LandingHeader />
        <HeroSection />
        <HowItWorks />
        <TargetUsers />
        <Features />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}
