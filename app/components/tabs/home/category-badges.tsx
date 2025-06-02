// components/CategoryBadge.tsx
import { Badge } from "@/components/ui/badge"

const categoryColors: Record<string, string> = {
    Food: "bg-green-100 text-green-800",
    Transportation: "bg-blue-100 text-blue-800",
    Shopping: "bg-pink-100 text-pink-800",
    Health: "bg-red-100 text-red-800",
    "Health and Fitness": "bg-red-100 text-red-800",
    Entertainment: "bg-yellow-100 text-yellow-800",
    Education: "bg-purple-100 text-purple-800",
    Utilities: "bg-gray-100 text-gray-800",
    Other: "bg-zinc-100 text-zinc-800",
}

export default function CategoryBadge({ category }: { category: string }) {
    const style = categoryColors[category] ?? "bg-muted text-muted-foreground"
    return <Badge className={style}>{category}</Badge>
}
