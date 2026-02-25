import { useEffect } from "react";
import { StaggerTestimonials } from "./ui/stagger-testimonials";
import { WarpDivider } from "./ui/WarpDivider";
import { SplineScene } from "./ui/spline-scene";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function Testimonials() {
    // Exaggerated Cursor Tracking for the Spline 3D heart
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for the parallax tilt
    const mouseXSpring = useSpring(x, { stiffness: 40, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 40, damping: 20 });

    // Map mouse position to rotation (intensifying the native Spline follow)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            x.set((e.clientX - cx) / cx);
            y.set((e.clientY - cy) / cy);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [x, y]);

    return (
        <section id="testimonials" className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden warp-bottom py-32">
            {/* Absolute Spline 3D Background */}
            <motion.div
                className="absolute inset-0 z-0 opacity-60 mix-blend-screen"
                style={{
                    rotateX,
                    rotateY,
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                    scale: 1.1
                }}
                ref={(node: HTMLDivElement | null) => {
                    if (node) {
                        // Prevent scroll-zooming on the 3D model
                        node.addEventListener('wheel', (e: any) => e.stopPropagation(), { capture: true, passive: true });
                    }
                }}
            >
                <div className="w-full h-full pointer-events-auto" style={{ pointerEvents: 'auto' }}>
                    <SplineScene scene="https://prod.spline.design/2CXHPy3TTVAf-20n/scene.splinecode" />
                </div>
            </motion.div>

            {/* Gradients to fade edges beautifully into the black void */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Signal Over Noise
                </h2>
                <p className="text-zinc-400 max-w-3xl text-center mb-16 tracking-wide text-base md:text-lg leading-relaxed">
                    The proof isn't in the pitch — it's in the people who come back. Founders, teams, and stakeholders who've seen what relentless delivery actually looks like.
                </p>

                <StaggerTestimonials />
            </div>

            <WarpDivider />
        </section>
    );
}
