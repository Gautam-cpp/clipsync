import AppBar from "@/components/AppBar";
import NormalUserHomePage from "@/components/NormalUserHomePage";

export default async function Home({ params }: { params: Promise<{ room: string }> }) {
  const {room} = await params;
  return (
  <div>
    <AppBar/>
    <NormalUserHomePage room={room} />
  </div>
  )
}