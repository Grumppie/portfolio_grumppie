import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

/**
 * WarpDivider — Scroll-driven curved section boundary with RGB chromatic aberration.
 * 
 * The curve dynamically morphs as the user scrolls through it:
 *   - Curve height expands from flat → full arc
 *   - RGB channels spread apart (chromatic aberration intensifies)
 *   - Opacity fades in
 * 
 * Props:
 *   flip — if true, renders at the top of a section (flipped vertically)
 */
export function WarpDivider({ flip = false }: { flip?: boolean }) {
    const ref = useRef<HTMLDivElement>(null)

    // Track scroll progress through the divider element
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"] // 0 = element enters viewport bottom, 1 = element exits viewport top
    })

    // Dynamic values driven by scroll
    const curveHeight = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 80, 100, 60])
    const redOffset = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, -6, -4, 0])
    const blueOffset = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 6, 4, 0])
    const aberrationOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0.2, 0.25, 0.15, 0])
    const lineOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.15, 0.12, 0])

    return (
        <div
            ref={ref}
            className={`absolute ${flip ? 'top-0' : 'bottom-0'} left-0 w-full z-30 pointer-events-none`}
            style={{
                height: "150px",
                transform: flip ? "scaleY(-1)" : undefined,
            }}
        >
            {/* Red channel — shifts up with scroll */}
            <motion.div
                className="absolute bottom-0 left-0 w-full overflow-hidden"
                style={{
                    height: curveHeight,
                    y: redOffset,
                }}
            >
                <svg
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                    style={{ mixBlendMode: "screen" }}
                >
                    <motion.path
                        d="M0,100 C360,0 1080,0 1440,100 L1440,100 L0,100 Z"
                        style={{ fill: `rgba(255, 0, 0, 0.2)`, opacity: aberrationOpacity }}
                    />
                </svg>
            </motion.div>

            {/* Green channel — stays centered */}
            <motion.div
                className="absolute bottom-0 left-0 w-full overflow-hidden"
                style={{ height: curveHeight }}
            >
                <svg
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                    style={{ mixBlendMode: "screen" }}
                >
                    <motion.path
                        d="M0,100 C360,0 1080,0 1440,100 L1440,100 L0,100 Z"
                        style={{ fill: `rgba(0, 255, 0, 0.12)`, opacity: aberrationOpacity }}
                    />
                </svg>
            </motion.div>

            {/* Blue channel — shifts down with scroll */}
            <motion.div
                className="absolute bottom-0 left-0 w-full overflow-hidden"
                style={{
                    height: curveHeight,
                    y: blueOffset,
                }}
            >
                <svg
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                    style={{ mixBlendMode: "screen" }}
                >
                    <motion.path
                        d="M0,100 C360,0 1080,0 1440,100 L1440,100 L0,100 Z"
                        style={{ fill: `rgba(0, 0, 255, 0.2)`, opacity: aberrationOpacity }}
                    />
                </svg>
            </motion.div>

            {/* White edge line — subtle stroke along the curve */}
            <motion.div
                className="absolute bottom-0 left-0 w-full overflow-hidden"
                style={{ height: curveHeight }}
            >
                <svg
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                >
                    <motion.path
                        d="M0,100 C360,0 1080,0 1440,100"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="0.5"
                        style={{ opacity: lineOpacity }}
                    />
                </svg>
            </motion.div>
        </div>
    )
}
