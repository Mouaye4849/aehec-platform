"use client";

import Image from "next/image";
import Link from "next/link";
import type { News } from "@prisma/client";
import { localize, useLocale } from "@/lib/locale";
import { MetaPill } from "@/components/MetaPill";

const TEXT = {
    fr: { back: "← Toutes les actualités" },
    en: { back: "← All news" },
    ar: { back: "← جميع الأخبار" },
} as const;

export function NewsDetail({ article }: { article: News }) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
            <Link
                href="/actualites"
                className="text-sm font-semibold text-brand-secondary hover:underline"
            >
                {t.back}
            </Link>
            {article.imageUrl && (
                <div className="relative mt-6 h-56 w-full overflow-hidden rounded-xl sm:h-80">
                    <Image
                        src={article.imageUrl}
                        alt={localize(locale, article.titleFr, article.titleAr)}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-2">
                {(article.categoryFr || article.categoryAr) && (
                    <MetaPill icon="tag">
                        {localize(locale, article.categoryFr ?? "", article.categoryAr)}
                    </MetaPill>
                )}
                <MetaPill icon="calendar">
                    {new Date(article.publishedAt).toLocaleDateString(
                        locale === "ar"
                            ? "ar"
                            : locale === "en"
                              ? "en-US"
                              : "fr-FR"
                    )}
                </MetaPill>
            </div>
            <h1 className="font-heading mt-3 text-3xl font-bold text-brand-primary">
                {localize(locale, article.titleFr, article.titleAr)}
            </h1>
            <div className="prose mt-6 max-w-none whitespace-pre-line leading-relaxed text-zinc-700 dark:text-zinc-300">
                {localize(locale, article.contentFr, article.contentAr)}
            </div>
        </div>
    );
}
