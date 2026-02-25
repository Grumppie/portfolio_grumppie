import { WebGLShader } from "@/components/ui/web-gl-shader"
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

/* ──────────────────────────────────────────────────────────
 * Hero Section
 * 
 * Single fluid shader background + content reveal animation.
 * Content reveals via opacity+blur on initial load and scroll re-entry.
 * ────────────────────────────────────────────────────────── */

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.15 }
    }
}

const titleVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(16px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
}

const taglineVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const roleVariants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } }
}

export function Hero({ introComplete, onShaderReady }: { introComplete: boolean; onShaderReady: () => void }) {
    // ── Mouse tracking ──
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 })
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 })
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

    // ── Refs & State ──
    const sectionRef = useRef<HTMLElement>(null)
    const isInView = useInView(sectionRef, { amount: 0.4 })
    const hasPlayedInitial = useRef(false)
    const initialRevealDone = useRef(false)

    const [showShader, setShowShader] = useState(false)
    const [revealContent, setRevealContent] = useState(false)

    // ── Mouse listener ──
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            x.set((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2))
            y.set((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2))
        }
        window.addEventListener("mousemove", onMove)
        return () => window.removeEventListener("mousemove", onMove)
    }, [x, y])

    // ── Initial reveal after intro completes ──
    useEffect(() => {
        if (!introComplete || hasPlayedInitial.current) return
        hasPlayedInitial.current = true

        setShowShader(true)
        const t1 = setTimeout(() => setRevealContent(true), 150)
        const t2 = setTimeout(() => { initialRevealDone.current = true }, 1500)

        return () => { clearTimeout(t1); clearTimeout(t2) }
    }, [introComplete])

    // ── Re-trigger on scroll re-entry ──
    useEffect(() => {
        if (!initialRevealDone.current) return

        if (isInView) {
            setRevealContent(false)
            setShowShader(false)

            // Brief reset then reveal
            const t0 = setTimeout(() => setShowShader(true), 30)
            const t1 = setTimeout(() => setRevealContent(true), 150)
            return () => { clearTimeout(t0); clearTimeout(t1) }
        } else {
            setRevealContent(false)
            setShowShader(false)
        }
    }, [isInView])

    return (
        <section id="hero" ref={sectionRef} className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden warp-bottom">

            {/* Single fluid shader background */}
            <div className={`absolute inset-0 z-0 mix-blend-screen overflow-hidden transition-opacity duration-[1500ms] ease-out ${showShader ? 'opacity-50' : 'opacity-0'}`}>
                <WebGLShader onReady={onShaderReady} />
            </div>

            {/* Vignette overlays */}
            <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black via-transparent to-black opacity-90 pointer-events-none" />

            {/* Content — 3D perspective tracking */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-auto w-full" style={{ perspective: "1000px" }}>
                <motion.div
                    initial="hidden"
                    animate={revealContent ? "visible" : "hidden"}
                    variants={containerVariants}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="flex flex-col items-center group cursor-pointer"
                >
                    {/* Name */}
                    <div className="relative group/title" style={{ transform: "translateZ(50px)" }}>
                        <motion.h1
                            variants={titleVariants}
                            className="text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-500 group-hover/title:text-transparent group-hover/title:drop-shadow-[0_0_60px_rgba(255,255,255,0.8)] group-hover/title:scale-105"
                            style={{ fontFamily: "'Outfit', sans-serif", WebkitTextStroke: "1px rgba(255,255,255,0.7)" }}
                        >
                            Sarthak Pawar
                        </motion.h1>
                    </div>

                    {/* Tagline */}
                    <div style={{ transform: "translateZ(30px)" }}>
                        <motion.p
                            variants={taglineVariants}
                            className="mt-6 text-lg md:text-xl text-zinc-300 font-light tracking-[0.25em] uppercase transition-all duration-500 group-hover:text-white group-hover:tracking-[0.35em] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        >
                            I don't ship promises. I ship products.
                        </motion.p>
                    </div>

                    {/* Role */}
                    <div style={{ transform: "translateZ(20px)" }}>
                        <motion.p
                            variants={roleVariants}
                            className="mt-4 text-xs md:text-sm font-mono text-zinc-500 tracking-[0.3em] uppercase transition-all duration-500 group-hover:text-zinc-400"
                        >
                            Software Engineer // AI Systems
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
