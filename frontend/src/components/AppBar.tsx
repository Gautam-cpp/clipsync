'use client'

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppBar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="fixed top-1 left-1/2 transform -translate-x-1/2 h-16 px-8 w-2/5 text-white shadow-md bg-gray-800 py-4 flex items-center justify-between z-50 rounded-4xl">
    {/* Logo */}
    <div>
    <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
        CLIPSYNC
    </Link>
    </div>

    
  
    {/* Authentication Buttons */}
    <div className="flex items-center gap-8">
        
      {status === "loading" ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : session ? (
        <button 
          onClick={() => signOut()} 
          className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      ) : (
        <button 
          onClick={() => router.push("/signin")} 
          className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
      )}
    </div>
  </div>
  
  );
}
