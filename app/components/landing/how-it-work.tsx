import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Brain, BarChart3 } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: MessageSquare,
      title: "Speak Naturally",
      description: "Just say or type your expense in plain English. 'Bought lunch for €12' or 'Taxi ride ¥800'",
      example: '"I spent $25 on groceries at Walmart"',
    },
    {
      icon: Brain,
      title: "AI Processing",
      description: "Our AI automatically extracts amount, category, location, and converts currencies in real-time",
      example: "Amount: $25, Category: Groceries, Merchant: Walmart",
    },
    {
      icon: BarChart3,
      title: "Smart Insights",
      description: "Get instant analytics, spending patterns, and budget tracking across all your currencies",
      example: "Daily average: $45, Top category: Food (40%)",
    },
  ]

  return (
    <section id="how-it-works" className="bg-muted/50 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How Spend AI Works</h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Three simple steps to effortless expense tracking, no matter where you are in the world
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="mb-4 text-muted-foreground">{step.description}</p>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-mono">{step.example}</p>
                </div>
                <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
