import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"

/**
 * IntroSequence — Loading overlay that gates the hero reveal.
 * 
 * Flow: loading → ready → glitch → burst → done (unmount + onComplete)
 * All timing is chained in a SINGLE useEffect from `shadersReady` to avoid
 * React Strict Mode double-run issues with ref guards.
 */
export function IntroSequence({ shadersReady, onComplete }: { shadersReady: boolean; onComplete: () => void }) {
    const [phase, setPhase] = useState<"loading" | "ready" | "glitch" | "burst" | "done">("loading")
    const onCompleteRef = useRef(onComplete)
    onCompleteRef.current = onComplete

    // Lock scroll while overlay is active
    useEffect(() => {
        document.body.style.overflow = "hidden"
        window.scrollTo(0, 0)
        return () => { document.body.style.overflow = "auto" }
    }, [])

    // Single chained sequence: shadersReady → ready → glitch → burst → done
    useEffect(() => {
        if (!shadersReady) return

        const t0 = setTimeout(() => setPhase("ready"), 200)
        const t1 = setTimeout(() => setPhase("glitch"), 600)
        const t2 = setTimeout(() => setPhase("burst"), 1000)
        const t3 = setTimeout(() => {
            setPhase("done")
            document.body.style.overflow = "auto"
            onCompleteRef.current()
        }, 1800)

        return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }, [shadersReady])

    if (phase === "done") return null

    const isBursting = phase === "burst"
    const isGlitching = phase === "glitch"

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-black overflow-hidden w-screen h-screen pointer-events-none flex items-center justify-center"
            animate={{ opacity: isBursting ? 0 : 1 }}
            transition={{ duration: isBursting ? 0.6 : 0, ease: [0.16, 1, 0.3, 1], delay: isBursting ? 0.15 : 0 }}
        >
            {/* RED */}
            <motion.div
                className="w-1/3 h-full shadow-[0_0_80px_#4a0000]"
                style={{ backgroundColor: "#4a0000" }}
                animate={{
                    y: isGlitching ? [0, -15, 8, -3, 0] : isBursting ? "-110vh" : 0,
                    x: isBursting ? "-10vw" : 0,
                    opacity: isBursting ? 0 : 1,
                    scaleY: isBursting ? 1.3 : 1,
                }}
                transition={{ duration: isGlitching ? 0.25 : 0.5, ease: isBursting ? [0.16, 1, 0.3, 1] : "easeInOut" }}
            />
            {/* GREEN */}
            <motion.div
                className="w-1/3 h-full z-10 shadow-[0_0_80px_#004a00]"
                style={{ backgroundColor: "#004a00" }}
                animate={{
                    y: isGlitching ? [0, 20, -10, 5, 0] : isBursting ? "110vh" : 0,
                    opacity: isBursting ? 0 : 1,
                    scaleY: isBursting ? 1.3 : 1,
                }}
                transition={{ duration: isGlitching ? 0.15 : 0.5, ease: isBursting ? [0.16, 1, 0.3, 1] : "easeInOut" }}
            />
            {/* BLUE */}
            <motion.div
                className="w-1/3 h-full shadow-[0_0_80px_#00004a]"
                style={{ backgroundColor: "#00004a" }}
                animate={{
                    y: isGlitching ? [0, -12, 15, -6, 0] : isBursting ? "-110vh" : 0,
                    x: isBursting ? "10vw" : 0,
                    opacity: isBursting ? 0 : 1,
                    scaleY: isBursting ? 1.3 : 1,
                }}
                transition={{ duration: isGlitching ? 0.3 : 0.5, ease: isBursting ? [0.16, 1, 0.3, 1] : "easeInOut" }}
            />

            {/* Scanlines */}
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(transparent,transparent_2px,black_2px,black_4px)] pointer-events-none mix-blend-multiply" />

            {/* Typography */}
            <motion.div
                className="absolute inset-0 z-50 flex flex-col items-center justify-center mix-blend-difference text-white"
                animate={{
                    opacity: isBursting ? 0 : 1,
                    scale: isBursting ? 1.15 : 1,
                    filter: isGlitching ? ["blur(0px)", "blur(12px)", "blur(0px)"] : "blur(0px)",
                    x: isGlitching ? [0, -15, 15, 0] : 0
                }}
                transition={{ duration: isBursting ? 0.15 : 0.3 }}
            >
                <div
                    className="text-xl sm:text-3xl md:text-4xl font-semibold tracking-[0.15em] sm:tracking-[0.3em] uppercase mb-3 text-center px-4"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    {phase === "loading" ? "CALIBRATING" : "LET THERE BE LIGHT"}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.15em] sm:tracking-[0.3em] uppercase opacity-50 text-center px-4">
                    {phase === "loading" ? "RENDERING LIGHT SOURCES" : "INITIALIZING"}
                </div>

                {phase === "loading" && (
                    <motion.div className="mt-6 w-16 h-[1px] bg-white/30 overflow-hidden rounded-full">
                        <motion.div
                            className="h-full bg-white/80"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                )}
            </motion.div>

            {/* White burst flash */}
            <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: isBursting ? [0, 1, 0.8, 0] : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            />
        </motion.div>
    )
}
