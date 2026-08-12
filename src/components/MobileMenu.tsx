"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cross2Icon } from "@radix-ui/react-icons";
import { UI_TEXT, useLocale } from "@/lib/locale";

type NavLink = { href: string; label: string };

export function MobileMenu({ links }: { links: NavLink[] }) {
    const { locale } = useLocale();
    const pathname = usePathname();
    const brand = UI_TEXT[locale].brand;
    const [open, setOpen] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname?.startsWith(href);

    return (
        <div className="md:hidden">
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-label="Menu"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary transition-all duration-300 hover:scale-105 active:scale-90"
            >
                <div className="flex flex-col gap-1">
                    <span className="h-0.5 w-5 rounded-full bg-white transition-all duration-300 group-hover:w-6" />
                    <span className="h-0.5 w-5 rounded-full bg-white transition-all duration-300" />
                    <span className="h-0.5 w-5 rounded-full bg-white transition-all duration-300 group-hover:w-4" />
                </div>
            </button>

            <div
                aria-hidden={!open}
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-in-out ${open
                    ? "opacity-100 translate-y-0"
                    : "pointer-events-none opacity-0 -translate-y-10"
                    }`}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label={brand.name}
                className={`fixed inset-0 z-50 flex items-start justify-center pt-3 px-4 transition-all duration-300 ${open
                    ? "opacity-100 translate-y-0 scale-100"
                    : "pointer-events-none opacity-0 -translate-y-8 scale-95"
                    }`}
            >
                <div className="w-[86%] max-w-[330px] self-start rounded-[32px] bg-brand-surface shadow-2xl overflow-hidden">
                    {/* Header section — logo, association name, close button.
                    Flush, no card, matching the reference's minimal top
                    bar. */}

                    <div className="px-5 pt-5 pb-2">
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close"
                            className="mb-3 flex h-10 w-10 items-center justify-center rounded-full text-brand-primary hover:bg-black/5 transition-all duration-300"
                        >
                            <Cross2Icon className="h-7 w-7" />
                        </button>
                    </div>

                    <div className="flex  flex-col overflow-y-auto px-5 pb-4">
                        {/* One main rounded container holding every nav item as
                        a plain text row — no icons, no per-item boxes, just
                        a clean vertical list separated by hairlines. */}
                        <nav
                            dir={locale === "ar" ? "rtl" : "ltr"}
                            className="
 mt-2
 flex flex-col
 divide-y divide-black/5
 rounded-[22px]
 bg-white
 px-5
 py-2
 shadow-sm
 ring-1 ring-black/5
 "
                        >
                            {links.map((link) => {
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={`
                                                py-2.5
                                                text-[15px]
                                                transition-all duration-300
                                                ${active
                                                ? "font-semibold text-brand-primary"
                                                : "font-medium text-zinc-600 hover:text-brand-primary"}
`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </div >
    );
}
