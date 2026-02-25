import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function DemoTwo() {
    return (
        <div className="relative flex min-h-[650px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black">
            <WebGLShader />
            <div className="relative border border-[#27272a] p-2 w-full mx-auto max-w-4xl z-10 rounded-2xl bg-black/40 backdrop-blur-sm m-4">
                <main className="relative border border-[#27272a] py-16 px-6 overflow-hidden rounded-xl">
                    <h1 className="mb-6 text-white text-center text-5xl font-extrabold tracking-tighter md:text-[clamp(2.5rem,8vw,7rem)] leading-none">
                        Design is Everything
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto px-6 text-center text-sm md:text-lg mb-8 leading-relaxed">
                        Unleashing creativity through bold visuals, seamless interfaces, and limitless possibilities. Build with the elements.
                    </p>
                    <div className="mb-10 flex items-center justify-center gap-2">
                        <span className="relative flex h-3 w-3 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                        <p className="text-sm font-medium tracking-widest uppercase text-green-500">Available for New Projects</p>
                    </div>

                    <div className="flex justify-center">
                        <LiquidButton className="text-white border-white/20 hover:border-white/40 tracking-widest text-lg px-12" size={'xl'}>
                            BEGIN JOURNEY
                        </LiquidButton>
                    </div>
                </main>
            </div>
        </div>
    )
}
