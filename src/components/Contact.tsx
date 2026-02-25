import { WarpDivider } from "./ui/WarpDivider";
import { ContactCard } from "./ui/contact-card";
import { MailIcon, Github, Twitter, Linkedin } from 'lucide-react';
import { Input } from './ui/input';
import { SubmitSocialButton } from './ui/button-1';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useState, type FormEvent } from 'react';

export function Contact() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setStatus('sent');
                form.reset();
                setTimeout(() => setStatus('idle'), 4000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="relative w-full py-20 flex flex-col items-center justify-center bg-black overflow-hidden border-t border-white/10">
            {/* Warp divider at top (flipped) */}
            <WarpDivider flip />

            {/* Soft background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center text-center">
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Begin Transmission
                </h2>

                <p className="text-zinc-400 max-w-2xl text-lg md:text-xl font-light tracking-wide mb-10 leading-relaxed">
                    Scaling a product, solving a hard technical problem, or need an engineer who shows up every day with the same intensity — let's build.
                </p>

                <div className="w-full text-left">
                    <ContactCard
                        title="Get in touch"
                        description="Fill out the form below and I'll get back to you within 12 hours."
                        socialLinks={[
                            {
                                href: 'https://github.com/Grumppie',
                                icon: Github,
                                label: 'Github',
                            },
                            {
                                href: 'https://x.com/Grumppie1',
                                icon: Twitter,
                                label: 'Twitter / X',
                            },
                            {
                                href: 'https://www.linkedin.com/in/sarthak-pawar-b679481a9/',
                                icon: Linkedin,
                                label: 'LinkedIn',
                            },
                            {
                                href: 'mailto:sarthakrajesh777@gmail.com',
                                icon: MailIcon,
                                label: 'Email',
                            }
                        ]}
                    >
                        <form onSubmit={handleSubmit} className="w-full space-y-6">
                            <input type="hidden" name="access_key" value="96ec68f9-9d31-4f21-8ce0-d8869d0a928a" />

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" type="text" placeholder="John Doe" required disabled={status === 'sending'} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="john@example.com" required disabled={status === 'sending'} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" name="message" placeholder="How can I help you?" required className="min-h-[120px] resize-none" disabled={status === 'sending'} />
                            </div>
                            <div className="pt-2">
                                <SubmitSocialButton
                                    label={status === 'sending' ? 'TRANSMITTING...' : status === 'sent' ? 'TRANSMISSION SENT' : 'LET THERE BE LIGHT'}
                                    disabled={status === 'sending'}
                                />
                            </div>
                            {status === 'error' && (
                                <p className="text-red-400 text-sm font-mono">Transmission failed. Try again or reach out directly.</p>
                            )}
                        </form>
                    </ContactCard>
                </div>
            </div>
        </section>
    );
}
