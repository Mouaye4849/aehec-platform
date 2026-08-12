"use client";

import {
    ArchiveIcon,
    BarChartIcon,
    CheckCircledIcon,
    CrossCircledIcon,
    GroupIcon,
} from "@radix-ui/react-icons";
import { useLocale } from "@/lib/locale";
import { useCountUp } from "@/lib/useCountUp";

const TEXT = {
    fr: {
        total: "Candidats",
        admitted: "Admis",
        failed: "Ajournés",
        successRate: "Taux de réussite",
        institutions: "Établissements",
    },
    en: {
        total: "Candidates",
        admitted: "Admitted",
        failed: "Failed",
        successRate: "Success rate",
        institutions: "Institutions",
    },
    ar: {
        total: "المترشحون",
        admitted: "الناجحون",
        failed: "المؤجلون",
        successRate: "نسبة النجاح",
        institutions: "المؤسسات",
    },
} as const;

export type ResultStats = {
    total: number;
    admitted: number;
    failed: number;
    totalInstitutions: number;
};

export function StatsCards({ stats }: { stats: ResultStats }) {
    const { locale } = useLocale();
    const t = TEXT[locale];
    const successRate =
        stats.total > 0 ? Math.round((stats.admitted / stats.total) * 100) : 0;

    const cards = [
        { label: t.total, value: stats.total, suffix: "", icon: GroupIcon },
        { label: t.admitted, value: stats.admitted, suffix: "", icon: CheckCircledIcon },
        { label: t.failed, value: stats.failed, suffix: "", icon: CrossCircledIcon },
        { label: t.successRate, value: successRate, suffix: "%", icon: BarChartIcon },
        {
            label: t.institutions,
            value: stats.totalInstitutions,
            suffix: "",
            icon: ArchiveIcon,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.label} {...card} />
            ))}
        </div>
    );
}

function StatCard({
    label,
    value,
    suffix,
    icon: Icon,
}: {
    label: string;
    value: number;
    suffix: string;
    icon: typeof GroupIcon;
}) {
    const display = useCountUp(value);

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-brand-surface p-4 text-start shadow-sm dark:border-white/10 sm:gap-4 sm:p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <div className="min-w-0">
                <p className="font-heading text-2xl font-extrabold text-brand-primary sm:text-3xl">
                    {display}
                    {suffix}
                </p>
                <p className="mt-0.5 text-xs font-medium leading-snug text-brand-secondary sm:mt-1 sm:text-sm">
                    {label}
                </p>
            </div>
        </div>
    );
}
