"use client"

import { getAvailableCurrenciesAction, getUserAction, updateUserAction } from "@/app/actions"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsTab() {
  const [userCurrency, setUserCurrency] = useState<string | undefined>()
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([])
  const [currencySaved, setCurrencySaved] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserAction()
      setUserCurrency(user?.currency)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchCurrencies = async () => {
      const currencies = await getAvailableCurrenciesAction()
      setAvailableCurrencies(currencies)
    }
    fetchCurrencies()
  }, [])

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={userCurrency}
            onValueChange={(value) => setUserCurrency(value)}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              {availableCurrencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={async () => {
            await updateUserAction({ currency: userCurrency })
            setCurrencySaved(true)
          }}
          className="w-full"
        >
          Save
        </Button>
        {currencySaved && (
          <p className="text-green-600 text-sm">Currency saved successfully!</p>
        )}
      </div>
    </div>
  )
}