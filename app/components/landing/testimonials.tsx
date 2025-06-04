import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Nomad",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Spend AI saved my sanity while backpacking through Southeast Asia. No more currency confusion or lost receipts!",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "International Student",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Perfect for managing my student budget across different countries. My parents love the detailed reports too.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Small Business Owner",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The AI categorization is incredibly accurate. It's made expense reporting for my consulting business so much easier.",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Frequent Traveler",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "I travel for work constantly. Spend AI handles all the currency conversions automatically - it's a game changer.",
      rating: 5,
    },
    {
      name: "Anna Kowalski",
      role: "Study Abroad Student",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Finally, an expense tracker that understands natural language! No more complicated forms while I'm exploring Europe.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Startup Founder",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Our team uses Spend AI for all business expenses. The collaboration features and reporting are top-notch.",
      rating: 5,
    },
  ]

  return (
    <section className="py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Loved by Users Worldwide</h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Join thousands of satisfied users who've simplified their expense tracking
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="mr-3 h-10 w-10">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
