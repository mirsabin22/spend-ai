"use server"

import {
    getConversionRateFromUSD,
    getUser,
    updateUser,
    createTransaction,
    getTransactions,
    deleteTransaction,
    updateTransaction,
    getCategoryBreakdown,
    getSpendingTrends,
    getCategorySpendingComparison,
    getTopExpenses,
    UpdateUserInput,
    getCachedExchangeRates
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

export async function getUserAction() {
    const userId = await requireAuth()
    return await getUser(userId)
}

export async function updateUserAction(data: UpdateUserInput) {
    const userId = await requireAuth()
    return await updateUser(userId, data)
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

export async function getTransactionsAction(filter?: {
    category?: string;
    currency?: string;
    search?: string;
    startDate?: Date;
    endDate?: Date;
}) {
    const userId = await requireAuth()
    return await getTransactions(userId, filter)
}

export async function deleteTransactionAction(id: string) {
    const userId = await requireAuth()
    return await deleteTransaction(userId, id)
}

export async function updateTransactionAction(data: {
    id: string,
    name: string,
    description: string,
    category: string,
    amount: number,
    currency: string,
}) {
    const userId = await requireAuth()
    return await updateTransaction(userId, data)
}

export async function getCategoryBreakdownAction(startDate?: Date, endDate?: Date) {
    const userId = await requireAuth()
    const user = await getUser(userId)
    return await getCategoryBreakdown(userId, user?.currency, startDate, endDate)
}

export async function getSpendingTrendsAction(period: "daily" | "weekly" | "monthly" = "daily", historyCount: number = 7) {
    const userId = await requireAuth()
    const user = await getUser(userId)
    return await getSpendingTrends(userId, period, user?.currency, historyCount)
}

export async function getCategorySpendingComparisonAction(period: "daily" | "weekly" | "monthly" = "daily", historyCount: number = 3) {
    const userId = await requireAuth()
    const user = await getUser(userId)
    return await getCategorySpendingComparison(userId, user?.currency, historyCount, period)
}

export async function getTopExpensesAction(filter?: {
    limit?: number;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    currency?: string;
}) {
    const userId = await requireAuth()
    const user = await getUser(userId)
    return await getTopExpenses(userId, { ...filter, currency: user?.currency })
}


export async function getAvailableCurrenciesAction() {
    return Object.keys(await getCachedExchangeRates())
}
    
