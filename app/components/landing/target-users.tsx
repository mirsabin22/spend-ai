import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane, GraduationCap, Building2 } from "lucide-react"

export function TargetUsers() {
  const users = [
    {
      icon: Plane,
      title: "Travelers & Tourists",
      description: "Never worry about currency conversion again. Track expenses across countries effortlessly.",
      features: [
        "Real-time currency conversion",
        "Offline expense logging",
        "Trip budget tracking",
        "Multi-country reports",
      ],
      badge: "Most Popular",
      color: "bg-blue-500",
    },
    {
      icon: GraduationCap,
      title: "Students",
      description: "Manage your tight budget with ease. Perfect for international students and study abroad programs.",
      features: ["Student budget templates", "Scholarship tracking", "Shared expense splitting", "Parent reporting"],
      badge: "Budget Friendly",
      color: "bg-green-500",
    },
    {
      icon: Building2,
      title: "Small Businesses",
      description: "Track business expenses, manage receipts, and generate reports for tax purposes.",
      features: ["Receipt scanning", "Tax categorization", "Expense reports", "Team collaboration"],
      badge: "Professional",
      color: "bg-purple-500",
    },
  ]

  return (
    <section id="users" className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Perfect For Everyone</h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Whether you're exploring the world, managing student life, or running a business - we've got you covered
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {users.map((user, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${user.color} text-white`}>
                    <user.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">{user.badge}</Badge>
                </div>
                <CardTitle className="text-xl">{user.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{user.description}</p>
                <ul className="space-y-2">
                  {user.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
