import AppBar from "@/components/AppBar";
import NormalUserHomePage from "@/components/NormalUserHomePage";
import roomData from "@/components/data/roomNumbers.json";
import RoomId from "@/components/RoomId";
import { privateRoomIds } from "@/utils/roomUtils";


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