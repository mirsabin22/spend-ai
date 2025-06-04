import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    callbacks: {
        session({ session, token }) {
            if (session.user && token.sub) {
                (session.user as typeof session.user & { id?: string }).id = token.sub;
            }
            return session;
        }
    }
})