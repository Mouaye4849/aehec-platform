"use client";

import type { SVGProps } from "react";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { useLocale } from "@/lib/locale";
import {
    LOCATION,
    PHONE_DISPLAY,
    PHONE_URL,
    WHATSAPP_DISPLAY,
    WHATSAPP_URL,
} from "@/lib/contact";

const TEXT = {
    fr: {
        eyebrow: "Contact",
        title: "Restons en contact",
        intro:
            "Une question, un partenariat, ou l'envie de nous rejoindre ? Notre équipe est à votre écoute.",
        locationLabel: "Notre adresse",
        phoneLabel: "Téléphone",
        whatsappLabel: "WhatsApp",
        cta: "Voir la page contact →",
    },
    en: {
        eyebrow: "Contact",
        title: "Let's stay in touch",
        intro:
            "A question, a partnership, or want to join us? Our team is ready to help.",
        locationLabel: "Our location",
        phoneLabel: "Phone",
        whatsappLabel: "WhatsApp",
        cta: "View contact page →",
    },
    ar: {
        eyebrow: "تواصل معنا",
        title: "ابقوا على تواصل معنا",
        intro:
            "سؤال، شراكة، أو رغبة في الانضمام إلينا؟ فريقنا مستعد للتواصل معكم.",
        locationLabel: "موقعنا",
        phoneLabel: "الهاتف",
        whatsappLabel: "واتساب",
        cta: "صفحة الاتصال ←",
    },
} as const;

export function HomeContactPreview() {
    const { locale } = useLocale();
    const t = TEXT[locale];

    const cards = [
        {
            label: t.locationLabel,
            value: LOCATION[locale],
            icon: MapPin,
            href: undefined,
        },
        {
            label: t.phoneLabel,
            value: PHONE_DISPLAY,
            icon: Phone,
            href: PHONE_URL,
        },
        {
            label: t.whatsappLabel,
            value: WHATSAPP_DISPLAY,
            icon: WhatsAppIcon,
            href: WHATSAPP_URL,
        },
    ];

    return (
        <div>
            <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                    {t.eyebrow}
                </span>
                <h2 className="font-heading mt-2.5 text-3xl font-bold tracking-tight text-brand-primary">
                    {t.title}
                </h2>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t.intro}</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {cards.map((card) => {
                    const Icon = card.icon;
                    const content = (
                        <>
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white shadow-[0_6px_16px_-4px_rgba(28,77,51,0.45)] transition-transform duration-300 group-hover:scale-105">
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="flex min-w-0 flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                                    {card.label}
                                </span>
                                <span
                                    dir={card.href ? "ltr" : undefined}
                                    className="mt-0.5 text-base leading-snug font-bold text-brand-primary sm:text-lg"
                                >
                                    {card.value}
                                </span>
                            </span>
                        </>
                    );

                    const cardClassName =
                        "group flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-white/70 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_28px_-16px_rgba(28,77,51,0.25)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.08),0_24px_48px_-20px_rgba(28,77,51,0.35)]";

                    return card.href ? (
                        <a
                            key={card.label}
                            href={card.href}
                            target={card.href.startsWith("http") ? "_blank" : undefined}
                            rel={
                                card.href.startsWith("http")
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                            className={cardClassName}
                        >
                            {content}
                        </a>
                    ) : (
                        <div key={card.label} className={cardClassName}>
                            {content}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 text-center">
                <Link
                    href="/contact"
                    className="inline-block text-sm font-semibold text-brand-secondary hover:underline"
                >
                    {t.cta}
                </Link>
            </div>
        </div>
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
