'use client'
import RoomId from "@/components/RoomId";
import useSocket from "@/hooks/useSocket";
import FileShare from "./FileShare";
import { useSession } from "next-auth/react";

export default function NormalUserHomePage({ room }: { room: string }) {
    const { message, setMessage, wsRef } = useSocket({room});
    const {data:session, status} =  useSession()

  return (
    <div className="flex flex-col gap-15 pt-28 items-center min-h-screen bg-gray-100">
      <RoomId />
      <div className="w-full md:max-w-5xl max-w-md p-6 bg-white rounded-lg shadow-md">
        <textarea
          className="w-full h-80 p-3 mb-4 text-gray-700 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />

        <div className="flex space-x-3">
          <button
            className="flex px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => {
              wsRef.current?.send(
                JSON.stringify({
                  type: "msg",
                  payload: {
                    room: room,
                    chat: message,
                  },
                })
              );
            }}
          >
            Send
          </button>
          <button
            className="flex px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            onClick={() => navigator.clipboard.writeText(message)}
          >
            Copy
          </button>
          <button
            className="flex px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            onClick={() => setMessage("")}
          >
            Clear
          </button>
        </div>

        <div className="bg-gray-800 w-full h-1  mt-10">

        </div>
        {
          session?.user && (<FileShare room={room} />)
        }
        
      
      </div>
    </div>
  );
}
