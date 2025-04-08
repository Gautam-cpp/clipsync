'use client'

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppBar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="fixed top-1 left-1/2 transform -translate-x-1/2 h-16 w-full max-w-screen-lg px-4 sm:px-8 text-white shadow-md bg-gray-800 flex items-center justify-between z-50 rounded-3xl">
  {/* Logo */}
  <div>
    <Link href="/" className="text-lg sm:text-xl font-bold hover:text-gray-300 transition-colors">
      CLIPSYNC
    </Link>
  </div>

  {/* Auth Buttons */}
  <div className="flex items-center gap-4 sm:gap-8">
    {status === "loading" ? (
      <p className="text-sm text-gray-400">Loading...</p>
    ) : session ? (
      <button 
        onClick={() => signOut()} 
        className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-red-500 rounded-md hover:bg-red-600 transition-colors"
      >
        Sign Out
      </button>
    ) : (
      <button 
        onClick={() => router.push("/signin")} 
        className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
      >
        Sign In
      </button>
    )}
  </div>
</div>

  
  );
}
