"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import useSocket from "@/hooks/useSocket";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, FileText, Image as ImageIcon, Music, Video, Zap } from "lucide-react";
import { toast } from "sonner";

const TextEditor = dynamic(() => import("@/components/text-editor").then(mod => ({ default: mod.TextEditor })), {
    ssr: false,
    loading: () => <div className="w-full h-32 bg-muted animate-pulse rounded-xl" />,
});

export default function RoomContent({ room }: { room: string }) {
    const { wsRef, receivedFiles, message, sendText } = useSocket({ room });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    const uploadFile = (file: File) => {
        const socket = wsRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            toast.error("Socket not connected");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        // Send metadata
        socket.send(JSON.stringify({
            type: "file-meta",
            name: file.name,
            size: file.size,
            mimeType: file.type,
            payload: { room }
        }));

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result instanceof ArrayBuffer) {
                socket.send(event.target.result);
                toast.success(`Sent: ${file.name}`);
                setIsUploading(false);
                setUploadProgress(100);
                setTimeout(() => setUploadProgress(0), 1000);
            }
        };

        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                setUploadProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch {
            toast.error("Failed to copy");
        }
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
            case 'doc':
            case 'docx': return <FileText className="w-8 h-8 text-blue-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif': return <ImageIcon className="w-8 h-8 text-purple-500" />;
            case 'mp3':
            case 'wav': return <Music className="w-8 h-8 text-yellow-500" />;
            case 'mp4':
            case 'mov': return <Video className="w-8 h-8 text-green-500" />;
            default: return <FileText className="w-8 h-8 text-gray-500" />;
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* Editor Section */}
            <TextEditor
                initialContent={message}
                onUpdate={sendText}
                className="w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* File Transfer Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                >
                    <div className="p-6 border-b-2 border-border bg-muted/30">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Upload className="w-6 h-6" /> File Transfer
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div
                            className={cn(
                                "relative border-4 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer",
                                dragActive ? "border-primary bg-primary/10 scale-[1.02]" : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/20"
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <div className="flex flex-col items-center gap-4 pointer-events-none">
                                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg">Drop file to upload</p>
                                    <p className="text-sm text-muted-foreground">or click to browse</p>
                                </div>
                            </div>

                            {/* Upload Progress Overlay */}
                            {isUploading && (
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center flex-col z-10">
                                    <div className="w-64 h-4 bg-muted rounded-full overflow-hidden border border-border">
                                        <motion.div
                                            className="h-full bg-primary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="mt-2 font-mono font-bold">{uploadProgress}%</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                Received Files
                                {receivedFiles && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                            </h3>

                            <AnimatePresence mode="popLayout">
                                {receivedFiles ? (
                                    <motion.div
                                        key={receivedFiles.url}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center gap-4 p-4 rounded-lg border-2 border-border bg-background hover:bg-accent/10 transition-colors group"
                                    >
                                        <div className="shrink-0">
                                            {getFileIcon(receivedFiles.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{receivedFiles.name}</p>
                                            <p className="text-xs text-muted-foreground">Ready to download</p>
                                        </div>
                                        <a
                                            href={receivedFiles.url}
                                            download={receivedFiles.name}
                                            className="p-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                                        >
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                                        <div className="opacity-50">No files received yet...</div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Clipboard History Section (Placeholder/Future) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col"
                >
                    <div className="p-6 border-b-2 border-border bg-muted/30">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-500" /> Room Info
                        </h2>
                    </div>

                    <div className="p-8 flex flex-col items-center justify-center flex-1 space-y-8 text-center bg-dots">
                        <div>
                            <p className="text-muted-foreground mb-2 text-sm uppercase tracking-wider font-bold">Current Room ID</p>
                            <div
                                className="text-6xl font-black font-mono tracking-widest cursor-pointer hover:scale-105 transition-transform select-all"
                                onClick={() => copyToClipboard(room)}
                            >
                                {room}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Click ID to copy</p>
                        </div>

                        <div className="w-full max-w-xs p-4 bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                            ⚠️ Files are shared in real-time and are not stored on the server. Do not refresh functionality.
                        </div>

                    </div>
                </motion.div>

            </div>
        </div>
    );
}
