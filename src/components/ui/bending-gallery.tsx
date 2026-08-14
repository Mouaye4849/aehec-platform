"use client";

import { useEffect, useRef } from "react";
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";

type GL = Renderer["gl"];

interface BendingGalleryProps {
    images: string[];
    bend?: number;
    borderRadius?: number;
    /** Overall exposure multiplier applied in the fragment shader (1 = untouched). Lower = darker/softer. */
    brightness?: number;
    /** Contrast around mid-gray applied in the fragment shader (1 = untouched). Lower = flatter/more matte, which also softens blown-out highlights. */
    contrast?: number;
    className?: string;
}

function lerp(p1: number, p2: number, t: number): number {
    return p1 + (p2 - p1) * t;
}

// Ambient idle motion: a tiny per-frame nudge to the scroll target, not a
// carousel autoplay. At ~60fps this is on the order of one full lap per
// minute — deliberately closer to "the gallery is breathing" than "the
// gallery is scrolling". The existing lerp-based easing (see `update()`)
// means starting/stopping this nudge is inherently smooth: nothing snaps,
// it just decelerates/accelerates like every other scroll input already
// does here. Mobile runs at a slower speed rather than being disabled.
const AUTO_SCROLL_SPEED_DESKTOP = 0.012;
const AUTO_SCROLL_SPEED_MOBILE = 0.005;
const AUTO_SCROLL_MIN_SCREEN_WIDTH = 640; // matches the project's `sm` breakpoint

interface ScreenSize {
    width: number;
    height: number;
}

interface Viewport {
    width: number;
    height: number;
}

interface MediaOptions {
    geometry: Plane;
    gl: GL;
    image: string;
    index: number;
    length: number;
    scene: Transform;
    screen: ScreenSize;
    viewport: Viewport;
    bend: number;
    borderRadius: number;
    brightness: number;
    contrast: number;
}

// A single image plane on the ribbon: loads its texture, bends along the
// scroll axis, and wraps around infinitely as it exits the viewport.
class Media {
    extra = 0;
    geometry: Plane;
    gl: GL;
    image: string;
    index: number;
    length: number;
    scene: Transform;
    screen: ScreenSize;
    viewport: Viewport;
    bend: number;
    borderRadius: number;
    brightness: number;
    contrast: number;
    program!: Program;
    plane!: Mesh;
    scale!: number;
    padding!: number;
    width!: number;
    widthTotal!: number;
    x!: number;
    speed = 0;
    isBefore = false;
    isAfter = false;

    constructor(opts: MediaOptions) {
        this.geometry = opts.geometry;
        this.gl = opts.gl;
        this.image = opts.image;
        this.index = opts.index;
        this.length = opts.length;
        this.scene = opts.scene;
        this.screen = opts.screen;
        this.viewport = opts.viewport;
        this.bend = opts.bend;
        this.borderRadius = opts.borderRadius;
        this.brightness = opts.brightness;
        this.contrast = opts.contrast;
        this.createShader();
        this.createMesh();
        this.onResize();
    }

    createShader() {
        const texture = new Texture(this.gl, { generateMipmaps: false });
        this.program = new Program(this.gl, {
            depthTest: false,
            depthWrite: false,
            vertex: `
                precision highp float;
                attribute vec3 position;
                attribute vec2 uv;
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                uniform float uTime;
                uniform float uSpeed;
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    vec3 p = position;
                    p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                }
            `,
            fragment: `
                precision highp float;
                uniform vec2 uImageSizes;
                uniform vec2 uPlaneSizes;
                uniform sampler2D tMap;
                uniform float uBorderRadius;
                uniform float uBrightness;
                uniform float uContrast;
                varying vec2 vUv;

                float roundedBoxSDF(vec2 p, vec2 b, float r) {
                    vec2 d = abs(p) - b;
                    return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
                }

                void main() {
                    vec2 ratio = vec2(
                        min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
                        min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
                    );
                    vec2 uv = vec2(
                        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
                    );
                    vec4 color = texture2D(tMap, uv);

                    float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
                    if (d > 0.0) {
                        discard;
                    }

                    // Matte, low-glare look, computed here in the shader
                    // (not a CSS filter): dim overall exposure, then pull
                    // values toward mid-gray to soften/roll off the
                    // brightest highlights without touching hue.
                    vec3 rgb = color.rgb * uBrightness;
                    rgb = (rgb - 0.5) * uContrast + 0.5;
                    rgb = clamp(rgb, 0.0, 1.0);

                    gl_FragColor = vec4(rgb, 1.0);
                }
            `,
            uniforms: {
                tMap: { value: texture },
                uPlaneSizes: { value: [0, 0] },
                uImageSizes: { value: [0, 0] },
                uSpeed: { value: 0 },
                uTime: { value: 100 * Math.random() },
                uBrightness: { value: this.brightness },
                uContrast: { value: this.contrast },
                uBorderRadius: { value: this.borderRadius },
            },
            transparent: true,
        });

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = this.image;
        img.onload = () => {
            texture.image = img;
            this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
        };
    }

