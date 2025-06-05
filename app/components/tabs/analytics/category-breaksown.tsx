"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { getBestLocale } from "@/app/utils";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/app/constants";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryBreakdownAction } from "@/app/actions";
import { DateRange } from "react-day-picker";

const getCategoryBreakdownQuery = (startDate: Date | undefined, endDate: Date | undefined) => {
    return useQuery({
      queryKey: ['categoryBreakdown', startDate, endDate],
      queryFn: async () => {
        const breakdown = await getCategoryBreakdownAction(startDate, endDate)
        return breakdown
      },
    })
}

export default function CategoryBreakdown({
    dateRange,
}: {
    dateRange: DateRange | undefined;
}) {
    const [parent] = useAutoAnimate();
    const { data: categoryData, status } = getCategoryBreakdownQuery(dateRange?.from, dateRange?.to)

    return (
        <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={parent} className="space-y-4">
            {categoryData?.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No expenses found starting from {dateRange?.from ? format(dateRange.from, "PPP") : "the selected date"}.
              </p>
            ) : (
              categoryData?.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {CATEGORY_ICONS[category.category as keyof typeof CATEGORY_ICONS]}
                      </span>
                      <span className="text-sm font-medium">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {category.amount.toLocaleString(getBestLocale(), {
                          style: "currency",
                          currency: category.currency,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">({category.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${CATEGORY_COLORS[category.category as keyof typeof CATEGORY_COLORS]}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
}