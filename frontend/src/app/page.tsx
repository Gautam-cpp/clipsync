"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Upload, Zap } from "lucide-react";
import { generateRoomId } from "@/utils/roomUtils";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  const router = useRouter();
  const [roomIdInput, setRoomIdInput] = useState("");

  const handleCreateRoom = () => {
    const room = generateRoomId();
    if (typeof window !== "undefined") {
      localStorage.setItem("roomId", room);
    }
    router.push(`/${room}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomIdInput.trim()) {
      router.push(`/${roomIdInput.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden relative">
      {/* Background Patterns */}
      <div className="absolute inset-0 z-[-1] opacity-20 dark:opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-teal-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full blur-3xl opacity-50"></div>
      </div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-10 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="max-w-4xl w-full"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-1.5 rounded-full border-2 border-foreground bg-accent text-accent-foreground text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              Sync in realtime
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Clipboard Sync <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Made Simple.
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Share text and files instantly between devices. No login required. Just create a room and start syncing.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button size="lg" variant="quirky" onClick={handleCreateRoom} className="text-lg h-14 px-8">
              <Zap className="mr-2 h-5 w-5" /> Start New Room
            </Button>

            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                className="h-14 px-4 rounded-md border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all placeholder:text-muted-foreground"
              />
              <Button type="submit" size="lg" variant="outline" className="h-14 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-accent hover:text-accent-foreground">
                Join
              </Button>
            </form>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 text-left">
            {[
              { icon: Zap, title: "Real-time Sync", desc: "Instantly copy text across devices with zero latency." },
              { icon: Upload, title: "File Transfer", desc: "Share files securely without any file size limits." },
              { icon: Copy, title: "One-Click Copy", desc: "Copy shared content to your clipboard with a single click." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded-xl border-2 border-border bg-card/50 backdrop-blur-sm hover:border-primary transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + idx * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
