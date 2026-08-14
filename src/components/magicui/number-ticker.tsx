"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
    value: number;
    startValue?: number;
    direction?: "up" | "down";
    delay?: number;
    decimalPlaces?: number;
    /** Set to false for values like a year (e.g. 2022) that should never get a thousands separator. */
    useGrouping?: boolean;
}

// From Magic UI's registry (https://magicui.design/r/number-ticker.json):
// animates a number from `startValue` to `value` once it scrolls into view,
// and only once (`useInView(..., { once: true })`) — exactly what's needed
// for "counts up when the section enters the viewport, once per page load".
// Renders `startValue` on the server/initial client render, so there is no
// hydration mismatch — the animation only ever starts after mount.
// One addition over the stock component: `useGrouping`, so a 4-digit value
// like a founding year doesn't get a thousands separator ("2,022").
export function NumberTicker({
    value,
    startValue = 0,
    direction = "up",
    delay = 0,
    className,
    decimalPlaces = 0,
    useGrouping = true,
    ...props
}: NumberTickerProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? value : startValue);
    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;

        if (isInView) {
            timer = setTimeout(() => {
                motionValue.set(direction === "down" ? startValue : value);
            }, delay * 1000);
        }

        return () => {
            if (timer !== null) {
                clearTimeout(timer);
            }
        };
    }, [motionValue, isInView, delay, value, direction, startValue]);

    useEffect(
        () =>
            springValue.on("change", (latest) => {
                if (ref.current) {
                    ref.current.textContent = Intl.NumberFormat("en-US", {
                        useGrouping,
                        minimumFractionDigits: decimalPlaces,
                        maximumFractionDigits: decimalPlaces,
                    }).format(Number(latest.toFixed(decimalPlaces)));
                }
            }),
        [springValue, decimalPlaces, useGrouping]
    );

    return (
        <span
            ref={ref}
            className={cn("inline-block tabular-nums", className)}
            {...props}
        >
            {startValue}
        </span>
    );
}
