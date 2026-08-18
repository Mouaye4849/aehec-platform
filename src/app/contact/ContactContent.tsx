"use client";

import type { SVGProps } from "react";
import { Mail, MapPin } from "lucide-react";
import { UI_TEXT, useLocale } from "@/lib/locale";

const TEXT = {
    fr: {
        title: "Contact",
        intro:
            "Une question, une suggestion ou envie de rejoindre l'AEHEC ? Contactez-nous via l'un des canaux ci-dessous.",
        facebook: "Facebook",
        whatsapp: "WhatsApp",
        email: "E-mail",
        location: "Localisation",
        locationValue: "Wilaya du Hodh Ech Chargui, Mauritanie",
    },
    en: {
        title: "Contact",
        intro:
            "Have a question, a suggestion, or want to join AEHEC? Reach us through any of the channels below.",
        facebook: "Facebook",
        whatsapp: "WhatsApp",
        email: "Email",
        location: "Location",
        locationValue: "Hodh Ech Chargui region, Mauritania",
    },
    ar: {
        title: "اتصل بنا",
        intro:
            "هل لديك سؤال أو اقتراح أو ترغب في الانضمام إلى الرابطة؟ تواصل معنا عبر إحدى القنوات أدناه.",
        facebook: "فيسبوك",
        whatsapp: "واتساب",
        email: "البريد الإلكتروني",
        location: "الموقع",
        locationValue: "ولاية الحوض الشرقي، موريتانيا",
    },
} as const;

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100083315438426";
const WHATSAPP_URL = "https://wa.me/XXXXXXXXXXX";
const EMAIL_ADDRESS = "contact@example.com";

export function ContactContent() {
    const { locale } = useLocale();
    const t = TEXT[locale];
    const brand = UI_TEXT[locale].brand;

    const channels = [
        {
            label: t.facebook,
            value: brand.name,
            href: FACEBOOK_URL,
            icon: FacebookIcon,
            external: true,
        },
        {
            label: t.whatsapp,
            value: t.whatsapp,
            href: WHATSAPP_URL,
            icon: WhatsAppIcon,
            external: true,
        },
        {
            label: t.email,
            value: EMAIL_ADDRESS,
            href: `mailto:${EMAIL_ADDRESS}`,
            icon: Mail,
            external: false,
        },
    ];

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
            <h1 className="font-heading text-3xl font-bold text-brand-primary">
                {t.title}
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-zinc-700 dark:text-zinc-300">
                {t.intro}
            </p>

            <div className="mt-8 flex flex-col gap-4">
                {channels.map((channel) => (
                    <a
                        key={channel.label}
                        href={channel.href}
                        aria-label={channel.label}
                        {...(channel.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        className="flex items-center gap-4 rounded-xl border border-black/10 bg-brand-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10"
                    >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                            <channel.icon className="h-5 w-5" />
                        </span>
                        <span className="flex flex-col">
                            <span className="text-sm text-brand-secondary">
                                {channel.label}
                            </span>
                            <span className="font-semibold text-brand-primary">
                                {channel.value}
                            </span>
                        </span>
                    </a>
                ))}

                <div className="flex items-center gap-4 rounded-xl border border-black/10 bg-brand-surface p-5 dark:border-white/10">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                        <MapPin className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col">
                        <span className="text-sm text-brand-secondary">
                            {t.location}
                        </span>
                        <span className="font-semibold text-brand-primary">
                            {t.locationValue}
                        </span>
                    </span>
                </div>
            </div>
        </div>
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
