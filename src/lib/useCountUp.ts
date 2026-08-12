"use client";

import { useEffect, useRef, useState } from "react";

// requestAnimationFrame count-up from 0 to `value`, eased out, respecting
// prefers-reduced-motion by skipping straight to the final value.
export function useCountUp(value: number, durationMs = 900) {
    const [display, setDisplay] = useState(0);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) {
            // Synchronous jump to the final value when motion is disabled —
            // no animation frame loop to fold this into, so skip the lint
            // rule here (same precedent as the locale hydration read).
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDisplay(value);
            return;
        }

        const start = performance.now();
        function tick(now: number) {
            const progress = Math.min((now - start) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(tick);
            }
        }
        frameRef.current = requestAnimationFrame(tick);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [value, durationMs]);

    return display;
}
