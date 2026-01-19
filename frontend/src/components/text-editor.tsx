"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileText, Check, Loader2 } from "lucide-react";

interface TextEditorProps {
    initialContent: string;
    onUpdate: (content: string) => void;
    className?: string;
}

export function TextEditor({ initialContent, onUpdate, className }: TextEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isSyncing, setIsSyncing] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    // Sync internal state with external updates (but only if not currently typing/debouncing too aggressively)
    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        setIsSyncing(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            onUpdate(newContent);
            setIsSyncing(false);
        }, 500); // 500ms debounce
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "bg-card border-2 border-border rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col h-[500px]",
                className
            )}
        >
            <div className="p-4 border-b-2 border-border bg-muted/30 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Real-time Editor
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono">
                    {isSyncing ? (
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Syncing...
                        </span>
                    ) : (
                        <span className="text-green-500 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Synced
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 p-0 relative">
                <textarea
                    value={content}
                    onChange={handleChange}
                    placeholder="Type here to share text..."
                    className="w-full h-full p-6 bg-background resize-none focus:outline-none font-mono text-sm sm:text-base"
                />
            </div>
        </motion.div>
    );
}
