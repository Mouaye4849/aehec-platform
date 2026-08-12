"use client";

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
            <div className="mt-6">
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
