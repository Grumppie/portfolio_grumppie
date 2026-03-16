import { useState } from "react"
import { experienceEntries } from "@/content/portfolio"

export function Experience({
  onHoverGlow,
  enableOverlap = true,
}: {
  onHoverGlow?: (color: string[] | null) => void
  enableOverlap?: boolean
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleEnter = (index: number) => {
    setHoveredIndex(index)
    onHoverGlow?.(experienceEntries[index].glowColor)
  }

  const handleLeave = () => {
    setHoveredIndex(null)
    onHoverGlow?.(null)
  }

  return (
    <section
      id="experience"
      className={`relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden ${enableOverlap ? "pb-20 -mt-[50vh] pt-[15vh]" : "pb-8 pt-4 md:pb-20 md:pt-24"}`}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-[50vh] bg-gradient-to-b from-transparent via-black/80 to-black" />
        <div className="w-full h-full bg-black" />
      </div>

      <div className={`relative z-10 w-full max-w-5xl px-4 md:px-12 flex flex-col items-start ${enableOverlap ? "mt-16" : "mt-3 md:mt-16"}`}>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white mb-10">
          Mission Log
        </h2>

        <div className="relative md:border-l md:border-white/10 flex flex-col gap-8 pb-16">
          {experienceEntries.map((item, index) => (
            <div
              key={`${item.company}-${item.role}`}
              className="relative md:pl-16 group"
              onMouseEnter={() => handleEnter(index)}
              onMouseLeave={handleLeave}
            >
              <span
                className="hidden md:block absolute left-[-5px] top-2 w-[9px] h-[9px] rounded-full border transition-all duration-700 ease-in-out drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{
                  backgroundColor: hoveredIndex === index ? item.accentColor : "rgba(255,255,255,0.2)",
                  borderColor: hoveredIndex === index ? item.accentColor : "rgba(255,255,255,0.5)",
                  transform: hoveredIndex === index ? "scale(1.8)" : "scale(1)",
                  boxShadow: hoveredIndex === index ? `0 0 16px ${item.accentColor}` : "none",
                }}
              />

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-8 transition-all duration-700 ease-in-out cursor-pointer"
                style={{
                  borderColor: hoveredIndex === index ? `${item.accentColor}44` : "rgba(255,255,255,0.1)",
                  backgroundColor: hoveredIndex === index ? `${item.accentColor}12` : "rgba(255,255,255,0.05)",
                  transform:
                    hoveredIndex === index
                      ? "translateY(-8px) scale(1.02)"
                      : hoveredIndex !== null
                        ? "scale(0.98)"
                        : "none",
                  boxShadow:
                    hoveredIndex === index
                      ? `0 16px 48px -10px ${item.accentColor}20, 0 0 20px ${item.accentColor}0a`
                      : "none",
                  opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.6 : 1,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">{item.role}</h3>
                    <p
                      className="font-medium text-lg mt-1 transition-colors duration-300 md:text-zinc-400"
                      style={{ color: hoveredIndex === index ? item.accentColor : undefined }}
                    >
                      <span className="md:hidden" style={{ color: item.accentColor }}>
                        {item.company}
                      </span>
                      <span className="hidden md:inline">{item.company}</span>
                      <span className="inline-block ml-2 text-xs opacity-60 md:opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                        ↗
                      </span>
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
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
