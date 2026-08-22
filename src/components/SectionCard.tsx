import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Shared "framed section" container used across the site (homepage sections,
// About page sections, etc). Rounded corners, a subtle border, a soft
// brand-tinted shadow, and a thin gold accent bar give each section its own
// clearly-separated, professional panel on top of the site-wide dot-pattern
// background. `bodyClassName` lets a caller override the default padding
// rhythm (e.g. the homepage hero, which is taller than other sections).
export function SectionCard({
    children,
    className,
    bodyClassName = "px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14",
}: {
    children: ReactNode;
    className?: string;
    bodyClassName?: string;
}) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(28,77,51,0.22)] dark:border-white/10 dark:bg-black",
                className
            )}
        >
            <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent" />
            <div className={bodyClassName}>{children}</div>
        </div>
    );
}
