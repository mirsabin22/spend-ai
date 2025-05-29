"use server"

import { 
    getConversionRateFromUSD,
    getUser
 } from "./repository"

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
