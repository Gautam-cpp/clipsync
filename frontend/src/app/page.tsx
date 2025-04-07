"use client"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const roomId = localStorage.getItem("roomId");
      if (roomId) {
        router.replace(`/${roomId}`); 
      } else {
        router.replace('/iead00'); 
      }
    }
  }, [router]);

  return null; 
}
