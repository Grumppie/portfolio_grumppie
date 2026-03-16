"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { testimonials } from "@/content/portfolio"

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
}

const SWIPE_THRESHOLD = 50

export const StaggerTestimonials: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const isDragging = useRef(false)
  const autoAdvanceTimeoutRef = useRef<number | null>(null)

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrent((previous) => {
      const next = previous + newDirection
      if (next < 0) return testimonials.length - 1
      if (next >= testimonials.length) return 0
      return next
    })
  }, [])

  const clearAutoAdvanceTimeout = useCallback(() => {
    if (autoAdvanceTimeoutRef.current !== null) {
      window.clearTimeout(autoAdvanceTimeoutRef.current)
      autoAdvanceTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    clearAutoAdvanceTimeout()
    if (isPaused) return

    autoAdvanceTimeoutRef.current = window.setTimeout(() => {
      paginate(1)
    }, 6000)

    return clearAutoAdvanceTimeout
  }, [clearAutoAdvanceTimeout, current, isPaused, paginate])

  useEffect(() => {
    return clearAutoAdvanceTimeout
  }, [clearAutoAdvanceTimeout])

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info

    if (offset.x < -SWIPE_THRESHOLD || velocity.x < -500) {
      paginate(1)
    } else if (offset.x > SWIPE_THRESHOLD || velocity.x > 500) {
      paginate(-1)
    }

    setTimeout(() => {
      isDragging.current = false
    }, 10)
  }

  const testimonial = testimonials[current]

  return (
    <div
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[420px] sm:min-h-[380px] md:min-h-[340px] cursor-grab active:cursor-grabbing">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={testimonial.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragStart={() => {
              isDragging.current = true
            }}
            onDragEnd={handleDragEnd}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              filter: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            className="absolute inset-0 touch-pan-y"
          >
            <div className="bg-white/5 border border-white/10 backdrop-blur-[100px] rounded-3xl p-6 sm:p-10 md:p-12 h-full flex flex-col justify-between select-none">
              <Quote className="w-8 h-8 text-white/20 mb-6 flex-shrink-0" />

              <p className="text-white/90 text-lg md:text-xl leading-relaxed font-light tracking-wide">
                "{testimonial.quote}"
              </p>

              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-white font-semibold text-base">{testimonial.name}</p>
                <p className="text-zinc-400 text-sm font-mono mt-0.5">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1)
                setCurrent(index)
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === current ? "w-8 bg-white" : "w-1.5 bg-white/20 hover:bg-white/40"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

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

      <div className="text-center mt-4">
        <span className="text-zinc-500 font-mono text-xs tracking-widest">
          {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
