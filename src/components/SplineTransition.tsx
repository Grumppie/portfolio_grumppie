import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef } from "react"
import { useNearScreen } from "@/hooks/use-near-screen"
import { SplineScene } from "./ui/spline-scene"

interface SplineTransitionProps {
    enable3D?: boolean
    enableMotion?: boolean
}

function TransitionFallback() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_20%_60%,rgba(0,170,255,0.18),transparent_30%),radial-gradient(circle_at_80%_40%,rgba(255,80,80,0.15),transparent_28%)]" />
            <div className="absolute inset-x-[12%] top-[18%] h-[42%] rounded-full border border-white/10 bg-white/[0.03] blur-3xl" />
            <div className="absolute inset-x-[18%] bottom-[16%] h-[24%] rounded-full bg-white/[0.04] blur-2xl" />
        </div>
    )
}

export function SplineTransition({ enable3D = true, enableMotion = true }: SplineTransitionProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const isNearScreen = useNearScreen(sectionRef, { rootMargin: "300px 0px" })

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    const scaleX = useTransform(scrollYProgress, [0, 0.5, 1], enableMotion ? [1.06, 1, 1.06] : [1, 1, 1])

    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseXSpring = useSpring(x, { stiffness: 40, damping: 20 })
    const mouseYSpring = useSpring(y, { stiffness: 40, damping: 20 })
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])

    useEffect(() => {
        if (!enableMotion) return

        const handleMouseMove = (e: MouseEvent) => {
            const cx = window.innerWidth / 2
            const cy = window.innerHeight / 2
            x.set((e.clientX - cx) / cx)
            y.set((e.clientY - cy) / cy)
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [enableMotion, x, y])

    const shouldMountScene = enable3D && isNearScreen
    const sectionClassName = enable3D
        ? "relative w-full h-[100vh] md:h-[120vh] flex items-center justify-center bg-black overflow-hidden"
        : "relative w-full min-h-[18rem] flex items-center justify-center bg-black overflow-hidden py-4"
    const contentClassName = enable3D
        ? "relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none mt-[-5vh]"
        : "relative z-10 flex flex-col items-center justify-center text-center px-6 pt-2 pb-2"

    return (
        <motion.section
            ref={sectionRef}
            className={sectionClassName}
            style={{ scaleX }}
        >
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none opacity-80" />

            {shouldMountScene ? (
                <motion.div
                    className="absolute inset-0 z-0 opacity-80 mix-blend-screen"
                    style={{
                        rotateX: enableMotion ? rotateX : "0deg",
                        rotateY: enableMotion ? rotateY : "0deg",
                        perspective: "1000px",
                        transformStyle: "preserve-3d",
                        scale: 1.08,
                        y: "8vh",
                        transformOrigin: "center center",
                    }}
                >
                    <div className="w-full h-full pointer-events-none">
                        <SplineScene scene="https://prod.spline.design/KqcUpM7WQmII8YsG/scene.splinecode" />
                    </div>
                </motion.div>
            ) : (
                <TransitionFallback />
            )}

            <div className={contentClassName}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] max-w-5xl leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Precision Is the Practice
                </h2>
                <p className="mt-3 text-base md:text-lg text-zinc-300 font-normal tracking-[0.03em] max-w-3xl leading-relaxed" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
                    React, Next.js, Flutter - shipping cross-platform at production scale.<br className="hidden md:block" />
                    LangGraph, LiveKit, Deepgram, Twilio - building AI that talks, reasons, and acts.<br className="hidden md:block" />
                    Every system architected for measurable outcomes. Every deadline met or beaten.
                </p>
            </div>

            {enable3D ? (
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
            ) : null}
        </motion.section>
    )
}
