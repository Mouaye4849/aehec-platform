"use client";

import Link from "next/link";
import { localize, useLocale } from "@/lib/locale";

const TEXT = {
    fr: {
        name: "Nom",
        numero: "Numéro",
        decision: "Décision",
        average: "Moyenne",
        institution: "Établissement",
    },
    en: {
        name: "Name",
        numero: "Number",
        decision: "Decision",
        average: "Average",
        institution: "Institution",
    },
    ar: {
        name: "الاسم",
        numero: "الرقم",
        decision: "القرار",
        average: "المعدل",
        institution: "المؤسسة",
    },
} as const;

export type Candidate = {
    numero: string;
    nomFr: string;
    nomAr: string | null;
    decision: string;
    moyenne: number | null;
    etablissementFr?: string | null;
    etablissementAr?: string | null;
};

// Renders as a table from `sm` up, and as a stacked card list below `sm` so
// mobile never needs horizontal scrolling to read a row.
export function CandidateResultsTable({
    results,
    showInstitution = false,
}: {
    results: Candidate[];
    showInstitution?: boolean;
}) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <>
            <div className="hidden overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 sm:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-brand-surface text-brand-primary">
                            <th className="px-4 py-3 text-start font-semibold">
                                {t.name}
                            </th>
                            <th className="px-4 py-3 text-start font-semibold">
                                {t.numero}
                            </th>
                            {showInstitution && (
                                <th className="px-4 py-3 text-start font-semibold">
                                    {t.institution}
                                </th>
                            )}
                            <th className="px-4 py-3 text-start font-semibold">
                                {t.decision}
                            </th>
                            <th className="px-4 py-3 text-start font-semibold">
                                {t.average}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr
                                key={result.numero}
                                className="border-t border-black/5 dark:border-white/10"
                            >
                                <td className="px-4 py-3 font-medium text-brand-primary">
                                    <Link
                                        href={`/resultats/${encodeURIComponent(result.numero)}`}
                                        className="hover:underline"
                                    >
                                        {localize(locale, result.nomFr, result.nomAr ?? undefined)}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                    {result.numero}
                                </td>
                                {showInstitution && (
                                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                        {result.etablissementFr
                                            ? localize(
                                                  locale,
                                                  result.etablissementFr,
                                                  result.etablissementAr ?? undefined
                                              )
                                            : "—"}
                                    </td>
                                )}
                                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                    {result.decision}
                                </td>
                                <td className="px-4 py-3 font-semibold text-brand-secondary">
                                    {result.moyenne != null
                                        ? result.moyenne.toFixed(2)
                                        : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 sm:hidden">
                {results.map((result) => (
                    <Link
                        key={result.numero}
                        href={`/resultats/${encodeURIComponent(result.numero)}`}
                        className="block rounded-2xl border border-black/10 bg-brand-surface p-4 text-start dark:border-white/10"
                    >
                        <p className="font-semibold text-brand-primary">
                            {localize(locale, result.nomFr, result.nomAr ?? undefined)}
                        </p>
                        {showInstitution && result.etablissementFr && (
                            <p className="mt-0.5 truncate text-xs text-zinc-500">
                                {localize(
                                    locale,
                                    result.etablissementFr,
                                    result.etablissementAr ?? undefined
                                )}
                            </p>
                        )}
                        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <span>
                                {t.numero}: {result.numero}
                            </span>
                            <span>{result.decision}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-brand-secondary">
                            {t.average}:{" "}
                            {result.moyenne != null ? result.moyenne.toFixed(2) : "—"}
                        </p>
                    </Link>
                ))}
            </div>
        </>
    );
}
