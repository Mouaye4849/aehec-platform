"use client";

import Link from "next/link";
import type { News } from "@prisma/client";
import { localize, useLocale } from "@/lib/locale";
import { MetaPill } from "@/components/MetaPill";

const TEXT = {
    fr: {
        title: "Actualités & activités",
        empty: "Aucune actualité publiée pour le moment.",
        readMore: "Lire la suite →",
    },
    en: {
        title: "News & Activities",
        empty: "No news published at the moment.",
        readMore: "Read more →",
    },
    ar: {
        title: "الأخبار والأنشطة",
        empty: "لا توجد أخبار منشورة حاليًا.",
        readMore: "اقرأ المزيد ←",
    },
} as const;

export function NewsList({ news }: { news: News[] }) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
            <h1 className="font-heading text-3xl font-bold text-brand-primary">
                {t.title}
            </h1>

            {news.length === 0 ? (
                <p className="mt-6 text-zinc-600 dark:text-zinc-400">{t.empty}</p>
            ) : (
                <div className="mt-8 flex flex-col gap-6">
                    {news.map((item) => (
                        <article
                            key={item.id}
                            className="rounded-xl border border-black/10 bg-brand-surface p-6 dark:border-white/10"
                        >
                            <MetaPill icon="calendar">
                                {new Date(item.publishedAt).toLocaleDateString(
                                    locale === "ar"
                                        ? "ar"
                                        : locale === "en"
                                          ? "en-US"
                                          : "fr-FR"
                                )}
                            </MetaPill>
                            <h2 className="mt-2 text-xl font-semibold text-brand-primary">
                                {localize(locale, item.titleFr, item.titleAr)}
                            </h2>
                            {(item.excerptFr || item.excerptAr) && (
                                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    {localize(
                                        locale,
                                        item.excerptFr ?? "",
                                        item.excerptAr
                                    )}
                                </p>
                            )}
                            <Link
                                href={`/actualites/${item.slug}`}
                                className="mt-4 inline-block text-sm font-semibold text-brand-secondary hover:underline"
                            >
                                {t.readMore}
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
