import { lazy, Suspense } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const WebGLShader = lazy(() =>
    import("@/components/ui/web-gl-shader").then((module) => ({ default: module.WebGLShader }))
)

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

interface HeroProps {
    introComplete: boolean
    onShaderReady: () => void
    enableShader?: boolean
    enableParallax?: boolean
    lowQualityShader?: boolean
}

export function Hero({
    introComplete,
    onShaderReady,
    enableShader = true,
    enableParallax = true,
    lowQualityShader = false,
}: HeroProps) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 })
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 })
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

    const sectionRef = useRef<HTMLElement>(null)
    const isInView = useInView(sectionRef, { amount: 0.4 })
    const hasPlayedInitial = useRef(false)
    const initialRevealDone = useRef(false)

    const [showShader, setShowShader] = useState(false)
    const [revealContent, setRevealContent] = useState(false)
    const shouldMountShader = enableShader && (!introComplete || showShader)
    const showNeonFallback = !enableShader

    useEffect(() => {
        if (!enableParallax) return

        const onMove = (e: MouseEvent) => {
            x.set((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2))
            y.set((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2))
        }

        window.addEventListener("mousemove", onMove)
        return () => window.removeEventListener("mousemove", onMove)
    }, [enableParallax, x, y])

    useEffect(() => {
        if (!introComplete || hasPlayedInitial.current) return
        hasPlayedInitial.current = true

        setShowShader(enableShader)
        const t1 = setTimeout(() => setRevealContent(true), 150)
        const t2 = setTimeout(() => {
            initialRevealDone.current = true
        }, 1500)

        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
        }
    }, [enableShader, introComplete])

    useEffect(() => {
        if (!initialRevealDone.current) return

        if (isInView) {
            setRevealContent(false)
            setShowShader(false)

            const t0 = setTimeout(() => setShowShader(enableShader), 30)
            const t1 = setTimeout(() => setRevealContent(true), 150)
            return () => {
                clearTimeout(t0)
                clearTimeout(t1)
            }
        }

        setRevealContent(false)
        setShowShader(false)
    }, [enableShader, isInView])

    return (
        <section id="hero" ref={sectionRef} className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden">
            {showNeonFallback ? (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(45,212,255,0.34),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(255,64,129,0.28),transparent_22%),radial-gradient(circle_at_50%_68%,rgba(72,114,255,0.22),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%,rgba(0,0,0,0.72)_100%)]" />
                    <div className="absolute left-[-16%] top-[13%] h-24 w-[132%] rotate-[14deg] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.02),rgba(255,255,255,0.92),rgba(255,255,255,0.02))] blur-xl opacity-90" />
                    <div className="absolute right-[-12%] top-[28%] h-20 w-[80%] -rotate-[18deg] rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.02),rgba(34,211,238,0.55),rgba(217,70,239,0.08))] blur-2xl opacity-80" />
                    <div className="absolute inset-x-[8%] top-[17%] h-32 rounded-full border border-cyan-300/25 bg-cyan-300/[0.08] blur-3xl" />
                    <div className="absolute left-[5%] top-[22%] h-40 w-40 rounded-full bg-cyan-400/18 blur-[96px]" />
                    <div className="absolute left-[6%] bottom-[20%] h-48 w-48 rounded-full bg-sky-500/20 blur-[110px]" />
                    <div className="absolute right-[2%] bottom-[16%] h-52 w-52 rounded-full bg-fuchsia-500/18 blur-[120px]" />
                    <div className="absolute inset-x-0 bottom-0 h-[44%] bg-gradient-to-t from-black via-black/55 to-transparent" />
                </div>
            ) : null}

            <div className={`absolute inset-0 z-0 mix-blend-screen overflow-hidden transition-opacity duration-[1500ms] ease-out ${showShader ? "opacity-70" : "opacity-0"}`}>
                {shouldMountShader ? (
                    <Suspense fallback={null}>
                        <WebGLShader
                            onReady={onShaderReady}
                            quality={lowQualityShader ? "low" : "high"}
                            interactive={enableParallax}
                        />
                    </Suspense>
                ) : null}
            </div>

            <div
                className={`absolute inset-0 z-[2] pointer-events-none ${
                    showNeonFallback
                        ? "bg-[radial-gradient(circle_at_center,transparent_8%,rgba(0,0,0,0.62)_100%)]"
                        : "bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"
                }`}
            />
            <div
                className={`absolute inset-0 z-[2] bg-gradient-to-t from-black via-transparent to-black pointer-events-none ${
                    showNeonFallback ? "opacity-70" : "opacity-90"
                }`}
            />

            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-auto w-full" style={{ perspective: "1000px" }}>
                <motion.div
                    initial="hidden"
                    animate={revealContent ? "visible" : "hidden"}
                    variants={containerVariants}
                    style={{
                        rotateX: enableParallax ? rotateX : "0deg",
                        rotateY: enableParallax ? rotateY : "0deg",
                        transformStyle: "preserve-3d",
                    }}
                    className="flex flex-col items-center group cursor-pointer"
                >
                    <div className="relative group/title" style={{ transform: "translateZ(50px)" }}>
                        <motion.h1
                            variants={titleVariants}
                            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-500 group-hover/title:text-transparent group-hover/title:drop-shadow-[0_0_60px_rgba(255,255,255,0.8)] group-hover/title:scale-105"
                            style={{ fontFamily: "'Outfit', sans-serif", WebkitTextStroke: "1px rgba(255,255,255,0.7)" }}
                        >
                            Sarthak Pawar
                        </motion.h1>
                    </div>

                    <div style={{ transform: "translateZ(30px)" }}>
                        <motion.p
                            variants={taglineVariants}
                            className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-zinc-300 font-light tracking-[0.15em] sm:tracking-[0.25em] uppercase transition-all duration-500 group-hover:text-white group-hover:tracking-[0.35em] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        >
                            I don't ship promises. I ship products.
                        </motion.p>
                    </div>

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
