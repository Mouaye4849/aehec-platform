"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UI_TEXT, useLocale } from "@/lib/locale";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileMenu } from "@/components/MobileMenu";

export function Header() {
    const { locale } = useLocale();
    const pathname = usePathname();
    const t = UI_TEXT[locale].nav;
    const brand = UI_TEXT[locale].brand;

    const links: { href: string; label: string }[] = [
        { href: "/", label: t.home },
        { href: "/a-propos", label: t.about },
        { href: "/comite", label: t.committee },
        { href: "/actualites", label: t.news },
        { href: "/ressources", label: t.resources },
        { href: "/resultats", label: t.results },
    ];

    return (
        <header className="sticky top-0 z-30 bg-white px-3 pt-3 md:border-b md:border-black/10 md:bg-brand-surface md:px-0 md:pt-0">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full bg-brand-surface px-2.5 py-2.5 shadow-md ring-1 ring-black/5 sm:px-4 md:gap-4 md:rounded-none md:bg-transparent md:px-6 md:py-4 md:shadow-none md:ring-0">
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
                                className={`rounded-full px-4 py-2 transition-colors ${active
                                    ? "bg-brand-primary text-white"
                                    : "text-brand-primary/80 hover:bg-brand-primary/10"
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
                        <MobileMenu links={links} />
                    </div>
                ) : (
                    <div className="ml-auto flex shrink-0 items-center gap-2">
                        <LanguageToggle />
                        <MobileMenu links={links} />
                    </div>
                )}
            </div>
        </header>
    );

}
