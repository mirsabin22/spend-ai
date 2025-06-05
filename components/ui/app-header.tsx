"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function AppHeader() {
    const { data: session } = useSession()

    return (
      <div className="flex h-14 items-center justify-between bg-white px-6 text-gray-900 border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <h1 onClick={() => window.location.reload()} className="text-lg font-semibold text-primary cursor-pointer">Spend AI</h1>
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={session?.user?.image || ""} referrerPolicy="no-referrer"/>
                <AvatarFallback>
                  {session?.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="">
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
}
