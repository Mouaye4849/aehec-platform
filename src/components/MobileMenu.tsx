"use client";

// The hamburger/close trigger only. The expandable panel itself now lives
// directly inside Header's own rounded pill container (as a sibling of the
// logo/nav row) so the open menu is the same box growing, not a separate
// floating element — open/close state is owned by Header and passed in here.
export function MobileMenuToggle({
    open,
    onToggle,
}: {
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-label="Menu"
            className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary shadow-[0_6px_16px_-4px_rgba(28,77,51,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_20px_-4px_rgba(28,77,51,0.55)] active:scale-90 md:hidden"
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
    );
}
