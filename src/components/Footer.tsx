"use client";

import type { SVGProps } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { UI_TEXT, useLocale } from "@/lib/locale";

const TEXT = {
    fr: { facebook: "Facebook", whatsapp: "WhatsApp", email: "E-mail" },
    en: { facebook: "Facebook", whatsapp: "WhatsApp", email: "Email" },
    ar: { facebook: "فيسبوك", whatsapp: "واتساب", email: "البريد الإلكتروني" },
} as const;

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100083315438426";
const WHATSAPP_URL = "https://wa.me/XXXXXXXXXXX";
const EMAIL_ADDRESS = "contact@example.com";

export function Footer() {
    const { locale } = useLocale();
    const t = UI_TEXT[locale].footer;
    const social = TEXT[locale];
    const brand = UI_TEXT[locale].brand;
    const year = new Date().getFullYear();

    const socialLinks = [
        { label: social.facebook, href: FACEBOOK_URL, icon: FacebookIcon, external: true },
        { label: social.whatsapp, href: WHATSAPP_URL, icon: WhatsAppIcon, external: true },
        { label: social.email, href: `mailto:${EMAIL_ADDRESS}`, icon: Mail, external: false },
    ];

    return (
        <footer className="mt-auto bg-brand-primary text-white/80">
            <div className="mx-auto max-w-6xl px-6 py-8 text-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                    <div className="rounded-xl bg-white/95 p-2">
                        <Image
                            src="/logo.png"
                            alt={brand.name}
                            width={56}
                            height={56}
                            className="h-14 w-14 object-contain"
                        />
                    </div>
                    <div>
                        <p className="font-heading text-base font-semibold text-white">
                            {brand.fullName}
                        </p>
                        <p className="text-white/70">{brand.motto}</p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
                    <p className="text-xs text-white/60">
                        &copy; {year} {brand.fullName}. {t.rights}
                    </p>

                    <div className="flex items-center justify-center gap-3">
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                aria-label={link.label}
                                title={link.label}
                                {...(link.external
                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                    : {})}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                            >
                                <link.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M22 12.06C22 6.53 17.52 2 12 2S2 6.53 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.81 8.44-4.95 8.44-9.94Z" />
        </svg>
    );
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M17.47 14.38c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.94-.93 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.91-2.18-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.82 1.19 3.01.15.2 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.55-.08 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.56-.34Z" />
            <path d="M12.04 2C6.58 2 2.13 6.42 2.13 11.86c0 1.86.51 3.63 1.4 5.14L2 22l5.16-1.5a9.93 9.93 0 0 0 4.88 1.25h.01c5.46 0 9.91-4.42 9.91-9.86C21.96 6.42 17.51 2 12.04 2Zm0 18.02h-.01c-1.59 0-3.14-.42-4.5-1.22l-.32-.19-3.06.89.9-2.97-.21-.31a8.03 8.03 0 0 1-1.32-4.36c0-4.44 3.66-8.05 8.16-8.05 2.18 0 4.23.85 5.77 2.38a8 8 0 0 1 2.39 5.71c0 4.44-3.66 8.12-8.14 8.12Z" />
        </svg>
    );
}
