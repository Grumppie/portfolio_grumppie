"use client"

import React, { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavItem {
    name: string
    url: string
    icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}

interface NavBarProps {
    items: NavItem[]
    className?: string
}

export function NavBar({ items, className }: NavBarProps) {
    const [activeTab, setActiveTab] = useState(items[0].name)
    const [scrolled, setScrolled] = useState(false)

    // Glassmorphic morph on scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Track which section is in view based on scroll position
    useEffect(() => {
        const sectionIds = items.map(item => item.url.replace('#', ''))

        const onScroll = () => {
            const scrollY = window.scrollY
            const viewportH = window.innerHeight
            const trigger = scrollY + viewportH * 0.35 // 35% from top of viewport

            let activeIndex = 0
            sectionIds.forEach((id, i) => {
                const el = document.getElementById(id)
                if (!el) return
                const top = el.getBoundingClientRect().top + scrollY
                if (top <= trigger) {
                    activeIndex = i
                }
            })
            setActiveTab(items[activeIndex].name)
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll() // initial check
        return () => window.removeEventListener("scroll", onScroll)
    }, [items])

    const handleClick = useCallback((e: React.MouseEvent, item: NavItem) => {
        e.preventDefault()
        setActiveTab(item.name)

        // Smooth scroll to section
        const target = document.querySelector(item.url)
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [])

    return (
        <div
            className={cn(
                "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6 pointer-events-none",
                className,
            )}
        >
            <div
                className={cn(
                    "flex items-center gap-3 py-1 px-1 rounded-full shadow-lg transition-all duration-500 border pointer-events-auto",
                    scrolled
                        ? "bg-black/60 backdrop-blur-xl border-white/10"
                        : "bg-transparent backdrop-blur-sm border-white/5"
                )}
            >
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <a
                            key={item.name}
                            href={item.url}
                            onClick={(e) => handleClick(e, item)}
                            className={cn(
                                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                                "text-zinc-400 hover:text-white",
                                isActive && "text-white",
                            )}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={18} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    {/* Chromatic aberration tubelight — RGB split glow */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full overflow-visible">
                                        {/* Red channel — offset left */}
                                        <div
                                            className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-3"
                                            style={{ background: "rgba(255, 60, 60, 0.4)", mixBlendMode: "screen" }}
                                        />
                                        {/* Green/White channel — center */}
                                        <div
                                            className="absolute w-10 h-6 rounded-full blur-md -top-1 -left-1"
                                            style={{ background: "rgba(255, 255, 255, 0.5)", mixBlendMode: "screen" }}
                                        />
                                        {/* Blue channel — offset right */}
                                        <div
                                            className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-0"
                                            style={{ background: "rgba(60, 100, 255, 0.4)", mixBlendMode: "screen" }}
                                        />
                                        {/* Core bright bar */}
                                        <div className="absolute w-8 h-1 bg-white/80 rounded-full top-0 left-0" />
                                    </div>
                                </motion.div>
                            )}
                        </a>
                    )
                })}
            </div>
        </div>
    )
}
