"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="text-center mt-10">Loading...</div>
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 px-4">
        <h1 className="text-2xl font-bold">Welcome to SpendAI</h1>
        <p className="text-sm text-muted-foreground">Please sign in to continue</p>
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    )
  }

  const user = session.user!

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 px-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          {user.image && <AvatarImage src={user.image} />}
          <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="space-y-3 w-full max-w-xs">
        <Link href="/my">
          <Button className="w-full" variant="outline">💼 My Transactions</Button>
        </Link>
        <Link href="/aiplayground">
          <Button className="w-full" variant="outline">🧠 AI Playground</Button>
        </Link>
        <Button className="w-full" variant="destructive" onClick={() => signOut()}>Sign Out</Button>
      </div>
    </div>
  )
}

