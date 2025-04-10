"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function generateRoomId() {
  const char = "123456789abcdefghjkmnopqrstuvwxyzABCDEFGHJKMNOPQRSTUVWXYZ";
  let roomId = "";
  for (let i = 0; i < 4; i++) {
    roomId += char[Math.floor(Math.random() * char.length)];
  }
  return roomId;
}

export default function RoomId() {
  const router = useRouter();
  const [room, setRoom] = useState("");
  const [buttonText, setButtonText] = useState("copy");

  const handleCopy = () => {
    navigator.clipboard.writeText(room);
    setButtonText("copied");

    setTimeout(() => {
      setButtonText("copy");
    }, 2000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRoom(`${window.location.host}${window.location.pathname}`);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <div className="flex gap-4 w-full">
      <div className="w-full p-4 bg-amber-200 rounded-lg text-center">
        <p className="font-medium text-gray-800 break-all">{room}</p>
      </div>
      <button
        onClick={handleCopy}
        className="sm:w-auto p-4 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        {buttonText === 'copy' ? (
          <Image src="/copy.svg" alt="Copy" width={20} height={20} />
        ) : (
          <Image src="/done.svg" alt="Copied" width={20} height={20} />
        )}
      </button>
    </div>
    <button
      onClick={() => {
        const newRoom = generateRoomId();
        setRoom(newRoom);
        router.push(`/${newRoom}`);
        localStorage.setItem("roomId", newRoom);
      }}
      className="w-full mt-4 py-3 px-5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors font-medium"
    >
      Generate new link
    </button>
  </div>
  
  );
}
