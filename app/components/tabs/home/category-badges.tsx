// components/CategoryBadge.tsx
import { Badge } from "@/components/ui/badge"
import { CATEGORY_COLORS } from "@/app/constants"

export default function CategoryBadge({ category }: { category: string }) {
    const style = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ?? "bg-muted text-muted-foreground"
    return <Badge className={style}>{category}</Badge>
}
