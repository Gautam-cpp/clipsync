import roomData from "@/components/data/roomNumbers.json";

export const privateRoomIds: string[] =
  process.env.NEXT_PUBLIC_PRIVATE_ROOMID
    ? process.env.NEXT_PUBLIC_PRIVATE_ROOMID.split(",").map((id: string) => id.trim())
    : [];

export function generateRoomId(): string {
  const { roomIds } = roomData;
  const randomIndex = Math.floor(Math.random() * roomIds.length);
  return roomIds[randomIndex];
}
