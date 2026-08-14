"use client";

import type { ComponentType } from "react";
import { GroupIcon, ReaderIcon, RocketIcon, StarIcon } from "@radix-ui/react-icons";
import { BendingGallery } from "@/components/ui/bending-gallery";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useLocale } from "@/lib/locale";

const ACTIVITY_IMAGES = [
    "/activities/Pub1.jpeg",
    "/activities/Rv1.jpeg",
    "/activities/Rv2.jpeg",
    "/activities/Rv3.jpeg",
    "/activities/Rv4.jpeg",
    "/activities/Rv5.jpeg",
    "/activities/Rv6.jpeg",
    "/activities/Rv7.jpeg",
    "/activities/Rv8.jpeg",
];

const STATS: {
    value: number;
    suffix: string;
    icon: ComponentType<{ className?: string }>;
    label: Record<"fr" | "en" | "ar", string>;
}[] = [
        {
            value: 115,
            suffix: "+",
            icon: StarIcon,
            label: { fr: "Activités", en: "Activities", ar: "نشاطاً" },
        },
        {
            value: 106,
            suffix: "+",
            icon: ReaderIcon,
            label: { fr: "Révisions académiques", en: "Academic reviews", ar: "مراجعة أكاديمية" },
        },
        {
            value: 3,
            suffix: "",
            icon: GroupIcon,
            label: { fr: "Séminaires", en: "Seminars", ar: "ندوات" },
        },
        {
            value: 6,
            suffix: "",
            icon: RocketIcon,
            label: { fr: "Formations et initiatives", en: "Courses & initiatives", ar: "دورات ومبادرات" },
        },
    ];

export function ActivitiesPhotoCloud() {
    const { locale } = useLocale();

    return (
        <div className="flex flex-col items-center">
            <div className="h-[300px] w-full overflow-hidden rounded-2xl border border-black/10 bg-brand-surface/40 sm:h-[420px] lg:h-[560px]">
                <BendingGallery images={ACTIVITY_IMAGES} />
            </div>

            <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4 sm:gap-4">
                {STATS.map((stat) => (
                    <StatCard key={stat.label.en} stat={stat} locale={locale} />
                ))}
            </div>
        </div>
    );
}

function StatCard({
    stat,
    locale,
}: {
    stat: (typeof STATS)[number];
    locale: "fr" | "en" | "ar";
}) {
    const Icon = stat.icon;

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-4 text-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-black">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
                <p className="font-heading text-xl font-extrabold text-brand-primary">
                    <NumberTicker value={stat.value} />
                    {stat.suffix}
                </p>
                <p className="mt-0.5 text-xs font-medium leading-snug text-brand-secondary">
                    {stat.label[locale]}
                </p>
            </div>
        </div>
    );
}
