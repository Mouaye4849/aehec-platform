"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Activity, ActivityType } from "@prisma/client";
import { localize, useLocale, type Locale } from "@/lib/locale";

const TYPE_META: Record<ActivityType, { label: Record<Locale, string>; dot: string }> = {
    ACTIVITY: {
        label: { fr: "Activité", en: "Activity", ar: "نشاط" },
        dot: "bg-brand-secondary",
    },
    EVENT: {
        label: { fr: "Événement", en: "Event", ar: "فعالية" },
        dot: "bg-brand-accent",
    },
    INITIATIVE: {
        label: { fr: "Initiative", en: "Initiative", ar: "مبادرة" },
        dot: "bg-brand-primary",
    },
    WORKSHOP: {
        label: { fr: "Atelier", en: "Workshop", ar: "ورشة عمل" },
        dot: "bg-brand-primary-light",
    },
    ACHIEVEMENT: {
        label: { fr: "Réussite", en: "Achievement", ar: "إنجاز" },
        dot: "bg-brand-accent",
    },
    COMMUNITY_PROJECT: {
        label: {
            fr: "Projet communautaire",
            en: "Community project",
            ar: "مشروع مجتمعي",
        },
        dot: "bg-brand-secondary",
    },
};

const TEXT = {
    fr: {
        eyebrow: "Vie associative",
        title: "Notre univers associatif",
        subtitle:
            "Un fil chronologique de nos activités, initiatives et rendez-vous, du plus récent au plus ancien.",
    },
    en: {
        eyebrow: "Community life",
        title: "Our community in action",
        subtitle:
            "A chronological record of our activities, initiatives, and sessions, from most recent to oldest.",
    },
    ar: {
        eyebrow: "الحياة الجمعوية",
        title: "عالمنا الجمعوي",
        subtitle: "سجل زمني لأنشطتنا ومبادراتنا ولقاءاتنا، من الأحدث إلى الأقدم.",
    },
} as const;

// A premium "expo-out" ease shared with the navbar's own entrance motion,
// so the two redesigned surfaces move with the same signature feel.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Deterministic bento span pattern (index 0 gets the spotlight span
// separately). Cycles so the grid stays visually varied instead of a
// mechanically repeating tile size.
const SPAN_PATTERN = [
    "sm:col-span-1 sm:row-span-1",
    "sm:col-span-1 sm:row-span-1",
    "sm:col-span-1 sm:row-span-2",
    "sm:col-span-2 sm:row-span-1",
    "sm:col-span-1 sm:row-span-1",
];

function getSpan(index: number) {
    if (index === 0) return "sm:col-span-2 sm:row-span-2";
    return SPAN_PATTERN[(index - 1) % SPAN_PATTERN.length];
}

export function ActivitiesShowcase({ activities }: { activities: Activity[] }) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    if (activities.length === 0) return null;

    return (
        <div>
            <div className="flex flex-col items-start gap-2.5">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                    {t.eyebrow}
                </span>
                <h3 className="font-heading text-2xl font-bold tracking-tight text-brand-primary sm:text-3xl">
                    {t.title}
                </h3>
                <p className="max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
                    {t.subtitle}
                </p>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-5 sm:auto-rows-[220px] sm:grid-cols-3">
                {activities.map((item, index) => (
                    <ActivityCard
                        key={item.id}
                        item={item}
                        span={getSpan(index)}
                        spotlight={index === 0}
                        index={index}
                        locale={locale}
                    />
                ))}
            </div>
        </div>
    );
}

function ActivityCard({
    item,
    span,
    spotlight,
    index,
    locale,
}: {
    item: Activity;
    span: string;
    spotlight: boolean;
    index: number;
    locale: Locale;
}) {
    const meta = TYPE_META[item.type];
    const title = localize(locale, item.titleFr, item.titleAr);
    const description = localize(locale, item.descriptionFr ?? "", item.descriptionAr);
    const dateLabel = item.date
        ? new Date(item.date).toLocaleDateString(
            locale === "ar" ? "ar" : locale === "en" ? "en-US" : "fr-FR",
            { day: "numeric", month: "long", year: "numeric" }
        )
        : null;

    return (
        <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                duration: 0.5,
                ease: EASE_OUT,
                delay: Math.min(index * 0.05, 0.3),
            }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative h-60 overflow-hidden rounded-[22px] bg-brand-surface shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_28px_-14px_rgba(28,77,51,0.28)] ring-1 ring-black/[0.04] transition-shadow duration-500 hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.10),0_28px_56px_-20px_rgba(28,77,51,0.42)] sm:h-auto ${span}`}
        >
            <Image
                src={item.imageUrl}
                alt={title}
                fill
                sizes={
                    spotlight
                        ? "(min-width: 640px) 66vw, 100vw"
                        : "(min-width: 640px) 33vw, 100vw"
                }
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14251f]/92 via-[#14251f]/25 to-transparent transition-opacity duration-500 group-hover:from-[#14251f]/95" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-brand-primary shadow-[0_2px_10px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.04] backdrop-blur-md">
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                    {meta.label[locale]}
                </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4">
                {dateLabel && (
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
                        {dateLabel}
                    </p>
                )}
                <h4
                    className={`font-heading mt-1 font-bold leading-snug tracking-tight text-white ${spotlight ? "text-2xl sm:text-3xl" : "text-[15px] sm:text-base"
                        }`}
                >
                    {title}
                </h4>
                {spotlight ? (
                    description && (
                        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/85 line-clamp-2 sm:line-clamp-3">
                            {description}
                        </p>
                    )
                ) : (
                    description && (
                        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
                            <p className="overflow-hidden text-xs leading-relaxed text-white/80 line-clamp-2">
                                {description}
                            </p>
                        </div>
                    )
                )}
            </div>
        </motion.article>
    );
}
