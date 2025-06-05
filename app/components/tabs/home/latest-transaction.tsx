import { useQuery } from "@tanstack/react-query"
import { getLatestTransactionsAction } from "@/app/actions"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { getBestLocale } from "@/app/utils"
import { Button } from "@/components/ui/button"
import { useAutoAnimate } from "@formkit/auto-animate/react"

export default function LatestTransaction() {
    const [parent] = useAutoAnimate()
    const { data } = useQuery({
        queryKey: ["latest-transaction"],
        queryFn: () => getLatestTransactionsAction(3)
    })

    return (
        <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-2 mt-4">
            <span className="text-muted-foreground">Latest Expenses</span>
          </h2>
          {/* see more in history */}
          <Button onClick={() => window.location.href = "/my?tab=transactions"} variant="link" className="text-xs text-muted-foreground">
            See more
          </Button>
        </div>
        <div ref={parent} className="space-y-2">
            {data?.map((tx, i) => {
              const opacity = Math.max(1 - i * 0.15, 0.1)
              return (
                <Card
                  key={tx.id}
                  className="transition shadow-none bg-muted"
                  style={{ opacity }}
                >
                  <CardContent className="px-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-muted-foreground"> {tx.name.length > 20 ? tx.name.slice(0, 20) + "..." : tx.name}</div>
                        <div className="text-sm text-muted-foreground"> {tx.description?.length ? tx.description.length > 20 ? tx.description.slice(0, 20) + "..." : tx.description : ""}</div>
                        <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}</div>
                      </div>
                      {/* show original and converted amount */}
                      <div className="text-right">
                        <p className="text-base font-medium text-muted-foreground">
                          {tx.convertedAmount.toLocaleString(getBestLocale(), {
                            style: "currency",
                            currency: tx.convertedCurrency,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.amount.toLocaleString(getBestLocale(), {
                            style: "currency",
                            currency: tx.currency,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>
    </div>
    )
}
