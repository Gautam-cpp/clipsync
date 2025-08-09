import AppBar from "@/components/AppBar";
import NormalUserHomePage from "@/components/NormalUserHomePage";
import roomData from "@/components/data/roomNumbers.json";
import RoomId from "@/components/RoomId";
import { privateRoomIds } from "@/utils/roomUtils";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ room: string }> }): Promise<Metadata> {
  const { room } = await params;
  
  return {
    title: `ClipSync Room ${room} - Secure File & Text Sharing`,
    description: `Join ClipSync room ${room} to sync clipboard and transfer files securely in real-time`,
    openGraph: {
      title: `ClipSync Room ${room}`,
      description: "Secure real-time file and clipboard sharing",
    },
  };
}


export default async function Home({ params }: { params: Promise<{ room: string }> }) {
  const {room} = await params;
  const {roomIds} = roomData;
 
  if(room.length!==4 ||( !roomIds.includes(room) && !privateRoomIds.includes(room))) {
    return (
      <div>
        <AppBar/>
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-2xl">Room not found</h1>
          <RoomId />
        </div>
      </div>
    )
  }

  return (
  <div>
    <AppBar/>
    <NormalUserHomePage room={room} />
  </div>
  )
}