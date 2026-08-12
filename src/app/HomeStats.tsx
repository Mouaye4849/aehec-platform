"use client";

import type { ComponentType } from "react";
import { CalendarIcon, GroupIcon, ReaderIcon, StarIcon } from "@radix-ui/react-icons";
import { useLocale } from "@/lib/locale";
import { useCountUp } from "@/lib/useCountUp";

const TEXT = {
    fr: {
        title: "La Rabita en chiffres",
        members: "Membres",
        founded: "Année de fondation",
        reviews: "Cours et ateliers",
        reviewsPlaceholder: "Bientôt disponible",
        success: "Réussites et activités",
        successPlaceholder: "Bientôt disponible",
    },
    en: {
        title: "The Rabita in numbers",
        members: "Members",
        founded: "Founding year",
        reviews: "Courses and workshops",
        reviewsPlaceholder: "Coming soon",
        success: "Success stories and activities",
        successPlaceholder: "Coming soon",
    },
    ar: {
        title: "الرابطة بالأرقام",
        members: "الأعضاء",
        founded: "سنة التأسيس",
        reviews: "الدروس والورشات",
        reviewsPlaceholder: "قريبًا",
        success: "قصص النجاح والأنشطة",
        successPlaceholder: "قريبًا",
    },
} as const;

// Real, currently-known figures — updated by hand as the association grows.
const MEMBERS_COUNT = 82;
const FOUNDATION_YEAR = 2022;

export function HomeStats() {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <div>
            <h2 className="sr-only">{t.title}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
                <StatCard icon={GroupIcon} value={MEMBERS_COUNT} label={t.members} />
                <StatCard icon={CalendarIcon} value={FOUNDATION_YEAR} label={t.founded} />
                <PlaceholderCard icon={ReaderIcon} label={t.reviews} placeholder={t.reviewsPlaceholder} />
                <PlaceholderCard icon={StarIcon} label={t.success} placeholder={t.successPlaceholder} />
            </div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    value,
    label,
}: {
    icon: ComponentType<{ className?: string }>;
    value: number;
    label: string;
}) {
    const display = useCountUp(value);

    return (
        <div className="group rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-black">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white">
                <Icon className="h-6 w-6" />
            </span>
            <p className="font-heading mt-4 text-3xl font-extrabold text-brand-primary">
                {display}
            </p>
            <p className="mt-1 text-sm font-medium text-brand-secondary">{label}</p>
        </div>
    );
}

function PlaceholderCard({
    icon: Icon,
    label,
    placeholder,
}: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    placeholder: string;
}) {
    return (
        <div className="group rounded-2xl border border-dashed border-black/15 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/15 dark:bg-black">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white">
                <Icon className="h-6 w-6" />
            </span>
            <p className="font-heading mt-4 text-lg font-bold text-brand-primary/50">
                {placeholder}
            </p>
            <p className="mt-1 text-sm font-medium text-brand-secondary">{label}</p>
        </div>
    );
}
