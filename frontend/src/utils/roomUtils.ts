export const privateRoomIds: string[] =
  process.env.NEXT_PUBLIC_PRIVATE_ROOMID
    ? process.env.NEXT_PUBLIC_PRIVATE_ROOMID.split(",").map((id: string) => id.trim())
    : [];
