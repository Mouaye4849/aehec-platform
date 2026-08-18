"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserPlus } from "lucide-react";
import { useLocale } from "@/lib/locale";

type NavLink = { href: string; label: string };

const JOIN_CTA_TEXT = {
    fr: "Rejoignez-nous",
    en: "Join us",
    ar: "انضم إلينا",
} as const;

export function MobileMenu({ links }: { links: NavLink[] }) {
    const { locale } = useLocale();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }
        function handlePointerDown(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handlePointerDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handlePointerDown);
        };
    }, [open]);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname?.startsWith(href);

    return (
        <div ref={containerRef} className="md:hidden">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-label="Menu"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary transition-all duration-300 hover:scale-105 active:scale-90"
            >
                <div className="flex flex-col gap-1">
                    <span
                        className={`h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${open ? "translate-y-[6px] rotate-45" : ""
                            }`}
                    />
                    <span
                        className={`h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${open ? "opacity-0" : ""
                            }`}
                    />
                    <span
                        className={`h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${open ? "-translate-y-[6px] -rotate-45" : "group-hover:w-4"
                            }`}
                    />
                </div>
            </button>

            {/* Top navigation panel — anchored to the sticky header (nearest
            positioned ancestor), so it spans the full viewport width and
            starts flush against the navbar's bottom edge, not a centered
            modal. */}
            <div
                aria-hidden={!open}
                className={`absolute inset-x-0 top-full z-40 origin-top overflow-hidden bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 ease-in-out ${open
                    ? "max-h-[80vh] translate-y-0 opacity-100"
                    : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
                    }`}
            >
                <div className="mx-auto flex max-h-[80vh] w-full max-w-6xl flex-col overflow-y-auto">
                    <nav
                        dir={locale === "ar" ? "rtl" : "ltr"}
                        className="flex flex-col divide-y divide-black/5 px-4 py-1 sm:px-6"
                    >
                        {links.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={`py-3.5 text-[15px] transition-colors duration-200 ${active
                                        ? "font-semibold text-brand-primary"
                                        : "font-medium text-zinc-600 hover:text-brand-primary"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Join CTA — sits below the nav links, above the panel's
                    bottom edge. Icon is pinned left regardless of locale
                    direction, matching the reference button. */}
                    <div className="px-4 pt-3 pb-5 sm:px-6">
                        <Link
                            href="/contact"
                            onClick={() => setOpen(false)}
                            dir="ltr"
                            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-primary text-base font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110 hover:shadow-lg active:scale-95 sm:h-16"
                        >
                            <UserPlus className="h-5 w-5 shrink-0" />
                            <span>{JOIN_CTA_TEXT[locale]}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
