// "use client"

// import { useState, useMemo } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// import { ChevronDown, ChevronUp, PieChart } from "lucide-react"

// export function TodayExpenses() {
//     const [isExpanded, setIsExpanded] = useState(false)

//     // Mock data - would come from database in real app
//     const expenses = [
//         { id: 1, item: "Morning coffee", amount: 450, category: "Food", time: "08:30" },
//         { id: 2, item: "Train ticket", amount: 280, category: "Transport", time: "09:15" },
//         { id: 3, item: "Lunch", amount: 850, category: "Food", time: "12:30" },
//         { id: 4, item: "Onigiri", amount: 400, category: "Food", time: "16:45" },
//     ]

//     const totalSpent = useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses])

//     // Calculate category totals
//     const categoryTotals = useMemo(() => {
//         const totals: Record<string, number> = {}
//         expenses.forEach((expense) => {
//             if (!totals[expense.category]) {
//                 totals[expense.category] = 0
//             }
//             totals[expense.category] += expense.amount
//         })
//         return Object.entries(totals).map(([category, amount]) => ({
//             category,
//             amount,
//             percentage: Math.round((amount / totalSpent) * 100),
//         }))
//     }, [expenses, totalSpent])

//     const getCategoryColor = (category: string) => {
//         switch (category) {
//             case "Food":
//                 return "bg-green-100 text-green-800"
//             case "Transport":
//                 return "bg-blue-100 text-blue-800"
//             case "Shopping":
//                 return "bg-purple-100 text-purple-800"
//             default:
//                 return "bg-gray-100 text-gray-800"
//         }
//     }

//     const getCategoryBarColor = (category: string) => {
//         switch (category) {
//             case "Food":
//                 return "bg-green-500"
//             case "Transport":
//                 return "bg-blue-500"
//             case "Shopping":
//                 return "bg-purple-500"
//             default:
//                 return "bg-gray-500"
//         }
//     }

//     return (
//         <div className="space-y-4">
//             <Card className="border-none shadow-sm transition-all duration-200" onClick={() => setIsExpanded(!isExpanded)}>
//                 <CardHeader className="pb-2">
//                     <div className="flex items-center justify-between">
//                         <CardTitle className="text-lg">Today's Overview</CardTitle>
//                         {isExpanded ? (
//                             <ChevronUp className="h-5 w-5 text-muted-foreground" />
//                         ) : (
//                             <ChevronDown className="h-5 w-5 text-muted-foreground" />
//                         )}
//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="flex items-baseline justify-between">
//                         <div>
//                             <p className="text-2xl font-bold">¥{totalSpent.toLocaleString()}</p>
//                             <p className="text-sm text-muted-foreground">spent today</p>
//                         </div>
//                         <div className="text-right">
//                             <p className="text-sm font-medium">{expenses.length} transactions</p>
//                         </div>
//                     </div>

//                     {isExpanded && (
//                         <div className="mt-4 space-y-3 pt-3 border-t">
//                             <div className="flex items-center gap-2">
//                                 <PieChart className="h-4 w-4 text-muted-foreground" />
//                                 <p className="text-sm font-medium">Category Breakdown</p>
//                             </div>

//                             {categoryTotals.map((category, index) => (
//                                 <div key={index} className="space-y-1">
//                                     <div className="flex justify-between text-xs">
//                                         <span>{category.category}</span>
//                                         <span>
//                                             ¥{category.amount} ({category.percentage}%)
//                                         </span>
//                                     </div>
//                                     <div className="h-2 w-full rounded-full bg-secondary">
//                                         <div
//                                             className={`h-full rounded-full ${getCategoryBarColor(category.category)}`}
//                                             style={{ width: `${category.percentage}%` }}
//                                         />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>

//             <h2 className="px-1 text-sm font-medium text-muted-foreground">Today's Expenses</h2>

//             <div className="space-y-3">
//                 {expenses.map((expense) => (
//                     <Card key={expense.id} className="border-none shadow-sm">
//                         <CardContent className="p-3">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="font-medium">{expense.item}</p>
//                                     <div className="mt-1 flex items-center gap-2">
//                                         <Badge variant="secondary" className={getCategoryColor(expense.category)}>
//                                             {expense.category}
//                                         </Badge>
//                                         <span className="text-xs text-muted-foreground">{expense.time}</span>
//                                     </div>
//                                 </div>
//                                 <p className="font-medium">¥{expense.amount}</p>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     )
// }
