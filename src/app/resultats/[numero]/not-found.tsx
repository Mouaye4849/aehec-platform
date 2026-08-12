"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";

const TEXT = {
    fr: {
        title: "Résultat introuvable",
        lead: "Aucun résultat ne correspond à ce numéro de dossier. Vérifiez le numéro saisi et réessayez.",
        back: "← Retour à la recherche",
    },
    en: {
        title: "Result not found",
        lead: "No result matches this file number. Check the number entered and try again.",
        back: "← Back to search",
    },
    ar: {
        title: "النتيجة غير موجودة",
        lead: "لا توجد نتيجة مطابقة لهذا الرقم. يرجى التحقق من الرقم والمحاولة مرة أخرى.",
        back: "← العودة إلى البحث",
    },
} as const;

export default function ResultNotFound() {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-brand-surface px-4 py-20 text-center sm:px-6">
            <h1 className="font-heading text-2xl font-bold text-brand-primary sm:text-3xl">
                {t.title}
            </h1>
            <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
                {t.lead}
            </p>
            <Link
                href="/resultats"
                className="mt-8 text-sm font-semibold text-brand-secondary hover:underline"
            >
                {t.back}
            </Link>
        </div>
    );
}
