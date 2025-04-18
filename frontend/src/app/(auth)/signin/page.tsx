'use client';
import OTPInput from "@/components/OTPInput";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Signin() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [openOtpdialog, setOpenOtpdialog] = useState(false);
  const { data: session } = useSession();

  async function submitSignin() {
    setIsLoading(true);
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Email and Password field cannot be empty.");
      return;
    }
    try {
      
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      
      if (result?.error) {
        setErrorMessage(result.error);
        console.log(result.error);
        return ;
      }

      if(!session?.user.verified ){
        setOpenOtpdialog(false);
        return
      }
      const room = localStorage.getItem("roomId");
      router.push(`/${room}`);

     
    } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
        console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 px-4">
  <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-700 mb-6">Sign In</h2>

    <div className="space-y-4">
      <input
        type="text"
        placeholder="Email"
        required
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}

      <button
        onClick={submitSignin}
        disabled={isLoading}
        className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>

      <OTPInput openOtpdialog={openOtpdialog} setOpenOtpdialog={setOpenOtpdialog} email={email} />

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Sign In with Google
      </button>
    </div>
  </div>
</div>

  );
}
