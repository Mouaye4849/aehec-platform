"use client";

import { useLocale, type Locale } from "@/lib/locale";

const SEGMENTS: { value: Locale; label: string }[] = [
    { value: "ar", label: "AR" },
    { value: "fr", label: "FR" },
    { value: "en", label: "EN" },
];

export function LanguageToggle() {
    const { locale, setLocale } = useLocale();

    return (
        <div className="flex items-center gap-0.5 rounded-full border border-brand-primary/25 bg-white p-0.5 dark:bg-black/20">
            {SEGMENTS.map((segment) => {
                const active = segment.value === locale;
                return (
                    <button
                        key={segment.value}
                        type="button"
                        onClick={() => setLocale(segment.value)}
                        aria-pressed={active}
                        className={`rounded-full px-2 py-1 text-xs font-bold transition-colors md:px-3 ${
                            active
                                ? "bg-brand-primary text-white"
                                : "text-brand-primary/60 hover:text-brand-primary"
                        }`}
                    >
                        {segment.label}
                    </button>
                );
            })}
        </div>
    );
}
