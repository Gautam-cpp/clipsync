'use client';
import OTPInput from "@/components/OTPInput";

import {  getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [openOtpdialog, setOpenOtpdialog] = useState(false);
  const { data: session, status } = useSession();

  async function submitSignin() {
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
        setOpenOtpdialog(true);
        return
      }

      const room = localStorage.getItem("room");

      router.push(`/${room}`);

     
    } catch (err: any) {
      setErrorMessage(err.message);
      console.log(err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Sign In</h2>
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
                    <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
                )}

          
          <button
            onClick={submitSignin}
            className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
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
