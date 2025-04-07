
import { use, useEffect, useRef, useState } from "react";

export default function useSocket({room}:{room:string}) {
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
              } catch (err) {
                setMessage(event.data);
              }
            } else {
             
              const chunk = new Uint8Array(await event.data.arrayBuffer());
              fileBufferRef.current.push(chunk);
              receivedSizeRef.current += chunk.length;
      
              const meta = fileMetaRef.current;
              if (meta && receivedSizeRef.current >= meta.size) {
                const blob = new Blob(fileBufferRef.current);
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
      }, []);
      
      return{
        message,
        setMessage,
        wsRef,
        receivedFiles,


      }
}