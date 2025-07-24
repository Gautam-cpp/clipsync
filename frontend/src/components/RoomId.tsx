"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import roomData from "./data/roomData.json";
import { privateRoomIds } from "@/utils/roomUtils";

export function generateRoomId(): string {
  const { roomIds } = roomData;
  const randomIndex = Math.floor(Math.random() * roomIds.length);
  return roomIds[randomIndex];
}

export default function RoomId() {
  const { roomIds } = roomData;
  const router = useRouter();
  const [room, setRoom] = useState<string>("");
  const [buttonText, setButtonText] = useState<"copy" | "copied" | "error">("copy");

  const handleCopy = async () => {
    if (!room) return;
    try {
      await navigator.clipboard.writeText(room);
      setButtonText("copied");
    } catch {
      setButtonText("error");
    } finally {
      setTimeout(() => setButtonText("copy"), 2000);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname.slice(1);
    const host = window.location.origin;
    const fullUrl = `${host}/${pathname}`;
    const isValidRoom =
      roomIds.includes(pathname) || privateRoomIds.includes(pathname);

    if (isValidRoom) {
      setRoom(fullUrl);
      localStorage.setItem("roomId", pathname);
    } else {
      const stored = localStorage.getItem("roomId");
      if (stored) setRoom(`${host}/${stored}`);
      else setRoom("");
    }
  }, [roomIds]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {room && (
        <div className="flex gap-4 w-full mb-4">
          <div className="flex-grow p-4 bg-amber-200 rounded-lg text-center">
            <p className="font-medium text-gray-800 break-all">{room}</p>
          </div>
          <button
            onClick={handleCopy}
            className="p-4 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg"
            aria-label="Copy room link"
          >
            {buttonText === "copy" && (
              <Image src="/copy.svg" alt="Copy" width={20} height={20} />
            )}
            {buttonText === "copied" && (
              <Image src="/done.svg" alt="Copied" width={20} height={20} />
            )}
            {buttonText === "error" && (
              <Image src="/error.svg" alt="Error" width={20} height={20} />
            )}
          </button>
        </div>
      )}

      <button
        onClick={() => {
          const newRoom = generateRoomId();
          router.push(`/${newRoom}`);
          localStorage.setItem("roomId", newRoom);
        }}
        className="w-full py-3 px-5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors font-medium"
      >
        Generate new link
      </button>
    </div>
  );
}
