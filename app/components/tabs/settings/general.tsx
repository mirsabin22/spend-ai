"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Info } from "lucide-react"
import { getAvailableCurrenciesAction } from "@/app/actions"
import { updateUserAction } from "@/app/actions"
import { User } from "@prisma/client";

const getAvailableCurrenciesQuery = () => {
    return useQuery({
      queryKey: ['availableCurrencies'],
      queryFn: async () => {
        const currencies = await getAvailableCurrenciesAction()
        return currencies
      },
    })
  }

export default function GeneralSettings({
    user,
  }: {
    user: User
  }) {
  
    const { data: availableCurrencies } = getAvailableCurrenciesQuery()
    const [openCurrencyGuide, setOpenCurrencyGuide] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
      mutationFn: updateUserAction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['mySettings'] })
        setIsSaved(true)
        setTimeout(() => {
          setIsSaved(false)
        }, 2000)
      }
    })
    return (
      <div className="space-y-4 mt-8 p-6 bg-white rounded-lg shadow">
        {/* general settings */}
        <h1 className="text-lg font-semibold">General Settings</h1>
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="currency">Currency</Label>
            {/* guide button */}
            <Info
              size="14"
              onClick={() => setOpenCurrencyGuide(true)}
            />
          </div>
          <Dialog open={openCurrencyGuide} onOpenChange={setOpenCurrencyGuide}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Currency Settings</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground">
                Select your currency to convert your expenses to your local currency.
              </p>
            </DialogContent>
          </Dialog>
  
          {/* select currency */}
          <Select
            value={user?.currency}
            onValueChange={(value) => updateMutation.mutate({ currency: value })}
          >
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableCurrencies?.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.name} - {currency.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* availableCurrencies number */}
          <p className="text-sm text-muted-foreground">
            {availableCurrencies?.length} currencies available
          </p>
          {isSaved && (
            <p className="text-xs text-gray-500">
              Currency saved!
            </p>
          )}
        </div>
      </div>
    )
  }