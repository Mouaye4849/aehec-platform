"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export type Locale = "fr" | "ar" | "en";

const STORAGE_KEY = "aehec-locale";

type LocaleContextValue = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
    // Always start at the same default on server and client so the first
    // client render matches the server-rendered HTML exactly. The persisted
    // locale (browser-only) is applied afterward, once mounted.
    const [locale, setLocaleState] = useState<Locale>("fr");

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "ar" || stored === "fr" || stored === "en") {
            // Deliberate: this syncs state from localStorage, which doesn't
            // exist during SSR and must not affect the initial render (see
            // above) — it can only be read after hydration, in an effect.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLocaleState(stored);
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
        window.localStorage.setItem(STORAGE_KEY, locale);
    }, [locale]);

    const setLocale = (next: Locale) => setLocaleState(next);

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error("useLocale must be used within a LocaleProvider");
    }
    return context;
}

/**
 * Picks the Arabic or English value when active and non-empty, otherwise
 * falls back to French. Database-sourced content only ever has fr/ar
 * columns, so omitting `en` at a call site is expected and just falls
 * back to French under the English locale.
 */
export function localize(
    locale: Locale,
    fr: string,
    ar?: string | null,
    en?: string | null
): string {
    if (locale === "ar" && ar) return ar;
    if (locale === "en" && en) return en;
    return fr;
}

export const UI_TEXT = {
    fr: {
        brand: {
            name: "AEHEC",
            fullName: "Association des Étudiants du Hodh Ech Chargui",
            motto: "Solidarité · Excellence · Créativité",
        },
        nav: {
            home: "Accueil",
            about: "À propos",
            committee: "Comité",
            news: "Actualités",
            resources: "Ressources",
            results: "Résultats",
        },
        footer: {
            contact: "Contact",
            rights: "Tous droits réservés.",
        },
    },
    en: {
        brand: {
            name: "AEHEC",
            fullName: "Association of Students of Hodh Ech Chargui",
            motto: "Solidarity · Excellence · Creativity",
        },
        nav: {
            home: "Home",
            about: "About",
            committee: "Committee",
            news: "News",
            resources: "Resources",
            results: "Results",
        },
        footer: {
            contact: "Contact",
            rights: "All rights reserved.",
        },
    },
    ar: {
        brand: {
            name: "رابطة طلاب الحوض الشرقي",
            fullName: "رابطة طلاب الحوض الشرقي",
            motto: "تضامن - تميز - إبداع",
        },
        nav: {
            home: "الرئيسية",
            about: "من نحن",
            committee: "المكتب التنفيذي",
            news: "الأخبار والأنشطة",
            resources: "موارد الدعم",
            results: "النتائج",
        },
        footer: {
            contact: "اتصل بنا",
            rights: "جميع الحقوق محفوظة.",
        },
    },
} as const;
