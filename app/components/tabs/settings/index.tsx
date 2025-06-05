"use client"

import { getUserAction } from "@/app/actions"
import { useQuery } from "@tanstack/react-query"
import AiPromptSettings from "./ai-prompt"
import GeneralSettings from "./general"

const getMyQuery = () => {
  return useQuery({
    queryKey: ['mySettings'],
    queryFn: async () => {
      const user = await getUserAction()
      return user
    },
  })
}

export default function SettingsTab() {
  const { data: user } = getMyQuery()

  return (
    <>
      <div className="max-w-md mx-auto">
        <GeneralSettings
          user={user!}
        />
        <AiPromptSettings
          user={user!}
        />
      </div>
    </>
  )
}



