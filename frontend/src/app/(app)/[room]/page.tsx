import { Navbar } from "@/components/navbar";
import RoomContent from "@/components/room-content";
import roomData from "@/components/data/roomNumbers.json";
import { privateRoomIds } from "@/utils/roomUtils";
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ room: string }> }): Promise<Metadata> {
  const { room } = await params;

  return {
    title: `ClipSync Room ${room}`,
    description: `Join ClipSync room ${room} to sync clipboard and transfer files securely in real-time`,
  };
}


export default async function RoomPage({ params }: { params: Promise<{ room: string }> }) {
  const { room } = await params;
  const { roomIds } = roomData;

  // Simple validation
  const isValid = room.length === 4 && (roomIds.includes(room) || privateRoomIds.includes(room));

  if (!isValid) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-bold mb-4">Room Not Found 🚫</h1>
          <p className="text-muted-foreground mb-8">The room ID <b>{room}</b> does not exist.</p>
          <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:opacity-90 transition-opacity">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 z-[-1] opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <Navbar />

      <main className="flex-1 pt-24 pb-10 px-4 sm:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Sync Room <span className="text-primary">#{room}</span></h1>
          <p className="text-muted-foreground">Connected and ready to share.</p>
        </div>

        <RoomContent room={room} />
      </main>
    </div>
  )
}