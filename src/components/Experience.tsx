import { WarpDivider } from "./ui/WarpDivider";
import { useState } from "react";

const experienceData = [
    {
        role: "Software Engineer",
        company: "Buzz.me",
        location: "San Francisco, CA (Remote)",
        date: "Feb 2025 — Present",
        url: "https://webapp.buzzme.site/public-events",
        // Buzz.me: hot pink → dark orange → magenta (from gradient bg)
        glowColor: [
            "radial-gradient(ellipse 120% 100% at 50% 40%, rgba(255, 20, 147, 0.18), transparent 70%)",
            "radial-gradient(ellipse 100% 120% at 30% 65%, rgba(255, 140, 0, 0.15), transparent 65%)",
            "radial-gradient(ellipse 90% 100% at 75% 55%, rgba(233, 30, 99, 0.12), transparent 60%)",
        ],
        accentColor: "#FF1493",
        desc: "Migrated the web app from React to Next.js — SSR/SSG cut page loads by 40%. Built an AI voice agent (LiveKit, Deepgram, Gemini, LangGraph) that lets premium users create events 3x faster through natural conversation. Engineered a concurrency-safe RSVP system with waitlist management and deep linking, handling 100+ weekly users. Shipped cross-platform features across Flutter and React: media albums, real-time chat, push notifications via FCM/Twilio. Built AI-powered banner and description generation adopted in 90%+ of events.",
        stack: ["Next.js", "Flutter", "LiveKit", "LangGraph", "Deepgram", "Gemini", "Twilio", "FCM", "PostgreSQL"]
    },
    {
        role: "Full-Stack Engineer",
        company: "Polar AI",
        location: "Delhi, India (Remote)",
        date: "Oct 2024 — Jan 2025",
        url: "https://gopolar.io",
        // Polar AI: medium purple → deep purple/blue button → soft lavender
        glowColor: [
            "radial-gradient(ellipse 120% 100% at 50% 45%, rgba(108, 92, 231, 0.18), transparent 65%)",
            "radial-gradient(ellipse 100% 110% at 25% 55%, rgba(72, 52, 212, 0.15), transparent 60%)",
            "radial-gradient(ellipse 90% 100% at 75% 50%, rgba(162, 155, 254, 0.1), transparent 55%)",
        ],
        accentColor: "#6C5CE7",
        desc: "Built B2B chatbots using LangGraph for complex state management and multi-turn conversation flows. Implemented RAG pipelines with Pinecone vector DB and streaming APIs for real-time responses. Developed a React admin dashboard for chatbot workflow management and analytics. Optimized a shared framework for rapid domain bot deployment, cutting integration time by 50%.",
        stack: ["Next.js", "LangGraph", "Pinecone", "OpenAI", "Firebase", "Streaming APIs"]
    },
    {
        role: "Technical Trainee",
        company: "Traveazy",
        location: "Pune, India",
        date: "Jul 2024 — Sep 2024",
        url: "https://umrahme.com",
        // Umrahme: deep indigo bg → purple accents → golden amber icon
        glowColor: [
            "radial-gradient(ellipse 120% 100% at 50% 45%, rgba(45, 27, 105, 0.2), transparent 65%)",
            "radial-gradient(ellipse 100% 110% at 35% 60%, rgba(155, 89, 182, 0.15), transparent 60%)",
            "radial-gradient(ellipse 90% 100% at 70% 50%, rgba(245, 166, 35, 0.12), transparent 55%)",
        ],
        accentColor: "#F5A623",
        desc: "Built responsive frontend interfaces with ASP.NET MVC, Razor Pages, and jQuery. Integrated RESTful APIs with .NET Core backend for managing large-scale S3 image assets. Implemented image optimization techniques that measurably improved page load times.",
        stack: [".NET Core", "ASP.NET MVC", "Razor Pages", "jQuery", "AWS S3", "MongoDB"]
    },
    {
        role: "Full-Stack Development Intern",
        company: "Polar AI",
        location: "Delhi, India (Remote)",
        date: "Oct 2023 — May 2024",
        url: "https://gopolar.io",
        // Same Polar AI palette
        glowColor: [
            "radial-gradient(ellipse 120% 100% at 50% 45%, rgba(108, 92, 231, 0.18), transparent 65%)",
            "radial-gradient(ellipse 100% 110% at 25% 55%, rgba(72, 52, 212, 0.15), transparent 60%)",
            "radial-gradient(ellipse 90% 100% at 75% 50%, rgba(162, 155, 254, 0.1), transparent 55%)",
        ],
        accentColor: "#6C5CE7",
        desc: "Built a backend inference pipeline with Express.js, Firebase, Pinecone, and OpenAI APIs — powering 4+ production chatbots. Developed React admin dashboard for chatbot workflow management and analytics reporting. Deployed and monitored backend services on AWS EC2 for scalable performance.",
        stack: ["Express.js", "Firebase", "Pinecone", "OpenAI", "AWS EC2", "React"]
    },
];

