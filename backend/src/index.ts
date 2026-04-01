import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
dotenv.config();

const PORT = parseInt(process.env.PORT || "8080", 10);

const wss = new WebSocketServer({ port: PORT, host: "0.0.0.0" });

const allSockets = new Map<WebSocket, string>();
const roomLastMessage = new Map<string, string>();

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

      const lastMessage = roomLastMessage.get(room);
      if (lastMessage) {
        socket.send(JSON.stringify({ type: "text-update", content: lastMessage }));
      }
    }

    if (parsedMessage.type === "msg") {
      const room = allSockets.get(socket);
      const chat = parsedMessage.payload.chat.toString();

      if (room) {
        roomLastMessage.set(room, chat);
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