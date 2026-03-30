import { WebSocketServer, WebSocket } from "ws";

interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}
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
    port: 19406
  },
});


redis.on("connect", () => {
  console.log("connected to redis");
  console.log("UP and running ")
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
const rooms = new Map<string, Set<WebSocket>>();

wss.on("connection", (socket: ExtWebSocket) => {
  socket.isAlive = true;
  socket.on("pong", () => {
    socket.isAlive = true;
  });
  socket.on("message", async (message, isBinary) => {
    if (isBinary) {
      const room = allSockets.get(socket);
      if (room) {
        rooms.get(room)?.forEach((s) => {
          if (s.readyState === WebSocket.OPEN) {
            s.send(message, { binary: true });
          }
        });
      }
      return;
    }

    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "join") {
      const room = parsedMessage.payload.room;
      allSockets.set(socket, room);

      if (!rooms.has(room)) rooms.set(room, new Set());
      rooms.get(room)?.add(socket);

      let lastMessage: string | null = null;
      try {
        if (redis.isOpen) {
          lastMessage = await redis.get(`room:${room}:lastMessage`);
        }
      } catch (err) {
        console.error("Redis get error:", err);
      }

      if (lastMessage && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "text-update", content: lastMessage }));
      }
    }

    if (parsedMessage.type === "msg") {
      const room = allSockets.get(socket);
      const chat = parsedMessage.payload.chat.toString();

      if (room) {
        const broadcastMsg = JSON.stringify({ type: "text-update", content: chat });

        // 1. Broadcast immediately to WebSocket clients (PURE ZERO LATENCY)
        rooms.get(room)?.forEach((s) => {
          if (s.readyState === WebSocket.OPEN) {
            s.send(broadcastMsg);
          }
        });

        // 2. Persist to Redis asynchronously in the background
        if (redis.isOpen) {
          redis.set(`room:${room}:lastMessage`, chat, { EX: 86400 }).catch(err => {
            console.error("Redis set error:", err);
          });
        }
      }
    }

    if (parsedMessage.type === "file-meta") {
      const metaString = JSON.stringify(parsedMessage);
      const room = parsedMessage.payload.room;

      rooms.get(room)?.forEach((s) => {
        if (s.readyState === WebSocket.OPEN) {
          s.send(metaString);
        }
      });
    }
  });

  socket.on("close", () => {
    console.log("closed");
    const room = allSockets.get(socket);
    if (room) {
      rooms.get(room)?.delete(socket);
      if (rooms.get(room)?.size === 0) {
        rooms.delete(room);
      }
    }
    allSockets.delete(socket);
  });
});

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const extWs = ws as ExtWebSocket;
    if (extWs.isAlive === false) {
      extWs.terminate();
      return;
    }

    extWs.isAlive = false;
    extWs.ping();
  });
}, 30000);

wss.on("close", () => {
  clearInterval(interval);
});
