import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useNearScreen } from "@/hooks/use-near-screen"
import { StaggerTestimonials } from "./ui/stagger-testimonials"
import { WarpDivider } from "./ui/WarpDivider"
import { SplineScene } from "./ui/spline-scene"

interface TestimonialsProps {
    enable3D?: boolean
    enableMotion?: boolean
}

function TestimonialsFallback() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.1),transparent_26%),radial-gradient(circle_at_30%_55%,rgba(255,60,120,0.16),transparent_24%),radial-gradient(circle_at_70%_55%,rgba(40,120,255,0.16),transparent_24%)]" />
            <div className="absolute left-1/2 top-[18%] h-[42%] w-[42%] min-w-[240px] -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.03] blur-3xl" />
        </div>
    )
}

export function Testimonials({ enable3D = true, enableMotion = true }: TestimonialsProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const isNearScreen = useNearScreen(sectionRef, { rootMargin: "300px 0px" })

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

    return (
        <section id="testimonials" ref={sectionRef} className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden warp-bottom py-20">
            {shouldMountScene ? (
                <motion.div
                    className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none"
                    style={{
                        rotateX: enableMotion ? rotateX : "0deg",
                        rotateY: enableMotion ? rotateY : "0deg",
                        perspective: "1000px",
                        transformStyle: "preserve-3d",
                        scale: 1.06
                    }}
                >
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <div className="w-[100%] h-[90%] md:w-full md:h-full pointer-events-none">
                            <SplineScene scene="https://prod.spline.design/2CXHPy3TTVAf-20n/scene.splinecode" />
                        </div>
                    </div>
                </motion.div>
            ) : (
                <TestimonialsFallback />
            )}

            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Signal Over Noise
                </h2>
                <p className="text-zinc-400 max-w-3xl text-center mb-10 tracking-wide text-base md:text-lg leading-relaxed">
                    The proof is not in the pitch - it is in the people who come back. Founders, teams, and stakeholders who have seen what relentless delivery actually looks like.
                </p>

                <StaggerTestimonials />
            </div>

            <WarpDivider />
        </section>
    )
}
