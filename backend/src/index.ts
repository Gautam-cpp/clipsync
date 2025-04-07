import { WebSocketServer, WebSocket } from "ws";
import Redis from "ioredis";

const wss = new WebSocketServer({ port: 8080 });

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

redis.on("connect", () => {
  console.log("connected to redis");
});

const allSockets = new Map<WebSocket, string>();

wss.on("connection",  (socket) => {
  socket.on("message", async (message, isBinary) => {
    
    if (isBinary) {
      const room = allSockets.get(socket);
      allSockets.forEach((r, s) => {
        if (r === room) {
          s.send(message, { binary: true });
        }
      });
      return;
    }
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type == "join") {
      
      allSockets.set(socket, parsedMessage.payload.room);

      const lastMessage = await redis.hget(
        "roomMessages",
        parsedMessage.payload.room
      );

      if (lastMessage) {
        socket.send(lastMessage);
      }
    }

    if (parsedMessage.type == "msg") {
      const room = allSockets.get(socket);
       
        
      await redis.hset(
        "roomMessages",
        room || "",
        parsedMessage.payload.chat.toString()
      );

      allSockets.forEach((room, s) => {
        if (room === parsedMessage.payload.room) {
          s.send(parsedMessage.payload.chat.toString());
        }
      });
    }

    if (parsedMessage.type == "file-meta") {
      
      const metaString = JSON.stringify(parsedMessage); 
      allSockets.forEach((room, s) => {
        if (room === parsedMessage.payload.room) {
          s.send(metaString); 
        }
      });
    }
    
  });

  socket.on("close", () => {
    console.log("closed");
    allSockets.delete(socket);
  });
});
