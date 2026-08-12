"use client";

import { localize, useLocale } from "@/lib/locale";

const TEXT = {
    fr: {
        title: "Résultats par wilaya",
        wilaya: "Wilaya",
        total: "Candidats",
        admitted: "Admis",
        successRate: "Taux de réussite",
        empty: "Aucune donnée disponible pour le moment.",
    },
    en: {
        title: "Results by wilaya",
        wilaya: "Wilaya",
        total: "Candidates",
        admitted: "Admitted",
        successRate: "Success rate",
        empty: "No data available yet.",
    },
    ar: {
        title: "النتائج حسب الولاية",
        wilaya: "الولاية",
        total: "المترشحون",
        admitted: "الناجحون",
        successRate: "نسبة النجاح",
        empty: "لا توجد بيانات متاحة حاليًا.",
    },
} as const;

export type WilayaStat = {
    nameFr: string;
    nameAr: string | null;
    totalCount: number;
    admittedCount: number;
    successRate: number;
};

export function ResultsByWilaya({ items }: { items: WilayaStat[] }) {
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
                                        {t.wilaya}
                                    </th>
                                    <th className="px-4 py-3 text-start font-semibold">
                                        {t.total}
                                    </th>
                                    <th className="px-4 py-3 text-start font-semibold">
                                        {t.admitted}
                                    </th>
                                    <th className="px-4 py-3 text-start font-semibold">
                                        {t.successRate}
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
                                            {item.totalCount}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                            {item.admittedCount}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                            {item.successRate.toFixed(0)}%
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
                                        {t.total}: {item.totalCount}
                                    </span>
                                    <span>
                                        {t.admitted}: {item.admittedCount}
                                    </span>
                                    <span className="font-semibold text-brand-secondary">
                                        {item.successRate.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
