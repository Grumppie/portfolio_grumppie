import { lazy, Suspense, type ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { Home, Briefcase, MessageSquare, Mail } from "lucide-react"
import { NavBar } from "./components/ui/tubelight-navbar"
import { Hero } from "./components/Hero"
import { Experience } from "./components/Experience"
import { IntroSequence } from "./components/IntroSequence"
import { Contact } from "./components/Contact"
import { useDeviceProfile } from "./hooks/use-device-profile"
import { useNearScreen } from "./hooks/use-near-screen"

const SplineTransition = lazy(() =>
  import("./components/SplineTransition").then((module) => ({ default: module.SplineTransition }))
)

const Testimonials = lazy(() =>
  import("./components/Testimonials").then((module) => ({ default: module.Testimonials }))
)

const navItems = [
  { name: "Home", url: "#hero", icon: Home },
  { name: "Experience", url: "#experience", icon: Briefcase },
  { name: "Testimonials", url: "#testimonials", icon: MessageSquare },
  { name: "Contact", url: "#contact", icon: Mail },
]

function SectionFallback({ className }: { className: string }) {
  return <div className={className} aria-hidden="true" />
}

function DeferredSection({
  id,
  className,
  rootMargin = "300px 0px",
  children,
}: {
  id?: string
  className: string
  rootMargin?: string
  children: ReactNode
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isNearScreen = useNearScreen(sectionRef, { rootMargin })

  return (
    <div id={id} ref={sectionRef} className={className}>
      {isNearScreen ? children : <SectionFallback className="w-full h-full bg-black" />}
    </div>
  )
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [shadersReady, setShadersReady] = useState(false)
  const [glowColor, setGlowColor] = useState<string[] | null>(null)
  const [lastGlow, setLastGlow] = useState<string[] | null>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const glowRef = useRef<HTMLDivElement>(null)

  const { isMobile, canHover, prefersReducedMotion } = useDeviceProfile()
  const enableHeroShader = !prefersReducedMotion
  const enableHeroParallax = canHover && !prefersReducedMotion
  const enableTransition3D = !isMobile && !prefersReducedMotion
  const enableTestimonials3D = !isMobile && !prefersReducedMotion
  const enableSectionMotion = canHover && !prefersReducedMotion
  const enableGlow = canHover && !isMobile

  useEffect(() => {
    if (glowColor) setLastGlow(glowColor)
  }, [glowColor])

  useEffect(() => {
    window.scrollTo(0, 0)
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
  }, [])

  useEffect(() => {
    if (!enableGlow) return

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
  }, [enableGlow, glowColor])

  useEffect(() => {
    if (isMobile || !enableHeroShader) {
      setShadersReady(true)
    }
  }, [enableHeroShader, isMobile])

  const onShaderReady = useCallback(() => {
    setShadersReady(true)
  }, [])

  const buildGlow = (layers: string[]) => {
    return layers
      .map((layer) => {
        return layer.replace(/at (\d+)% (\d+)%/, (_, ox, oy) => {
          const bx = Math.round(Number(ox) * 0.3 + mousePos.x * 0.7)
          const by = Math.round(Number(oy) * 0.3 + mousePos.y * 0.7)
          return `at ${bx}% ${by}%`
        })
      })
      .join(", ")
  }

  return (
    <main className="min-h-screen text-white antialiased selection:bg-white/20 w-full relative overflow-clip">
      {!introComplete && (
        <IntroSequence
          shadersReady={shadersReady}
          onComplete={() => setIntroComplete(true)}
        />
      )}

      {introComplete && <NavBar items={navItems} />}

      {enableGlow ? (
        <div
          ref={glowRef}
          className="fixed inset-0 z-[5] pointer-events-none"
          style={{
            opacity: glowColor ? 1 : 0,
            background: buildGlow(glowColor ?? lastGlow ?? []),
            transition: "opacity 1s ease-in-out, background 1.2s ease-in-out",
          }}
        />
      ) : null}

      <Hero
        introComplete={introComplete}
        onShaderReady={onShaderReady}
        enableShader={enableHeroShader}
        enableParallax={enableHeroParallax}
        lowQualityShader={isMobile}
      />

      <DeferredSection
        className={enableTransition3D ? "w-full h-[72vh] sm:h-[100vh] md:h-[120vh]" : "w-full"}
        rootMargin="400px 0px"
      >
        <Suspense fallback={<SectionFallback className="w-full h-full bg-black" />}>
          <SplineTransition
            enable3D={enableTransition3D}
            enableMotion={enableSectionMotion}
            compact3D={isMobile}
          />
        </Suspense>
      </DeferredSection>

      <Experience
        onHoverGlow={enableGlow ? setGlowColor : undefined}
        enableOverlap={enableTransition3D && !isMobile}
      />

      <DeferredSection
        id="testimonials"
        className={enableTestimonials3D ? "w-full min-h-screen" : "w-full"}
        rootMargin="400px 0px"
      >
        <Suspense fallback={<SectionFallback className="w-full h-full min-h-screen bg-black" />}>
          <Testimonials enable3D={enableTestimonials3D} enableMotion={enableSectionMotion} />
        </Suspense>
      </DeferredSection>

      <Contact />

      <footer className="h-32 pb-16 sm:pb-0 flex items-center justify-center bg-black border-t border-white/10">
        <p className="text-zinc-500 font-mono text-sm">SIGNAL ACTIVE // 2026</p>
      </footer>
    </main>
  )
}
