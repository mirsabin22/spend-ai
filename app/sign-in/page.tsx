"use client"

import { FcGoogle } from "react-icons/fc"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function SignIn() {
    const { data: session } = useSession()
    if (session) {
        return redirect("/my")
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4 px-4">
            <h1 className="text-2xl font-bold">Welcome to SpendAI</h1>
            <p className="text-sm text-muted-foreground">Please sign in to continue</p>
            <Button onClick={() => signIn("google", { callbackUrl: "/my" })} className="flex items-center gap-2">
                <FcGoogle className="w-5 h-5" />
                Sign In with Google
            </Button>
        </div>
    )
}