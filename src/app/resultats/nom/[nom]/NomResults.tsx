"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { CandidateResultsTable, type Candidate } from "@/app/resultats/CandidateResultsTable";

const TEXT = {
    fr: {
        back: "← Retour à la recherche",
        title: (q: string) => `Résultats pour « ${q} »`,
        results: (n: number) => `${n} résultat${n > 1 ? "s" : ""}`,
        empty: "Aucun résultat ne correspond à ce nom.",
    },
    en: {
        back: "← Back to search",
        title: (q: string) => `Results for "${q}"`,
        results: (n: number) => `${n} result${n > 1 ? "s" : ""}`,
        empty: "No results match this name.",
    },
    ar: {
        back: "← العودة إلى البحث",
        title: (q: string) => `نتائج البحث عن "${q}"`,
        results: (n: number) => `${n} نتيجة`,
        empty: "لا توجد نتائج مطابقة لهذا الاسم.",
    },
} as const;

export function NomResults({
    query,
    results,
}: {
    query: string;
    results: Candidate[];
}) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
            <Link
                href="/resultats"
                className="text-sm font-semibold text-brand-secondary hover:underline"
            >
                {t.back}
            </Link>

            <h1 className="font-heading mt-4 text-2xl font-bold text-brand-primary sm:text-3xl">
                {t.title(query)}
            </h1>

            {results.length === 0 ? (
                <p className="mt-6 text-zinc-600 dark:text-zinc-400">{t.empty}</p>
            ) : (
                <>
                    <p className="mt-1 text-sm text-zinc-500">
                        {t.results(results.length)}
                    </p>

                    <div className="mt-6">
                        <CandidateResultsTable results={results} showInstitution />
                    </div>
                </>
            )}
        </div>
    );
}
