import Spline from '@splinetool/react-spline';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';

export function SplineTransition() {
    const sectionRef = useRef<HTMLElement>(null);

    // Scroll-linked morphing and stretching
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // 0 = section enters bottom of viewport, 0.5 = center, 1 = section leaves top
    // Stretch horizontally when at the edges, normal 1x at the center
    const scaleX = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

    // Chromatic aberration blur effect at the edges
    const filter = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        [
            "blur(8px) drop-shadow(10px 0 0 rgba(255,0,0,0.5)) drop-shadow(-10px 0 0 rgba(0,255,0,0.5))",
            "blur(0px) drop-shadow(0px 0 0 rgba(255,0,0,0)) drop-shadow(0px 0 0 rgba(0,255,0,0))",
            "blur(0px) drop-shadow(0px 0 0 rgba(255,0,0,0)) drop-shadow(0px 0 0 rgba(0,255,0,0))",
            "blur(8px) drop-shadow(10px 0 0 rgba(255,0,0,0.5)) drop-shadow(-10px 0 0 rgba(0,255,0,0.5))"
        ]
    );

    // Exaggerated Cursor Tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for the parallax tilt - lower stiffness for floatier feel
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
        <motion.section
            ref={sectionRef}
            className="relative w-full h-[150vh] flex items-center justify-center bg-black overflow-hidden warp-bottom"
            style={{ scaleX, filter }}
        >
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none opacity-80" />

            {/* The amplified Spline Container */}
            <motion.div
                className="absolute inset-0 z-0 opacity-80 mix-blend-screen"
                style={{
                    rotateX,
                    rotateY,
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                    scale: 1.1 // slightly scaled up to hide edges during rotation
                }}
                ref={(node: HTMLDivElement | null) => {
                    if (node) {
                        // Prevent scroll-zooming on the 3D model
                        node.addEventListener('wheel', (e: any) => e.stopPropagation(), { capture: true, passive: true });
                    }
                }}
            >
                <div className="w-full h-full pointer-events-auto" style={{ pointerEvents: 'auto' }}>
                    <Spline scene="https://prod.spline.design/KqcUpM7WQmII8YsG/scene.splinecode" />
                </div>
            </motion.div>

            {/* Typography Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none mt-[-5vh]">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] max-w-5xl leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Precision Is the Practice
                </h2>
                <p className="mt-8 text-base md:text-lg text-zinc-300 font-normal tracking-[0.05em] max-w-3xl leading-relaxed" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
                    React, Next.js, Flutter — shipping cross-platform at production scale.<br className="hidden md:block" />
                    LangGraph, LiveKit, Deepgram, Twilio — building AI that talks, reasons, and acts.<br className="hidden md:block" />
                    Every system architected for measurable outcomes. Every deadline met or beaten.
                </p>
            </div>

            {/* Bottom Gradient for seamless merge into Experience section */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </motion.section>
    );
}
