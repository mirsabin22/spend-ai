import { middleware } from "@/middleware";
import Link from "next/link";

export default async function Home() {
  const session = await middleware();
  if (!session) return (
    <>
    <p>Not logged in</p>
      <Link href="/api/auth/signin">Sign in</Link>
    </>
  );
  return (
    <>
    <p>Logged in as {session?.user?.name ?? "Unknown user"}</p>
    <Link href="/api/auth/signout">Sign out</Link>
    </>
  );
}
