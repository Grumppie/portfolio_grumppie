import React from 'react';
import { cn } from '@/lib/utils';
import {
    PlusIcon,
} from 'lucide-react';
import { LiquidButton } from './liquid-glass-button';

type SocialLinkProps = {
    href: string;
    icon: React.ElementType;
    label: string;
};

type ContactCardProps = React.ComponentProps<'div'> & {
    // Content props
    title?: string;
    description?: string;
    socialLinks?: SocialLinkProps[];
    formSectionClassName?: string;
};

export function ContactCard({
    title = 'Contact With Us',
    description = 'If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day.',
    socialLinks,
    className,
    formSectionClassName,
    children,
    ...props
}: ContactCardProps) {
    return (
        <div
            className={cn(
                'bg-white/5 border border-white/10 backdrop-blur-[40px] relative grid h-full w-full lg:grid-cols-5 rounded-2xl overflow-hidden',
                className,
            )}
            {...props}
        >
            <PlusIcon className="absolute -top-3 -left-3 h-6 w-6 text-white/20" />
            <PlusIcon className="absolute -top-3 -right-3 h-6 w-6 text-white/20" />
            <PlusIcon className="absolute -bottom-3 -left-3 h-6 w-6 text-white/20" />
            <PlusIcon className="absolute -right-3 -bottom-3 h-6 w-6 text-white/20" />
            <div className="flex flex-col justify-center lg:col-span-3 relative z-10 w-full">
                <div className="relative h-full space-y-4 px-6 py-8 md:p-12">
                    <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {title}
                    </h1>
                    <p className="text-zinc-400 max-w-xl text-sm md:text-base lg:text-lg font-light leading-relaxed">
                        {description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-lg">
                        {socialLinks?.map((link, index) => {
                            const Icon = link.icon;
                            return (
                                <LiquidButton
                                    key={index}
                                    className="w-full text-base py-5 items-center justify-start px-2 text-white font-medium tracking-wide"
                                    onClick={() => window.open(link.href, "_blank", "noopener,noreferrer")}
                                >
                                    <div className="flex items-center justify-start gap-6 w-full px-4">
                                        <Icon className="w-7 h-7 shrink-0" />
                                        <span>{link.label}</span>
                                    </div>
                                </LiquidButton>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div
                className={cn(
                    'bg-black/20 flex h-full w-full items-center border-t border-white/10 p-6 lg:col-span-2 md:border-t-0 md:border-l relative z-10',

                    formSectionClassName,
                )}
            >
                {children}
            </div>
        </div >
    );
}
