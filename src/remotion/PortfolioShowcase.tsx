import { Home, Briefcase, MessageSquare, Mail } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { experienceEntries, profile, socialLinks, testimonials } from "../content/portfolio"

type PortfolioShowcaseProps = {
  variant: "vertical" | "square"
}

type PageSection = "home" | "experience" | "testimonials" | "contact"

const palette = {
  black: "#000000",
  white: "#ffffff",
  muted: "#a1a1aa",
  line: "rgba(255,255,255,0.1)",
  glass: "rgba(255,255,255,0.05)",
  cyan: "#2dd4ff",
  pink: "#ff4081",
  blue: "#4872ff",
}

const featuredTestimonials = testimonials.slice(0, 3)
const shotFrames = [0, 72, 170, 254, 340, 452, 560, 720, 780]
const ease = Easing.bezier(0.22, 1, 0.36, 1)

const cameraSectionY = {
  home: 1180,
  experience: 290,
  testimonials: -1080,
  contact: -2140,
}

const mapSegment = (
  frame: number,
  frames: number[],
  values: number[]
) => {
  if (frames.length !== values.length) {
    throw new Error("frames and values must match")
  }

  if (frame <= frames[0]) {
    return values[0]
  }

  const lastIndex = frames.length - 1
  if (frame >= frames[lastIndex]) {
    return values[lastIndex]
  }

  for (let index = 0; index < lastIndex; index++) {
    const start = frames[index]
    const end = frames[index + 1]

    if (frame >= start && frame <= end) {
      return interpolate(frame, [start, end], [values[index], values[index + 1]], {
        easing: ease,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    }
  }

  return values[lastIndex]
}

const reveal = (
  frame: number,
  start: number,
  fps: number,
  durationInFrames = 26
) =>
  spring({
    frame: frame - start,
    fps,
    durationInFrames,
    config: { damping: 200 },
  })

const flashAt = (frame: number, at: number, strength: number) =>
  interpolate(frame, [at - 8, at, at + 18], [0, strength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

const FloatingFrame = ({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) => (
  <div
    style={{
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.04)",
      backdropFilter: "blur(28px)",
      boxShadow: "0 40px 120px rgba(0, 0, 0, 0.38)",
      ...style,
    }}
  >
    {children}
  </div>
)

const StaticNavBar = ({ active }: { active: PageSection }) => {
  const navItems = [
    { name: "Home", key: "home" as const, icon: Home },
    { name: "Experience", key: "experience" as const, icon: Briefcase },
    { name: "Testimonials", key: "testimonials" as const, icon: MessageSquare },
    { name: "Contact", key: "contact" as const, icon: Mail },
  ]

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-6">
      <div className="flex items-center gap-3 py-1 px-1 rounded-full shadow-lg border bg-black/60 backdrop-blur-xl border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.key

          return (
            <div
              key={item.name}
              className={`relative text-sm font-semibold px-6 py-2 rounded-full ${isActive ? "text-white" : "text-zinc-400"}`}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive ? <div className="absolute inset-0 rounded-full bg-white/5 -z-10" /> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const HeroReplica = () => {
  return (
    <section id="hero" className="relative w-full h-[1000px] flex items-center justify-center overflow-hidden">
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

      <div className="absolute inset-0 z-[2] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_8%,rgba(0,0,0,0.62)_100%)]" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-70" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
        <div className="flex flex-col items-center">
          <div className="relative">
            <h1
              className="text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]"
              style={{ fontFamily: "'Outfit', sans-serif", WebkitTextStroke: "1px rgba(255,255,255,0.7)" }}
            >
              {profile.name}
            </h1>
          </div>

          <p className="mt-6 text-lg md:text-xl text-zinc-300 font-light tracking-[0.25em] uppercase">
            {profile.tagline}
          </p>

          <p className="mt-4 text-sm font-mono text-zinc-500 tracking-[0.3em] uppercase">
            {profile.roleLine}
          </p>
        </div>
      </div>
    </section>
  )
}

const ExperienceCardReplica = ({
  item,
  progress,
  frame,
  index,
}: {
  item: (typeof experienceEntries)[number]
  progress: number
  frame: number
  index: number
}) => {
  const localLift = interpolate(progress, [0, 1], [56, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const softExit = frame > 330 ? interpolate(frame, [330 + index * 8, 380 + index * 8], [1, 0.74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) : 1

  return (
    <div className="relative md:pl-16 group">
      <span
        className="hidden md:block absolute left-[-5px] top-2 w-[9px] h-[9px] rounded-full border drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        style={{
          backgroundColor: item.accentColor,
          borderColor: item.accentColor,
          boxShadow: `0 0 16px ${item.accentColor}`,
          transform: `scale(${interpolate(progress, [0, 1], [0.8, 1.8])})`,
          opacity: progress * softExit,
        }}
      />

      <div
        className="block bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-8"
        style={{
          borderColor: `${item.accentColor}44`,
          backgroundColor: `${item.accentColor}12`,
          boxShadow: `0 16px 48px -10px ${item.accentColor}20, 0 0 20px ${item.accentColor}0a`,
          transform: `translateY(${localLift}px) scale(${interpolate(progress, [0, 1], [0.96, 1.02])})`,
          opacity: progress * softExit,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">{item.role}</h3>
            <p className="font-medium text-lg mt-1 transition-colors duration-300 md:text-zinc-400" style={{ color: item.accentColor }}>
              <span>{item.company}</span>
              <span className="inline-block ml-2 text-xs opacity-60">↗</span>
            </p>
            <p className="text-zinc-300 text-sm font-mono mt-0.5">{item.location}</p>
          </div>
          <span className="text-xs sm:text-sm font-mono text-zinc-300 bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/10 whitespace-nowrap w-fit">
            {item.date}
          </span>
        </div>

        <p className="text-zinc-300 leading-relaxed font-light mb-4 sm:mb-6 text-sm sm:text-base">
          {item.desc}
        </p>

        <div className="flex flex-wrap gap-2">
          {item.stack.map((tech) => (
            <span key={tech} className="text-xs font-mono text-zinc-400 bg-black/50 px-2 py-1 rounded border border-white/10">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const ExperienceReplica = ({ frame }: { frame: number }) => {
  const { fps } = useVideoConfig()
  const starts = [180, 224, 268, 312]

  return (
    <section id="experience" className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden pb-20 pt-24">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-[50vh] bg-gradient-to-b from-transparent via-black/80 to-black" />
        <div className="w-full h-full bg-black" />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4 md:px-12 flex flex-col items-start mt-16">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white mb-10">
          Mission Log
        </h2>

        <div className="relative md:border-l md:border-white/10 flex flex-col gap-8 pb-16">
          {experienceEntries.map((item, index) => (
            <ExperienceCardReplica
              key={`${item.company}-${item.role}`}
              item={item}
              index={index}
              frame={frame}
              progress={reveal(frame, starts[index] ?? starts[starts.length - 1], fps)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialCardReplica = ({
  quote,
  name,
  role,
  company,
  progress,
}: {
  quote: string
  name: string
  role: string
  company: string
  progress: number
}) => {
  return (
    <div
      className="bg-white/5 border border-white/10 backdrop-blur-[100px] rounded-3xl p-8 md:p-12 h-full flex flex-col justify-between"
      style={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px) scale(${interpolate(progress, [0, 1], [0.97, 1])})`,
      }}
    >
      <p className="text-white/90 text-lg md:text-xl leading-relaxed font-light tracking-wide">
        "{quote}"
      </p>

      <div className="mt-auto pt-6 border-t border-white/10">
        <p className="text-white font-semibold text-base">{name}</p>
        <p className="text-zinc-400 text-sm font-mono mt-0.5">
          {role}, {company}
        </p>
      </div>
    </div>
  )
}

const TestimonialsReplica = ({ frame }: { frame: number }) => {
  const { fps } = useVideoConfig()

  return (
    <section className="relative w-full min-h-[940px] flex flex-col items-center justify-center overflow-hidden py-20">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.1),transparent_26%),radial-gradient(circle_at_30%_55%,rgba(255,60,120,0.16),transparent_24%),radial-gradient(circle_at_70%_55%,rgba(40,120,255,0.16),transparent_24%)]" />
        <div className="absolute left-1/2 top-[18%] h-[42%] w-[42%] min-w-[240px] -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.03] blur-3xl" />
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Signal Over Noise
        </h2>
        <p className="text-zinc-400 max-w-3xl text-center mb-12 tracking-wide text-base md:text-lg leading-relaxed">
          The proof is not in the pitch - it is in the people who come back. Founders, teams, and stakeholders who have seen what relentless delivery actually looks like.
        </p>

        <div className="relative w-full max-w-4xl mx-auto">
          <div className="relative min-h-[420px] sm:min-h-[380px] md:min-h-[340px]">
            <div className="absolute inset-0 grid gap-5">
              {featuredTestimonials.map((testimonial, index) => (
                <TestimonialCardReplica
                  key={testimonial.id}
                  quote={testimonial.quote}
                  name={testimonial.name}
                  role={testimonial.role}
                  company={testimonial.company}
                  progress={reveal(frame, 446 + index * 36, fps)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const ContactReplica = () => {
  return (
    <section id="contact" className="relative w-full py-20 flex flex-col items-center justify-center bg-black overflow-hidden border-t border-white/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center text-center">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {profile.contactHeading}
        </h2>

        <p className="text-zinc-400 max-w-2xl text-lg md:text-xl font-light tracking-wide mb-10 leading-relaxed">
          {profile.contactBody}
        </p>

        <div className="w-full text-left">
          <div className="bg-white/5 border border-white/10 backdrop-blur-[40px] relative grid h-full w-full lg:grid-cols-5 rounded-2xl overflow-hidden">
            <div className="bg-black/20 flex h-full w-full items-center border-b lg:border-b-0 border-white/10 p-6 lg:col-span-2 lg:border-l lg:order-2 relative z-10">
              <div className="w-full space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="text-zinc-400 text-sm">Name</div>
                  <div className="h-11 rounded-md border border-white/10 bg-white/5" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-zinc-400 text-sm">Email</div>
                  <div className="h-11 rounded-md border border-white/10 bg-white/5" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-zinc-400 text-sm">Message</div>
                  <div className="h-32 rounded-md border border-white/10 bg-white/5" />
                </div>
                <div className="h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-sm font-mono text-zinc-300">
                  LET THERE BE LIGHT
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-3 lg:order-1 relative z-10 w-full">
              <div className="relative h-full space-y-4 px-6 py-8 md:p-12">
                <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Get in touch
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-12 w-full max-w-lg">
                  {socialLinks.map((link) => (
                    <FloatingFrame
                      key={link.label}
                      style={{
                        borderRadius: 999,
                        padding: "18px 20px",
                        color: palette.white,
                      }}
                    >
                      <div className="flex items-center justify-between gap-6 w-full">
                        <span>{link.label}</span>
                        <span className="text-zinc-500">Open</span>
                      </div>
                    </FloatingFrame>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const PortfolioPageReplica = ({ frame, activeSection }: { frame: number; activeSection: PageSection }) => {
  return (
    <main className="min-h-screen text-white antialiased selection:bg-white/20 w-full relative overflow-hidden bg-black">
      <StaticNavBar active={activeSection} />
      <HeroReplica />
      <div className="w-full h-[540px] bg-black" />
      <ExperienceReplica frame={frame} />
      <TestimonialsReplica frame={frame} />
      <ContactReplica />
      <footer className="h-32 pb-16 sm:pb-0 flex items-center justify-center bg-black border-t border-white/10">
        <p className="text-zinc-500 font-mono text-sm">SIGNAL ACTIVE // 2026</p>
      </footer>
    </main>
  )
}

const CameraRig = ({ frame, variant }: { frame: number; variant: "vertical" | "square" }) => {
  const pageWidth = 1440
  const pageHeight = 4800
  const scaleBase = variant === "vertical" ? 0.67 : 0.62
  const cameraY = mapSegment(frame, shotFrames, [
    cameraSectionY.home + 120,
    cameraSectionY.home,
    cameraSectionY.home - 80,
    cameraSectionY.experience + 90,
    cameraSectionY.experience - 110,
    cameraSectionY.testimonials,
    cameraSectionY.contact + 90,
    cameraSectionY.contact - 40,
    cameraSectionY.contact - 20,
  ])
  const cameraScale = mapSegment(frame, shotFrames, [
    scaleBase,
    scaleBase + 0.1,
    scaleBase + 0.13,
    scaleBase + 0.06,
    scaleBase + 0.08,
    scaleBase + 0.06,
    scaleBase + 0.03,
    scaleBase + 0.08,
    scaleBase + 0.06,
  ])
  const rotateX = mapSegment(frame, shotFrames, [12, 8, 6, 4, 5, 4, 3, 2, 0])
  const rotateY = mapSegment(frame, shotFrames, [-12, -6, 3, -2, 2, -1, 2, 0, 0])
  const cameraX = mapSegment(frame, shotFrames, [0, 12, -14, 8, -8, 6, -6, 0, 0])
  const activeSection: PageSection =
    frame < 250 ? "home" : frame < 452 ? "experience" : frame < 630 ? "testimonials" : "contact"

  return (
    <AbsoluteFill style={{ perspective: 2400, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: pageWidth,
          height: pageHeight,
          transform: `translate(-50%, -50%) translate3d(${cameraX}px, ${cameraY}px, 0) scale(${cameraScale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: 42,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 60px 160px rgba(0,0,0,0.52)",
            backgroundColor: "#000000",
          }}
        >
          <PortfolioPageReplica frame={frame} activeSection={activeSection} />
        </div>
      </div>
    </AbsoluteFill>
  )
}

const OverlayEffects = ({ frame }: { frame: number }) => {
  const sweepX = mapSegment(frame, shotFrames, [-260, -40, 120, -120, 180, 60, 220, 320, 360])
  const flash =
    flashAt(frame, 72, 0.18) +
    flashAt(frame, 254, 0.12) +
    flashAt(frame, 452, 0.12) +
    flashAt(frame, 560, 0.12) +
    flashAt(frame, 720, 0.18)

  return (
    <>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at center, transparent 16%, rgba(0,0,0,0.4) 74%, rgba(0,0,0,0.78) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px)",
          opacity: 0.05,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 48%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.14) 52%, transparent 100%)",
          opacity: 0.12,
          transform: `translateX(${sweepX}px) rotate(-6deg) scale(1.35)`,
          filter: "blur(70px)",
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(255,255,255,${flash})`,
          mixBlendMode: "screen",
        }}
      />
    </>
  )
}

const IntroOverlay = ({ frame }: { frame: number }) => {
  const { fps } = useVideoConfig()
  const progress = reveal(frame, 0, fps, 28)
  const exit = interpolate(frame, [38, 78], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: exit }}>
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 52,
          padding: "12px 18px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgba(255,255,255,0.04)",
          fontFamily: "monospace",
          fontSize: 14,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: palette.muted,
          transform: `translateY(${interpolate(progress, [0, 1], [16, 0])}px)`,
        }}
      >
        Portfolio Reveal
      </div>
      <div
        style={{
          position: "absolute",
          right: 52,
          bottom: 48,
          fontFamily: "monospace",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: palette.muted,
        }}
      >
        social marketing cut
      </div>
    </AbsoluteFill>
  )
}

export const PortfolioShowcase = ({ variant }: PortfolioShowcaseProps) => {
  const frame = useCurrentFrame()
  const backgroundDrift = mapSegment(frame, shotFrames, [0, -20, -40, -60, -80, -110, -140, -160, -180])

  return (
    <AbsoluteFill style={{ backgroundColor: palette.black, color: palette.white, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 14%, rgba(45,212,255,0.22), transparent 24%), radial-gradient(circle at 86% 10%, rgba(255,64,129,0.18), transparent 20%), radial-gradient(circle at 50% 54%, rgba(72,114,255,0.16), transparent 26%)",
          filter: "blur(84px)",
          transform: `translateY(${backgroundDrift}px) scale(1.08)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.07) 59px, rgba(255,255,255,0.07) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.07) 59px, rgba(255,255,255,0.07) 60px)",
          backgroundSize: "60px 60px",
          opacity: 0.24,
        }}
      />

      <CameraRig frame={frame} variant={variant} />
      <OverlayEffects frame={frame} />
      <IntroOverlay frame={frame} />
    </AbsoluteFill>
  )
}
