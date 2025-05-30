"use server"

import { 
    getConversionRateFromUSD,
    getUser,
    createTransaction,
    getTransactions,
    deleteTransaction,
 } from "./repository"
import { textToExpense } from "./ai_actions"
import { auth } from "@/auth"

export async function getConversionRateFromUSDAction(toCurrency: string) {
    return await getConversionRateFromUSD(toCurrency)
}

export async function convertCurrencyAction(fromCurrency: string, toCurrency: string, amount: number,) {
    // using USD based conversion
    const rate = await getConversionRateFromUSD(toCurrency)
    const fromRate = await getConversionRateFromUSD(fromCurrency)
    return amount * rate / fromRate
}

export async function getUserAction(userId: string) {
    return await getUser(userId)
}

export async function requireAuth() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }
    return session.user.id
}

export async function createTransactionFromTextAction(text: string) {
    const expense = await textToExpense({ input: text })
    return await createTransactionAction(expense)
}

export async function createTransactionAction(data: {
    name: string,
    description: string,
    category: string,
    amount: number,
    currency: string,
}) {
    const userId = await requireAuth()
    return await createTransaction({
        name: data.name,
        description: data.description,
        category: data.category,
        amount: data.amount,
        currency: data.currency,
        user: {
            connect: {
                id: userId
            }
        },
    })
}

export async function getTransactionsAction() {
    const userId = await requireAuth()
    return await getTransactions(userId)
}

export async function deleteTransactionAction(id: string) {
    const userId = await requireAuth()
    return await deleteTransaction(userId, id)
}