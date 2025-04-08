"use client"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateRoomId } from "@/components/RoomId";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const roomId = localStorage.getItem("roomId");
      if (roomId) {
        router.replace(`/${roomId}`); 
      } else {
        const room = generateRoomId();
        router.replace(`/${room}`);
      }
    }
  }, [router]);

  return null; 
}