    createMesh() {
        this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
        this.plane.setParent(this.scene);
    }

    update(scroll: { current: number; last: number }, direction: "right" | "left") {
        this.plane.position.x = this.x - scroll.current - this.extra;

        const x = this.plane.position.x;
        const H = this.viewport.width / 2;

        if (this.bend === 0) {
            this.plane.position.y = 0;
            this.plane.rotation.z = 0;
        } else {
            const bAbs = Math.abs(this.bend);
            const R = (H * H + bAbs * bAbs) / (2 * bAbs);
            const effectiveX = Math.min(Math.abs(x), H);
            const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
            if (this.bend > 0) {
                this.plane.position.y = -arc;
                this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
            } else {
                this.plane.position.y = arc;
                this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
            }
        }

        this.speed = scroll.current - scroll.last;
        this.program.uniforms.uTime.value += 0.04;
        this.program.uniforms.uSpeed.value = this.speed;

        const planeOffset = this.plane.scale.x / 2;
        const viewportOffset = this.viewport.width / 2;
        this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
        this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
        if (direction === "right" && this.isBefore) {
            this.extra -= this.widthTotal;
            this.isBefore = this.isAfter = false;
        }
        if (direction === "left" && this.isAfter) {
            this.extra += this.widthTotal;
            this.isBefore = this.isAfter = false;
        }
    }

    onResize(opts: { screen?: ScreenSize; viewport?: Viewport } = {}) {
        if (opts.screen) this.screen = opts.screen;
        if (opts.viewport) this.viewport = opts.viewport;

        this.scale = this.screen.height / 1500;
        this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
        this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
        this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
        this.padding = 2;
        this.width = this.plane.scale.x + this.padding;
        this.widthTotal = this.width * this.length;
        this.x = this.width * this.index;
    }
}

interface GalleryAppOptions {
    images: string[];
    bend: number;
    borderRadius: number;
    brightness: number;
    contrast: number;
}

// Ported from Inspira UI's "Bending Gallery" (https://inspira-ui.com), whose
// reference implementation is Vue-only, built on the `ogl` WebGL library.
// This keeps the exact same bend/rounded-corner shaders, infinite-wrap
// scroll math, and easing — ported to plain TS driven from a React
// `useEffect` instead of Vue lifecycle hooks. Two deliberate adaptations for
// embedding in a page section rather than a full-viewport demo:
//   - the per-image text caption feature is dropped (not needed here, and
//     avoids introducing new on-canvas text/colors);
//   - drag/wheel listeners are scoped to this component's own container
//     instead of `window`, so the gallery doesn't hijack scrolling or
//     clicks anywhere else on the page.
class GalleryApp {
    container: HTMLElement;
    scroll: { ease: number; current: number; target: number; last: number; position?: number };
    renderer!: Renderer;
    gl!: GL;
    camera!: Camera;
    scene!: Transform;
    planeGeometry!: Plane;
    medias: Media[] = [];
    images: string[] = [];
    screen!: ScreenSize;
    viewport!: Viewport;
    raf = 0;
    isDown = false;
    start = 0;
    isHovering = false;
    autoScrollEnabled: boolean;

    private boundOnResize = () => this.onResize();
    private boundOnWheel = (e: WheelEvent) => this.onWheel(e);
    private boundOnPointerDown = (e: MouseEvent | TouchEvent) => this.onPointerDown(e);
    private boundOnPointerMove = (e: MouseEvent | TouchEvent) => this.onPointerMove(e);
    private boundOnPointerUp = () => this.onPointerUp();
    private boundOnPointerEnter = () => {
        this.isHovering = true;
    };
    private boundOnPointerLeave = () => {
        this.isHovering = false;
    };

    constructor(
        container: HTMLElement,
        { images, bend, borderRadius, brightness, contrast }: GalleryAppOptions
    ) {
        this.container = container;
        this.scroll = { ease: 0.05, current: 0, target: 0, last: 0 };
        // Respect reduced-motion preferences, same as the rest of this site.
        this.autoScrollEnabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.onResize();
        this.createGeometry();
        this.createMedias(images, bend, borderRadius, brightness, contrast);
        this.update();
        this.addEventListeners();
    }

    createRenderer() {
        this.renderer = new Renderer({ alpha: true });
        this.gl = this.renderer.gl;
        this.gl.clearColor(0, 0, 0, 0);
        this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
    }

    createCamera() {
        this.camera = new Camera(this.gl);
        this.camera.fov = 45;
        this.camera.position.z = 20;
    }

    createScene() {
        this.scene = new Transform();
    }

