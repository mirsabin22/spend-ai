import NextAuth, { Session } from "next-auth"
import authConfig from "@/auth.config"
import { NextRequest, NextResponse } from "next/server"
 
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req: NextRequest) {
  const session = (req as any).auth as Session

  if (session?.user) {
    console.log(`user requested ${req.url}`)
    
    return NextResponse.next()
  }

  console.log(`guest requested ${req.url}`)
})
