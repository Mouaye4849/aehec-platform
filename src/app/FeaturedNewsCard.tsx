"use client";

import Image from "next/image";
import Link from "next/link";
import type { News } from "@prisma/client";
import { localize, useLocale } from "@/lib/locale";
import { MetaPill } from "@/components/MetaPill";

const TEXT = {
    fr: { readMore: "Lire l'annonce →" },
    en: { readMore: "Read announcement →" },
    ar: { readMore: "اقرأ الإعلان ←" },
} as const;

export function FeaturedNewsCard({ item }: { item: News }) {
    const { locale } = useLocale();
    const t = TEXT[locale];
    const category = localize(locale, item.categoryFr ?? "", item.categoryAr);

    return (
        <Link
            href={`/actualites/${item.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-black sm:grid-cols-2"
        >
            {item.imageUrl && (
                <div className="relative h-56 w-full overflow-hidden sm:h-full">
                    <Image
                        src={item.imageUrl}
                        alt={localize(locale, item.titleFr, item.titleAr)}
                        fill
                        priority
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            )}
            <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                    {category && <MetaPill icon="tag">{category}</MetaPill>}
                    <MetaPill icon="calendar">
                        {new Date(item.publishedAt).toLocaleDateString(
                            locale === "ar"
                                ? "ar"
                                : locale === "en"
                                  ? "en-US"
                                  : "fr-FR"
                        )}
                    </MetaPill>
                </div>
                <h3 className="font-heading text-xl font-bold text-brand-primary sm:text-2xl">
                    {localize(locale, item.titleFr, item.titleAr)}
                </h3>
                {(item.excerptFr || item.excerptAr) && (
                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
                        {localize(locale, item.excerptFr ?? "", item.excerptAr)}
                    </p>
                )}
                <span className="mt-1 text-sm font-semibold text-brand-secondary">
                    {t.readMore}
                </span>
            </div>
        </Link>
    );
}
