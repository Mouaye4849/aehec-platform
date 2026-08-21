import { DotPattern } from "@/components/magicui/dot-pattern";

// Global fixed background — Magic UI's <DotPattern/>, tinted to the AEHEC
// identity, replacing the previous canvas-noise effect. Same wrapper,
// position, and size as before (`fixed inset-0 -z-10`, pointer-events
// disabled), so no other layout is affected.
//
// `glow` is left off (the component's default): with it on, every dot
// becomes its own continuously-animating Motion element, which is fine for
// a small section-local instance but not for something that stays mounted
// full-viewport on every route. Spacing is also widened from the 26px used
// for section-local accents elsewhere on the site to 40px, cutting the
// per-viewport dot count roughly in half for the same reason — this
// component computes one SVG circle per dot from the container's actual
// pixel size, so count scales with area.
export function SiteBackground() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            style={{ background: "var(--brand-surface)" }}
        >
            {/* Soft green glow (Primary) */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(680px 420px at 50% 0%, rgba(20,83,45,0.13), transparent 72%)",
                }}
            />
            {/* Soft gold glow (Secondary) */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(760px 460px at 50% 100%, rgba(212,160,23,0.10), transparent 75%)",
                }}
            />

            <DotPattern
                width={40}
                height={40}
                cr={1.3}
                className="text-brand-primary/[0.12]"
                style={{
                    maskImage:
                        "radial-gradient(ellipse 85% 70% at 50% 30%, black 35%, transparent 88%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 85% 70% at 50% 30%, black 35%, transparent 88%)",
                }}
            />
        </div>
    );
}
