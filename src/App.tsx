import { useState, useCallback, useEffect, useRef } from "react"
import { Home, Briefcase, MessageSquare, Mail } from "lucide-react"
import { NavBar } from "./components/ui/tubelight-navbar"
import { Hero } from "./components/Hero"
import { Testimonials } from "./components/Testimonials"
import { Experience } from "./components/Experience"
import { IntroSequence } from "./components/IntroSequence"
import { SplineTransition } from "./components/SplineTransition"
import { Contact } from "./components/Contact"

const navItems = [
  { name: "Home", url: "#hero", icon: Home },
  { name: "Experience", url: "#experience", icon: Briefcase },
  { name: "Testimonials", url: "#testimonials", icon: MessageSquare },
  { name: "Contact", url: "#contact", icon: Mail },
]

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [shadersReady, setShadersReady] = useState(false)
  const [glowColor, setGlowColor] = useState<string[] | null>(null)
  const [lastGlow, setLastGlow] = useState<string[] | null>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const glowRef = useRef<HTMLDivElement>(null)

  // Keep last glow color so the fade-out uses the real gradient instead of 'none'
  useEffect(() => {
    if (glowColor) setLastGlow(glowColor)
  }, [glowColor])

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  // Track mouse position globally (only when glow is active)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    if (glowColor) {
      window.addEventListener("mousemove", onMove)
    }
    return () => window.removeEventListener("mousemove", onMove)
  }, [glowColor])

  const onShaderReady = useCallback(() => {
    setShadersReady(true)
  }, [])

  const buildGlow = (layers: string[]) => {
    return layers.map(layer => {
      return layer.replace(/at (\d+)% (\d+)%/, (_, ox, oy) => {
        const bx = Math.round(Number(ox) * 0.3 + mousePos.x * 0.7)
        const by = Math.round(Number(oy) * 0.3 + mousePos.y * 0.7)
        return `at ${bx}% ${by}%`
      })
    }).join(', ')
  }


  return (
    <main className="min-h-screen text-white antialiased selection:bg-white/20 w-full relative overflow-clip">
      {!introComplete && (
        <IntroSequence
          shadersReady={shadersReady}
          onComplete={() => setIntroComplete(true)}
        />
      )}

      {/* Tubelight Navbar — only visible after intro */}
      {introComplete && <NavBar items={navItems} />}

      {/* App-wide cursor-reactive multi-color radial glow */}
      <div
        ref={glowRef}
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{
          opacity: glowColor ? 1 : 0,
          background: buildGlow(glowColor ?? lastGlow ?? []),
          transition: 'opacity 1s ease-in-out, background 1.2s ease-in-out',
        }}
      />

      <Hero introComplete={introComplete} onShaderReady={onShaderReady} />
      <SplineTransition />
      <Experience onHoverGlow={setGlowColor} />
      <Testimonials />
      <Contact />

      <footer className="h-32 pb-16 sm:pb-0 flex items-center justify-center bg-black border-t border-white/10">
        <p className="text-zinc-500 font-mono text-sm">SIGNAL ACTIVE // 2026</p>
      </footer>
    </main>
  );
}
