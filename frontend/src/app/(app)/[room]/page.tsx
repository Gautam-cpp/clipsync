import AppBar from "@/components/AppBar";
import NormalUserHomePage from "@/components/NormalUserHomePage";

export default  function Home({params}:{params:{room:string}}) {
  const {room} =  params;
  return (<div>
    <AppBar/>
    <NormalUserHomePage room={room} />
  </div>
  )
}