
import { useEffect, useRef, useState } from "react";

export default function useSocket({ room }: { room: string }) {
  const [message, setMessage] = useState("");
  const wsRef = useRef<WebSocket>(null);
  const [receivedFiles, setReceivedFiles] = useState<{ name: string; url: string } | null>(null);

  const fileMetaRef = useRef<{ name: string; size: number } | null>(null);
  const fileBufferRef = useRef<Uint8Array[]>([]);
  const receivedSizeRef = useRef(0);


  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
    const ws = new WebSocket(url);

    ws.onmessage = async (event: MessageEvent) => {
      try {
        if (typeof event.data === "string") {
          try {
            const msg = JSON.parse(event.data);

            if (msg.type === "file-meta") {
              console.log("📄 Received file metadata:", msg);
              fileMetaRef.current = { name: msg.name, size: msg.size };
              fileBufferRef.current = [];
              receivedSizeRef.current = 0;
              return;
            }
            if (msg.type === "text-update") {
              setMessage(msg.content);
              return;
            }
          } catch (err) {
            // Ignore JSON parse errors for non-JSON messages if any legacy exist
            console.log(err);
          }
        } else {

          const chunk = new Uint8Array(await event.data.arrayBuffer());
          fileBufferRef.current.push(chunk);
          receivedSizeRef.current += chunk.length;

          const meta = fileMetaRef.current;
          if (meta && receivedSizeRef.current >= meta.size) {
            const blob = new Blob(fileBufferRef.current as unknown as BlobPart[]);
            const url = URL.createObjectURL(blob);

            setReceivedFiles({ name: meta.name, url });
            console.log(`✅ File "${meta.name}" fully received`);


            fileMetaRef.current = null;
            fileBufferRef.current = [];
            receivedSizeRef.current = 0;
          }
        }
      } catch (error) {
        console.error("WebSocket onmessage error:", error);
      }
    };

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            room: room,
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, [room]);

  const sendText = (text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "msg",
        payload: {
          chat: text
        }
      }));
    }
  };

  return {
    message,
    setMessage,
    wsRef,
    receivedFiles,
    sendText
  }
}