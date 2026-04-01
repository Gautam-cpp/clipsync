import { useEffect, useRef, useState } from "react";

export default function useSocket({ room }: { room: string }) {
  const [message, setMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const [receivedFiles, setReceivedFiles] = useState<{ name: string; url: string }[]>([]);

  const fileMetaRef = useRef<{ name: string; size: number } | null>(null);
  const fileBufferRef = useRef<Uint8Array[]>([]);
  const receivedSizeRef = useRef(0);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
    const ws = new WebSocket(url);

    ws.onmessage = async (event: MessageEvent) => {
      try {
        if (typeof event.data === "string") {
          const msg = JSON.parse(event.data);

          if (msg.type === "file-meta") {
            fileMetaRef.current = { name: msg.name, size: msg.size };
            fileBufferRef.current = [];
            receivedSizeRef.current = 0;
            return;
          }

          if (msg.type === "text-update") {
            setMessage(msg.content);
            return;
          }
        } else {
          const chunk = new Uint8Array(await event.data.arrayBuffer());
          fileBufferRef.current.push(chunk);
          receivedSizeRef.current += chunk.length;

          const meta = fileMetaRef.current;
          if (meta && receivedSizeRef.current >= meta.size) {
            const blob = new Blob(fileBufferRef.current as unknown as BlobPart[]);
            const url = URL.createObjectURL(blob);

            setReceivedFiles(prev => [...prev, { name: meta.name, url }]);

            fileMetaRef.current = null;
            fileBufferRef.current = [];
            receivedSizeRef.current = 0;
          }
        }
      } catch (error) {
        console.error("WebSocket onmessage error:", error);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", payload: { room } }));
    };

    return () => {
      setReceivedFiles(prev => {
        prev.forEach(f => URL.revokeObjectURL(f.url));
        return [];
      });
      ws.close();
    };
  }, [room]);

  const sendText = (text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "msg", payload: { chat: text } }));
    }
  };

  return { message, setMessage, wsRef, receivedFiles, sendText };
}