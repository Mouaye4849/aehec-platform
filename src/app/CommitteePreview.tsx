"use client";

import Link from "next/link";
import type { ExecutiveMember } from "@prisma/client";
import { localize, useLocale } from "@/lib/locale";

const TEXT = {
    fr: {
        title: "Le comité exécutif",
        lead: "Les membres qui portent les projets de la Rabita.",
        cta: "Voir le comité exécutif complet",
    },
    en: {
        title: "The executive committee",
        lead: "The members who drive the Rabita's projects.",
        cta: "View full executive committee",
    },
    ar: {
        title: "المكتب التنفيذي",
        lead: "الأعضاء الذين يقودون مشاريع الرابطة.",
        cta: "عرض المكتب التنفيذي كاملاً",
    },
} as const;

export function CommitteePreview({ members }: { members: ExecutiveMember[] }) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    if (members.length === 0) return null;

    return (
        <div>
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-heading text-3xl font-bold text-brand-primary">
                    {t.title}
                </h2>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t.lead}</p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="group overflow-hidden rounded-2xl border border-black/10 bg-brand-surface text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10"
                    >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-primary/5 dark:bg-white/5">
                            {member.photoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={member.photoUrl}
                                    alt={localize(locale, member.nomFr, member.nomAr)}
                                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center p-6">
                                    <PlaceholderAvatar />
                                </div>
                            )}
                        </div>
                        <div className="p-3">
                            <p className="truncate text-sm font-semibold text-brand-primary">
                                {localize(locale, member.nomFr, member.nomAr)}
                            </p>
                            <p className="truncate text-xs text-brand-secondary">
                                {localize(locale, member.posteFr, member.posteAr)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-center">
                <Link
                    href="/comite"
                    className="inline-block rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                    {t.cta}
                </Link>
            </div>
        </div>
    );
}

function PlaceholderAvatar() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-12 w-12 text-brand-primary/20"
        >
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" />
        </svg>
    );
}
