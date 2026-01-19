import { WebSocketServer, WebSocket } from "ws";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const PORT = parseInt(process.env.PORT || "8080", 10);

const wss = new WebSocketServer({ port: PORT });

const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 15725
  },
});

redis.on("connect", () => {
  console.log("connected to redis");
});

redis.on("error", (err) => {
  console.log(process.env.REDIS_PASSWORD);
  console.error("Redis error:", err);
});

async function redisConnect() {
  try {
    await redis.connect();
  } catch (error) {
    console.error("Redis connection error:", error);
  }
}

redisConnect();

const allSockets = new Map<WebSocket, string>();

wss.on("connection", (socket: WebSocket) => {
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

    if (parsedMessage.type === "join") {
      const room = parsedMessage.payload.room;
      allSockets.set(socket, room);

      const lastMessage = await redis.get(`room:${room}:lastMessage`);
      if (lastMessage) {
        socket.send(JSON.stringify({ type: "text-update", content: lastMessage }));
      }
    }

    if (parsedMessage.type === "msg") {
      const room = allSockets.get(socket);
      const chat = parsedMessage.payload.chat.toString();

      if (room) {
        await redis.set(`room:${room}:lastMessage`, chat);
        const broadcastMsg = JSON.stringify({ type: "text-update", content: chat });

        allSockets.forEach((r, s) => {
          if (r === room) {
            s.send(broadcastMsg);
          }
        });
      }
    }

    if (parsedMessage.type === "file-meta") {
      const metaString = JSON.stringify(parsedMessage);
      const room = parsedMessage.payload.room;

      allSockets.forEach((r, s) => {
        if (r === room) {
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
