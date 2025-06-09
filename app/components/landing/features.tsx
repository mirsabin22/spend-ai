import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Globe,
  MessageSquare,
  Brain,
  Shield,
  Smartphone,
  BarChart3,
  Camera,
  Users,
  Download,
  Zap,
  Lock,
  Headphones,
} from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Globe,
      title: "50+ Currencies",
      description: "Support for major world currencies with real-time exchange rates",
    },
    {
      icon: MessageSquare,
      title: "Natural Language Input",
      description: "Just speak or type naturally - no forms or complicated interfaces",
    },
    {
      icon: Brain,
      title: "AI-Powered Categorization",
      description: "Smart automatic categorization of your expenses using machine learning",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Detailed insights, trends, and spending patterns across all currencies",
    },
    {
      icon: Camera,
      title: "Receipt Scanning",
      description: "Snap photos of receipts and let AI extract all the details automatically",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for mobile use with offline capabilities for travel",
    },
    {
      icon: Users,
      title: "Shared Expenses",
      description: "Split bills and track group expenses with friends and colleagues",
    },
    {
      icon: Download,
      title: "Export & Reports",
      description: "Generate detailed reports in PDF, CSV, or Excel formats",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your financial data is encrypted and secured with industry standards",
    },
    {
      icon: Zap,
      title: "Real-Time Sync",
      description: "Instant synchronization across all your devices and platforms",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data stays private - we never sell or share your information",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team",
    },
  ]

  return (
    <section id="features" className="bg-muted/50 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Powerful Features</h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Everything you need to track expenses effortlessly, whether you're at home or traveling the world
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardHeader className="pb-4">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
