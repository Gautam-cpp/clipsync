"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";

interface dialogboxProps {
  openOtpdialog: boolean;
  setOpenOtpdialog: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}

export default function OTPInput({
  openOtpdialog,
  setOpenOtpdialog,
  email,
}: dialogboxProps) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const inputs = useRef<HTMLInputElement[]>([]);

  async function verifyOtp() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await axios.post<{ success: boolean; message: string }>(
        "/api/verifyOtp",
        {
          email: email,
          otp: otp.join(""),
        }
      );

      if (result.status === 200) {
        const room = localStorage.getItem("room");
        router.push(`/${room}`);
      }

      if (result) {
        router.push("/iead00");
      }
    } catch (error: unknown) {
      console.error("Verification failed:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message || "Invalid OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function resendOtp() {
    try {
      setErrorMessage("");
      await axios.post("/api/resendOtp", { email });

      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
    } catch (error: unknown) {
      console.error("Resend failed:", error);
      if (error instanceof Error) {
        setErrorMessage(
          error.message || "Failed to resend OTP. Please try again."
        );
      }
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  if (!openOtpdialog) {
    return null;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-2xl shadow-gray-500">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-6">
          Enter OTP
        </h2>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(input) => {
                if (input) inputs.current[index] = input;
              }}
              className="w-12 h-12 text-2xl text-center border-2 border-gray-300 rounded-lg 
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          ))}
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={verifyOtp}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg 
                   hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center">
            <button
              onClick={resendOtp}
              className="text-blue-600 hover:text-blue-700 text-sm disabled:text-gray-400 transition-colors"
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </div>

          <button
            onClick={() => setOpenOtpdialog(false)}
            className="text-gray-600 hover:text-gray-800 text-sm text-center"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
