"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X, Edit, Trash, Calculator } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CATEGORIES } from "@/app/constants"
import { getAvailableCurrenciesAction } from "@/app/actions"
import { getBestLocale } from "@/app/utils"
import CategoryBadge from "./category-badges"
import { formatDistanceToNow, format } from "date-fns"

type Expense = {
    id: string
    name: string
    description: string
    category: string
    amount: number
    currency: string
    createdAt: string
    convertedAmount: number
    convertedCurrency: string
}

type Props = {
    expense: Expense | null
    onClose: () => void
    onSave: (updated: Expense) => Promise<void>
    onDelete: (id: string) => Promise<void>
}

export default function ExpenseModal({ expense, onClose, onSave, onDelete }: Props) {
    const [isEdit, setIsEdit] = useState(false)
    const [formData, setFormData] = useState<Expense | null>(expense)
    const [currencies, setCurrencies] = useState<string[]>([])

    useEffect(() => {
        setFormData(expense)
        setIsEdit(false)
    }, [expense])

    useEffect(() => {
        const fetchRates = async () => {
            const rates = await getAvailableCurrenciesAction()
            setCurrencies(rates)
        }
        fetchRates()
    }, [])

    if (!expense) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!formData) return
        const { name, value } = e.target
        setFormData({ ...formData, [name]: name === "amount" ? Number(value) : value })
    }

    const handleSave = async () => {
        if (formData) {
            await onSave(formData)
            setIsEdit(false)
            onClose()
        }
    }

    const handleDelete = async () => {
        await onDelete(expense.id)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-md p-6 w-full max-w-md relative shadow-lg">
                <Button
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </Button>

                {!isEdit ? (
                    <>
                        <h3 className="text-xl font-semibold mb-4">{expense.name}</h3>
                        <p className="mb-2 text-sm">{expense.description}</p>
                        <p className="mb-2"><CategoryBadge category={expense.category} /></p>
                        <p className="mb-2 text-sm">{expense.amount.toLocaleString(getBestLocale(), {
                            style: "currency",
                            currency: expense.currency,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}</p>
                        <div className="flex items-center gap-2">
                            <Calculator size={20}/>
                            <p className="mb-2 font-bold">{expense.convertedAmount.toLocaleString(getBestLocale(), {
                            style: "currency",
                            currency: expense.convertedCurrency,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm text-gray-500">{format(new Date(expense.createdAt), "dd MMM yyyy HH:mm:ss")}, {formatDistanceToNow(new Date(expense.createdAt), { addSuffix: true })}</p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button
                                onClick={() => setIsEdit(true)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 px-3 py-1 border-gray-300 rounded hover:bg-gray-100"
                            >
                                <Edit size={16} /> Edit
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="destructive"
                                size="sm"
                                className="flex items-center gap-1 px-3 py-1 rounded hover:bg-red-100"
                            >
                                <Trash size={16} /> Delete
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold mb-4">Edit Expense</h3>
                        <Input
                          type="text"
                          name="name"
                          value={formData?.name || ""}
                          onChange={handleChange}
                          placeholder="Name"
                          className="mb-2"
                        />
                        <Textarea
                          name="description"
                          value={formData?.description || ""}
                          onChange={handleChange}
                          placeholder="Description"
                          rows={3}
                          className="mb-2"
                        />
                        <Select
                          value={formData?.category}
                          onValueChange={(val) =>
                            handleChange({
                              target: { name: "category", value: val },
                            } as any)
                          }
                        >
                          <SelectTrigger className="w-full mb-2">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          name="amount"
                          value={formData?.amount || 0}
                          onChange={handleChange}
                          placeholder="Amount"
                          className="mb-2"
                        />
                        <Select
                          value={formData?.currency}
                          onValueChange={(val) =>
                            handleChange({
                              target: { name: "currency", value: val },
                            } as any)
                          }
                        >
                          <SelectTrigger className="w-full mb-4">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex justify-end space-x-3">
                            <Button
                                onClick={() => setIsEdit(false)}
                                variant="ghost"
                                size="sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                variant="default"
                                size="sm"
                            >
                                Save
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