    createGeometry() {
        this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 });
    }

    createMedias(
        images: string[],
        bend: number,
        borderRadius: number,
        brightness: number,
        contrast: number
    ) {
        // Duplicated once so the ribbon can wrap seamlessly.
        this.images = images.concat(images);
        this.medias = this.images.map(
            (image, index) =>
                new Media({
                    geometry: this.planeGeometry,
                    gl: this.gl,
                    image,
                    index,
                    length: this.images.length,
                    scene: this.scene,
                    screen: this.screen,
                    viewport: this.viewport,
                    bend,
                    borderRadius,
                    brightness,
                    contrast,
                })
        );
    }

    onPointerDown(e: MouseEvent | TouchEvent) {
        this.isDown = true;
        this.scroll.position = this.scroll.current;
        this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
    }

    onPointerMove(e: MouseEvent | TouchEvent) {
        if (!this.isDown) return;
        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        const distance = (this.start - x) * 0.05;
        this.scroll.target = (this.scroll.position ?? 0) + distance;
    }

    onPointerUp() {
        this.isDown = false;
        this.onCheck();
    }

    onWheel(e: WheelEvent) {
        e.preventDefault();
        this.scroll.target += Math.sign(e.deltaY) * 2;
    }

    onCheck() {
        if (!this.medias[0]) return;
        const width = this.medias[0].width;
        const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
        const item = width * itemIndex;
        this.scroll.target = this.scroll.target < 0 ? -item : item;
    }

    onResize() {
        this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
        this.renderer.setSize(this.screen.width, this.screen.height);
        this.camera.perspective({ aspect: this.screen.width / this.screen.height });
        const fov = (this.camera.fov * Math.PI) / 180;
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
        const width = height * this.camera.aspect;
        this.viewport = { width, height };
        this.medias?.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }

    update() {
        // Gentle idle drift: only while nothing else is driving the scroll
        // (not dragging, not hovered). Runs on both desktop and mobile, at
        // a slower speed on mobile. Because this only ever nudges
        // `scroll.target`, the existing lerp below does all the smoothing —
        // starting and stopping this is just as smooth as every other
        // scroll input already is.
        if (this.autoScrollEnabled && !this.isDown && !this.isHovering) {
            const speed =
                this.screen.width >= AUTO_SCROLL_MIN_SCREEN_WIDTH
                    ? AUTO_SCROLL_SPEED_DESKTOP
                    : AUTO_SCROLL_SPEED_MOBILE;
            this.scroll.target += speed;
        }

        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
        const direction = this.scroll.current > this.scroll.last ? "right" : "left";
        this.medias.forEach((media) => media.update(this.scroll, direction));
        this.renderer.render({ scene: this.scene, camera: this.camera });
        this.scroll.last = this.scroll.current;
        this.raf = window.requestAnimationFrame(() => this.update());
    }

    addEventListeners() {
        window.addEventListener("resize", this.boundOnResize);
        this.container.addEventListener("wheel", this.boundOnWheel, { passive: false });
        this.container.addEventListener("mousedown", this.boundOnPointerDown);
        this.container.addEventListener("touchstart", this.boundOnPointerDown);
        this.container.addEventListener("mouseenter", this.boundOnPointerEnter);
        this.container.addEventListener("mouseleave", this.boundOnPointerLeave);
        window.addEventListener("mousemove", this.boundOnPointerMove);
        window.addEventListener("touchmove", this.boundOnPointerMove);
        window.addEventListener("mouseup", this.boundOnPointerUp);
        window.addEventListener("touchend", this.boundOnPointerUp);
    }

    destroy() {
        window.cancelAnimationFrame(this.raf);
        window.removeEventListener("resize", this.boundOnResize);
        this.container.removeEventListener("wheel", this.boundOnWheel);
        this.container.removeEventListener("mousedown", this.boundOnPointerDown);
        this.container.removeEventListener("touchstart", this.boundOnPointerDown);
        this.container.removeEventListener("mouseenter", this.boundOnPointerEnter);
        this.container.removeEventListener("mouseleave", this.boundOnPointerLeave);
        window.removeEventListener("mousemove", this.boundOnPointerMove);
        window.removeEventListener("touchmove", this.boundOnPointerMove);
        window.removeEventListener("mouseup", this.boundOnPointerUp);
        window.removeEventListener("touchend", this.boundOnPointerUp);
        if (this.renderer.gl.canvas.parentNode) {
            this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas as HTMLCanvasElement);
        }
    }
}

export function BendingGallery({
    images,
    bend = 3,
    borderRadius = 0.04,
    brightness = 0.82,
    contrast = 0.88,
    className,
}: BendingGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || images.length === 0) return;

        const app = new GalleryApp(container, { images, bend, borderRadius, brightness, contrast });
        return () => app.destroy();
    }, [images, bend, borderRadius, brightness, contrast]);

    return (
        <div
            ref={containerRef}
            className={className ?? "h-full w-full cursor-grab overflow-hidden touch-none active:cursor-grabbing"}
        />
    );
}
