"use client"

import { getUserAction } from "@/app/actions"
import { useQuery } from "@tanstack/react-query"
import AiPromptSettings from "./ai-prompt"
import GeneralSettings from "./general"
import { DEFAULT_SYSTEM, INSIGHTS_SYSTEM } from "@/app/constants"


export default function SettingsTab() {
  const { data: user } = useQuery({
    queryKey: ['mySettings'],
    queryFn: async () => {
      const user = await getUserAction()
      return user
    },
  });

  return (
    <>
      <div className="max-w-md mx-auto">
        <GeneralSettings
          currency={user?.currency || "USD"}
        />
        <AiPromptSettings
          aiExpensePrompt={user?.aiExpensePrompt || DEFAULT_SYSTEM}
          aiInsightPrompt={user?.aiInsightPrompt || INSIGHTS_SYSTEM}
        />
      </div>
    </>
  )
}



