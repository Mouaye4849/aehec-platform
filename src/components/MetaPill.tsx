const ICONS = {
    calendar: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5Z"
        />
    ),
    pin: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 5.25-7.5 10.5-7.5 10.5S4.5 15.75 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
    ),
} as const;

export function MetaPill({
    icon,
    children,
}: {
    icon: keyof typeof ICONS;
    children: React.ReactNode;
}) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/20 bg-brand-surface px-3 py-1 text-xs font-medium text-brand-primary">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-3.5 w-3.5 shrink-0"
            >
                {ICONS[icon]}
            </svg>
            {children}
        </span>
    );
}
