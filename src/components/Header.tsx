"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserPlus } from "lucide-react";
import { UI_TEXT, useLocale } from "@/lib/locale";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileMenuToggle } from "@/components/MobileMenu";

const JOIN_CTA_TEXT = {
    fr: "Rejoignez-nous",
    en: "Join us",
    ar: "انضم إلينا",
} as const;

export function Header() {
    const { locale } = useLocale();
    const pathname = usePathname();
    const t = UI_TEXT[locale].nav;
    const brand = UI_TEXT[locale].brand;
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 8);
        }
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!mobileOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setMobileOpen(false);
        }
        function handlePointerDown(event: MouseEvent) {
            if (
                navRef.current &&
                !navRef.current.contains(event.target as Node)
            ) {
                setMobileOpen(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handlePointerDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handlePointerDown);
        };
    }, [mobileOpen]);

    // Overlay behavior: while the panel is open, the page behind it must not
    // scroll and must not reflow. Locking body scroll here (rather than
    // relying on the panel merely sitting on top) keeps a two-finger swipe
    // on the dimmed backdrop from scrolling the page underneath.
    useEffect(() => {
        if (!mobileOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [mobileOpen]);

    const links: { href: string; label: string }[] = [
        { href: "/", label: t.home },
        { href: "/a-propos", label: t.about },
        { href: "/comite", label: t.committee },
        { href: "/actualites", label: t.news },
        { href: "/ressources", label: t.resources },
        { href: "/resultats", label: t.results },
    ];

    // Mobile navigation includes an extra Contact entry; desktop nav is
    // left untouched and keeps using `links` above.
    const mobileLinks = [...links, { href: "/contact", label: t.contact }];

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname?.startsWith(href);

    // Shared between the pill and the dropdown so they read as one
    // continuous surface (same glass tone, same border color) even though
    // they're now two separate elements — the pill stays a fixed-height
    // element (so opening the menu never changes its box, hence never
    // reflows the page); the dropdown is absolutely positioned below it.
    const surfaceClasses = scrolled
        ? "border-black/[0.06] bg-white/85 shadow-[0_18px_45px_-18px_rgba(28,77,51,0.32),0_4px_16px_-6px_rgba(0,0,0,0.08)]"
        : "border-white/60 bg-white/55 shadow-[0_10px_30px_-14px_rgba(28,77,51,0.22)]";

    return (
        <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6 lg:pt-5">
            {/* Backdrop — dims the page content behind the open panel without
            covering the header itself (header's z-30 sits above this z-20,
            so it stays crisp). Also gives the "outside click" listener above
            a large, obvious tap target on touch devices. */}
            <div
                aria-hidden
                onClick={() => setMobileOpen(false)}
                className={`fixed inset-0 z-20 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${mobileOpen
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                    }`}
            />

            <div ref={navRef} className="relative z-30 mx-auto max-w-6xl">
                {/* The pill itself — fixed height always (only the header
                row), so opening the menu never changes this box's size and
                never pushes the page below it. Its bottom corners flatten
                when open so it visually flows into the dropdown with no
                seam, instead of a curved stadium edge meeting a flat panel
                (which reads as a gap). */}
                <div
                    className={`animate-fade-in-down overflow-hidden border backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow,border-radius] duration-300 ease-out md:rounded-full ${mobileOpen ? "rounded-t-[28px] rounded-b-none" : "rounded-[28px]"
                        } ${surfaceClasses}`}
                >
                    <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 md:gap-4 md:px-5 md:py-3">
                        <Link
                            href="/"
                            className="flex min-w-0 flex-1 items-center gap-2 md:flex-none md:gap-3"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-2 ring-brand-accent/40 md:h-12 md:w-12">
                                <Image
                                    src="/logo.png"
                                    alt={brand.name}
                                    width={48}
                                    height={48}
                                    className="h-[42px] w-[42px] object-contain md:h-10 md:w-10"
                                    priority
                                />
                            </span>
                            <span className="flex min-w-0 flex-col leading-tight">
                                <span className="font-heading line-clamp-2 text-sm leading-snug font-extrabold text-brand-primary md:line-clamp-none md:truncate md:text-lg md:leading-tight">
                                    {brand.name}
                                </span>
                                <span className="hidden text-xs tracking-wide text-brand-secondary sm:block">
                                    {brand.motto}
                                </span>
                            </span>
                        </Link>

                        <nav className="hidden flex-wrap items-center gap-1 text-sm font-medium md:flex">
                            {links.map((link) => {
                                const active =
                                    link.href === "/"
                                        ? pathname === "/"
                                        : pathname?.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`rounded-full px-4 py-2 transition-all duration-300 ease-out ${active
                                            ? "bg-brand-primary text-white shadow-[0_4px_14px_-4px_rgba(28,77,51,0.45)]"
                                            : "text-brand-primary/75 hover:bg-brand-primary/8 hover:text-brand-primary"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {locale === "ar" ? (
                            <div className="flex shrink-0 items-center gap-2">
                                <LanguageToggle />
                                <MobileMenuToggle
                                    open={mobileOpen}
                                    onToggle={() => setMobileOpen((value) => !value)}
                                />
                            </div>
                        ) : (
                            <div className="ml-auto flex shrink-0 items-center gap-2">
                                <LanguageToggle />
                                <MobileMenuToggle
                                    open={mobileOpen}
                                    onToggle={() => setMobileOpen((value) => !value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Overlay panel — absolutely positioned against the `relative`
                wrapper above (matching the pill's exact width), so it never
                participates in document flow and can never push page
                content down. Same surface tone/border as the pill and
                flush against its flattened bottom edge, so the two read as
                one continuous shape rather than a separate floating popup. */}
                <div
                    className={`absolute inset-x-0 top-full z-40 origin-top overflow-hidden rounded-b-[28px] border-x border-b backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-in-out md:hidden ${mobileOpen
                        ? "max-h-[75vh] translate-y-0 opacity-100"
                        : "pointer-events-none max-h-0 -translate-y-1 opacity-0"
                        } ${surfaceClasses}`}
                >
                    <div className="max-h-[75vh] overflow-y-auto">
                        <nav
                            dir={locale === "ar" ? "rtl" : "ltr"}
                            className="flex flex-col divide-y divide-black/5 px-4 sm:px-6"
                        >
                            {mobileLinks.map((link) => {
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`py-3 text-[15px] transition-colors duration-200 ${active
                                            ? "font-semibold text-brand-primary"
                                            : "font-medium text-zinc-600 hover:text-brand-primary"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="px-4 pb-4 pt-2 sm:px-6">
                            <Link
                                href="/contact"
                                onClick={() => setMobileOpen(false)}
                                dir="ltr"
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-primary text-sm font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110 hover:shadow-lg active:scale-95 sm:h-14 sm:text-base"
                            >
                                <UserPlus className="h-5 w-5 shrink-0" />
                                <span>{JOIN_CTA_TEXT[locale]}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
