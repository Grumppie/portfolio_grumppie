"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const testimonials = [
    {
        id: 0,
        quote: "Although his specialization was in React, he jumped into mobile development and became very proficient at it. His extra mile in researching how AI technologies could be infused within the product reflects a certain maturity in approach which is admirable.",
        name: "Rahul Naik",
        role: "Founder",
        company: "Buzz.me",
        imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
        id: 1,
        quote: "Sarthak demonstrated exceptional technical skills and a strong commitment to his work. He is a true team player with a positive, can-do attitude that uplifts those around him. Given the opportunity, I would not hesitate to hire him again.",
        name: "Jatin",
        role: "CEO",
        company: "Polar AI",
        imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop"
    },
    {
        id: 2,
        quote: "He didn't just build what was asked — he anticipated how the platform should function to support growth and improve lead generation. If you're looking for someone who combines technical skill with business awareness and proactive problem-solving, Sarthak is an excellent choice.",
        name: "Aditya Magdum",
        role: "Founder",
        company: "OwlNest.in",
        imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
    },
    {
        id: 3,
        quote: "As an intern, Sarthak was always reliable and resourceful. His work exceeded our goals for six months. I've always prioritised leadership and problem-solving among my team members, and Sarthak has never failed to deliver on both fronts.",
        name: "Dhruv",
        role: "CEO",
        company: "Polar AI",
        imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    },
    {
        id: 4,
        quote: "We greatly appreciate your dedication, hard work, and the value you brought to the team during your time with us. It has been a pleasure working with you, and we wish you all the best in your future endeavors.",
        name: "Nipun Walia",
        role: "CTO",
        company: "Polar AI",
        imgSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop"
    }
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.9,
        filter: "blur(8px)",
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -300 : 300,
        opacity: 0,
        scale: 0.9,
        filter: "blur(8px)",
    }),
};

export const StaggerTestimonials: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrent(prev => {
            const next = prev + newDirection;
            if (next < 0) return testimonials.length - 1;
            if (next >= testimonials.length) return 0;
            return next;
        });
    }, []);

    // Auto-advance every 6 seconds
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => paginate(1), 6000);
        return () => clearInterval(timer);
    }, [isPaused, paginate]);

    const t = testimonials[current];

    return (
        <div
            className="relative w-full max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Main testimonial card */}
            <div className="relative min-h-[380px] md:min-h-[340px]">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={t.id}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.3 },
                            filter: { duration: 0.3 },
                            scale: { duration: 0.3 },
                        }}
                        className="absolute inset-0"
                    >
                        <div className="bg-white/5 border border-white/10 backdrop-blur-[100px] rounded-3xl p-10 md:p-12 h-full flex flex-col justify-between">
                            {/* Quote icon */}
                            <Quote className="w-8 h-8 text-white/20 mb-6 flex-shrink-0" />

                            {/* Quote text */}
                            <p className="text-white/90 text-lg md:text-xl leading-relaxed font-light tracking-wide">
                                "{t.quote}"
                            </p>

                            {/* Author row — pinned to bottom */}
                            <div className="mt-auto pt-6 border-t border-white/10">
                                <p className="text-white font-semibold text-base">{t.name}</p>
                                <p className="text-zinc-400 text-sm font-mono mt-0.5">
                                    {t.role}, {t.company}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8">
                {/* Dots */}
                <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDirection(i > current ? 1 : -1);
                                setCurrent(i);
                            }}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                i === current
                                    ? "w-8 bg-white"
                                    : "w-1.5 bg-white/20 hover:bg-white/40"
                            )}
                            aria-label={`Go to testimonial ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-3">
                    <button
                        onClick={() => paginate(-1)}
                        className={cn(
                            "flex h-10 w-10 items-center justify-center text-white transition-all duration-300 rounded-full",
                            "bg-white/5 border border-white/10 hover:bg-white/15 hover:scale-105 backdrop-blur-md"
                        )}
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        className={cn(
                            "flex h-10 w-10 items-center justify-center text-white transition-all duration-300 rounded-full",
                            "bg-white/5 border border-white/10 hover:bg-white/15 hover:scale-105 backdrop-blur-md"
                        )}
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Counter */}
            <div className="text-center mt-4">
                <span className="text-zinc-500 font-mono text-xs tracking-widest">
                    {String(current + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
                </span>
            </div>
        </div>
    );
};
