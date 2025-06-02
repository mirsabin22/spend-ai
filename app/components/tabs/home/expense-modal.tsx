"use client"

import { useState, useEffect } from "react"
import { X, Edit, Trash } from "lucide-react"
import { CATEGORIES } from "@/app/constants"
import { getAvailableCurrenciesAction } from "@/app/actions"

type Expense = {
    id: string
    name: string
    description: string
    category: string
    amount: number
    currency: string
    createdAt: string
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
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                {!isEdit ? (
                    <>
                        <h3 className="text-xl font-semibold mb-4">{expense.name}</h3>
                        <p className="mb-2">{expense.description}</p>
                        <p className="mb-2">Category: {expense.category}</p>
                        <p className="mb-2">Amount: {expense.currency} {expense.amount.toLocaleString()}</p>
                        <p className="mb-4 text-sm text-gray-500">Created at: {new Date(expense.createdAt).toLocaleString()}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsEdit(true)}
                                className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                <Edit size={16} /> Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-1 px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-100"
                            >
                                <Trash size={16} /> Delete
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold mb-4">Edit Expense</h3>
                        <input
                            type="text"
                            name="name"
                            value={formData?.name || ""}
                            onChange={handleChange}
                            placeholder="Name"
                            className="w-full mb-2 px-3 py-1 border rounded"
                        />
                        <textarea
                            name="description"
                            value={formData?.description || ""}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full mb-2 px-3 py-1 border rounded resize-none"
                            rows={3}
                        />
                        <select
                            name="category"
                            value={formData?.category || ""}
                            onChange={handleChange}
                            className="w-full mb-2 px-3 py-1 border rounded"
                        >
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="amount"
                            value={formData?.amount || 0}
                            onChange={handleChange}
                            placeholder="Amount"
                            className="w-full mb-2 px-3 py-1 border rounded"
                        />
                        <select
                            name="currency"
                            value={formData?.currency || ""}
                            onChange={handleChange}
                            className="w-full mb-4 px-3 py-1 border rounded"
                        >
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsEdit(false)}
                                className="px-3 py-1 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
