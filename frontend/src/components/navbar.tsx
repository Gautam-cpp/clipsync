"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ModeToggle } from "./mode-toggle"
import { Github } from "lucide-react"

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-background/50 border-b border-border"
        >
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg rotate-12 flex items-center justify-center border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    <span className="text-primary-foreground font-bold text-lg">C</span>
                </div>
                <span className="font-bold text-xl tracking-tight">ClipSync</span>
            </Link>

            <div className="flex items-center gap-4">
                <a
                    href="https://github.com/gautam-cpp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                >
                    <Github className="w-6 h-6" />
                </a>
                <ModeToggle />
            </div>
        </motion.nav>
    )
}
