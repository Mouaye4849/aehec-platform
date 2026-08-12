"use client";

import { useEffect, useState } from "react";

export type Announcement = {
    tone: "primary" | "accent" | "secondary";
    badge: string;
    title: string;
    excerpt: string;
};

const TONE_CLASSES: Record<Announcement["tone"], string> = {
    primary: "bg-brand-primary text-white",
    accent: "bg-brand-accent text-brand-primary",
    secondary: "bg-brand-secondary text-white",
};

export function AnnouncementsCarousel({
    items,
    prevLabel,
    nextLabel,
}: {
    items: Announcement[];
    prevLabel: string;
    nextLabel: string;
}) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || items.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % items.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [paused, items.length]);

    const current = items[index];

    function goTo(next: number) {
        setIndex((next + items.length) % items.length);
    }

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black sm:p-8"
        >
            <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${TONE_CLASSES[current.tone]}`}
            >
                {current.badge}
            </span>
            <h3 className="font-heading mt-4 text-xl font-bold text-brand-primary sm:text-2xl">
                {current.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
                {current.excerpt}
            </p>

            {items.length > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex gap-2">
                        {items.map((_, dotIndex) => (
                            <button
                                key={dotIndex}
                                type="button"
                                aria-label={`${dotIndex + 1}`}
                                onClick={() => goTo(dotIndex)}
                                className={`h-2 rounded-full transition-all ${
                                    dotIndex === index
                                        ? "w-6 bg-brand-primary"
                                        : "w-2 bg-brand-primary/20"
                                }`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            aria-label={prevLabel}
                            onClick={() => goTo(index - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/20 text-brand-primary transition-colors hover:bg-brand-primary/10 rtl:scale-x-[-1]"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            aria-label={nextLabel}
                            onClick={() => goTo(index + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/20 text-brand-primary transition-colors hover:bg-brand-primary/10 rtl:scale-x-[-1]"
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
