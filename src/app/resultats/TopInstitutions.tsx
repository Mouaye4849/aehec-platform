"use client";

import { localize, useLocale } from "@/lib/locale";

const TEXT = {
    fr: {
        title: "Meilleurs établissements",
        institution: "Établissement",
        admitted: "Admis",
        successRate: "Taux de réussite",
        bestAverage: "Meilleure moyenne",
        empty: "Aucune donnée disponible pour le moment.",
    },
    en: {
        title: "Top institutions",
        institution: "Institution",
        admitted: "Admitted",
        successRate: "Success rate",
        bestAverage: "Best average",
        empty: "No data available yet.",
    },
    ar: {
        title: "أفضل المؤسسات",
        institution: "المؤسسة",
        admitted: "الناجحون",
        successRate: "نسبة النجاح",
        bestAverage: "أفضل معدل",
        empty: "لا توجد بيانات متاحة حاليًا.",
    },
} as const;

export type InstitutionStat = {
    nameFr: string;
    nameAr: string | null;
    admittedCount: number;
    totalCount: number;
    successRate: number;
    bestAverage: number | null;
};

export function TopInstitutions({ items }: { items: InstitutionStat[] }) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <section>
            <h2 className="font-heading text-xl font-bold text-brand-primary">
                {t.title}
            </h2>

            {items.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {t.empty}
                </p>
            ) : (
                <>
                    <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 sm:block">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-brand-surface text-brand-primary">
                                    <th className="px-4 py-3 text-start font-semibold">
                                        {t.institution}
                                    </th>
                                    <th className="px-4 py-3 text-start font-semibold">
                                        {t.admitted}
                                    </th>
                                    <th className="px-4 py-3 text-start font-semibold">
                                        {t.successRate}
                                    </th>
                                    <th className="px-4 py-3 text-start font-semibold">
                                        {t.bestAverage}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr
                                        key={item.nameFr}
                                        className="border-t border-black/5 dark:border-white/10"
                                    >
                                        <td className="px-4 py-3 font-medium text-brand-primary">
                                            {localize(locale, item.nameFr, item.nameAr ?? undefined)}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                            {item.admittedCount} / {item.totalCount}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                            {item.successRate.toFixed(0)}%
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                            {item.bestAverage != null
                                                ? item.bestAverage.toFixed(2)
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:hidden">
                        {items.map((item) => (
                            <div
                                key={item.nameFr}
                                className="rounded-2xl border border-black/10 bg-brand-surface p-4 text-start dark:border-white/10"
                            >
                                <p className="truncate font-semibold text-brand-primary">
                                    {localize(locale, item.nameFr, item.nameAr ?? undefined)}
                                </p>
                                <div className="mt-2 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                                    <span>
                                        {t.admitted}: {item.admittedCount} / {item.totalCount}
                                    </span>
                                    <span className="font-semibold text-brand-secondary">
                                        {item.successRate.toFixed(0)}%
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-zinc-500">
                                    {t.bestAverage}:{" "}
                                    {item.bestAverage != null
                                        ? item.bestAverage.toFixed(2)
                                        : "—"}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
