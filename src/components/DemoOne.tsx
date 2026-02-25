import { ShaderAnimation } from "@/components/ui/shader-animation";

export default function DemoOne() {
    return (
        <div className="relative flex h-[650px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black">
            <ShaderAnimation />
            <span className="absolute pointer-events-none z-10 text-center text-5xl md:text-7xl leading-none font-semibold tracking-tighter whitespace-pre-wrap text-white mix-blend-difference drop-shadow-lg">
                Radial Geometry
            </span>
        </div>
    )
}