export function Experience({ onHoverGlow }: { onHoverGlow?: (color: string[] | null) => void }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleEnter = (i: number) => {
        setHoveredIndex(i);
        onHoverGlow?.(experienceData[i].glowColor);
    };
    const handleLeave = () => {
        setHoveredIndex(null);
        onHoverGlow?.(null);
    };

    return (
        <section id="experience" className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden pb-20 -mt-[50vh] pt-[15vh]">

            {/* Background Layering */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-[50vh] bg-gradient-to-b from-transparent via-black/80 to-black" />
                <div className="w-full h-full bg-black" />
            </div>

            {/* Container */}
            <div className="relative z-10 w-full max-w-5xl px-4 md:px-12 flex flex-col items-start mt-16">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white mb-10">
                    Mission Log
                </h2>

                <div className="relative md:border-l md:border-white/10 flex flex-col gap-8 pb-16">
                    {experienceData.map((item, i) => (
                        <div key={i} className="relative md:pl-16 group" onMouseEnter={() => handleEnter(i)} onMouseLeave={handleLeave}>
                            {/* Timeline Dot — desktop only */}
                            <span
                                className="hidden md:block absolute left-[-5px] top-2 w-[9px] h-[9px] rounded-full border transition-all duration-700 ease-in-out drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                style={{
                                    backgroundColor: hoveredIndex === i ? item.accentColor : 'rgba(255,255,255,0.2)',
                                    borderColor: hoveredIndex === i ? item.accentColor : 'rgba(255,255,255,0.5)',
                                    transform: hoveredIndex === i ? 'scale(1.8)' : 'scale(1)',
                                    boxShadow: hoveredIndex === i ? `0 0 16px ${item.accentColor}` : 'none',
                                }}
                            />

                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-8 transition-all duration-700 ease-in-out cursor-pointer"
                                style={{
                                    borderColor: hoveredIndex === i ? `${item.accentColor}44` : 'rgba(255,255,255,0.1)',
                                    backgroundColor: hoveredIndex === i ? `${item.accentColor}12` : 'rgba(255,255,255,0.05)',
                                    transform: hoveredIndex === i
                                        ? 'translateY(-8px) scale(1.02)'
                                        : hoveredIndex !== null
                                            ? 'scale(0.98)'
                                            : 'none',
                                    boxShadow: hoveredIndex === i
                                        ? `0 16px 48px -10px ${item.accentColor}20, 0 0 20px ${item.accentColor}0a`
                                        : 'none',
                                    opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.6 : 1,
                                }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">{item.role}</h3>
                                        <p className="font-medium text-lg mt-1 transition-colors duration-300 md:text-zinc-400" style={{ color: hoveredIndex === i ? item.accentColor : undefined }}>
                                            <span className="md:hidden" style={{ color: item.accentColor }}>{item.company}</span>
                                            <span className="hidden md:inline">{item.company}</span>
                                            <span className="inline-block ml-2 text-xs opacity-60 md:opacity-0 group-hover:opacity-60 transition-opacity duration-300">↗</span>
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
                                    {item.stack.map((tech, j) => (
                                        <span key={j} className="text-xs font-mono text-zinc-400 bg-black/50 px-2 py-1 rounded border border-white/10">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chromatic warp divider at section bottom */}
            <WarpDivider />
        </section>
    );
}
