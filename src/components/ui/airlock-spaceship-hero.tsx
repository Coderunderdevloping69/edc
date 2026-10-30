import { useEffect, useRef, useState } from "react";

type AirlockHeroProps = {
  videoSrc?: string;
  posterSrc?: string;
  title?: string;
  tagline?: string;
  finalLine?: string;
  scrubDistance?: number;
  holdDistance?: number;
};

const DEFAULT_VIDEO = "/assets/airlock-hero.mp4";
const DEFAULT_POSTER = "/assets/airlock-hero-poster.jpg";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function AirlockHero({
  videoSrc = DEFAULT_VIDEO,
  posterSrc = DEFAULT_POSTER,
  title = "EDC",
  tagline = "Ideas that move beyond the ordinary.",
  finalLine = "Ideas that move beyond the ordinary.",
  scrubDistance = 3200,
  holdDistance = 1100,
}: AirlockHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const finalLineRef = useRef<HTMLParagraphElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const totalDistance = scrubDistance + holdDistance;
    let duration = 0;
    let target = 0;
    let shown = 0;
    let locked = false;
    let released = false;
    let lockedY = 0;
    let lastY = window.scrollY;
    let touchY = 0;
    let frame = 0;

    const paint = (progress: number) => {
      const videoProgress = clamp(progress / (scrubDistance / totalDistance), 0, 1);
      if (duration) video.currentTime = Math.min(videoProgress * duration, duration - 0.04);
      const openingOpacity = 1 - clamp(videoProgress / 0.35, 0, 1);
      const finalOpacity = clamp((videoProgress - 0.82) / 0.18, 0, 1);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(openingOpacity);
        titleRef.current.style.transform = `translateY(${(1 - openingOpacity) * -24}px) scale(${0.96 + openingOpacity * 0.04})`;
        titleRef.current.style.filter = `blur(${(1 - openingOpacity) * 10}px)`;
      }
      if (taglineRef.current) {
        taglineRef.current.style.opacity = String(openingOpacity);
        taglineRef.current.style.transform = `translate(-50%, calc(5rem + ${(1 - openingOpacity) * -16}px))`;
        taglineRef.current.style.filter = `blur(${(1 - openingOpacity) * 8}px)`;
      }
      if (logoRef.current) {
        logoRef.current.style.opacity = String(finalOpacity);
        logoRef.current.style.transform = `translate(-50%, calc(-50% - 8rem + ${(1 - finalOpacity) * 20}px)) scale(${0.96 + finalOpacity * 0.04})`;
      }
      if (finalLineRef.current) {
        finalLineRef.current.style.opacity = String(finalOpacity);
        finalLineRef.current.style.transform = `translate(-50%, calc(-50% + 5rem + ${(1 - finalOpacity) * 20}px))`;
        finalLineRef.current.style.filter = `blur(${(1 - finalOpacity) * 8}px)`;
      }
      if (hintRef.current) hintRef.current.style.opacity = progress > 0.001 ? "0" : "1";
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const engage = () => {
      if (locked) return;
      locked = true;
      released = false;
      lockedY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${lockedY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    };

    const release = () => {
      if (!locked) return;
      locked = false;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, lockedY);
      released = true;
      lastY = lockedY;
    };

    const consume = (delta: number) => {
      if (!locked) return false;
      if (target >= 1 && shown > 0.98 && delta > 0) {
        release();
        return false;
      }
      target = clamp(target + delta / totalDistance, 0, 1);
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (consume(event.deltaY)) event.preventDefault();
    };
    const onTouchStart = (event: TouchEvent) => { touchY = event.touches[0]?.clientY ?? 0; };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? touchY;
      if (consume(touchY - y)) event.preventDefault();
      touchY = y;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const steps: Record<string, number> = { ArrowDown: 140, ArrowUp: -140, PageDown: 700, PageUp: -700, " ": 700 };
      const step = steps[event.key];
      if (step !== undefined && consume(step)) event.preventDefault();
    };
    const onScroll = () => {
      if (locked || !released) return;
      const climbing = window.scrollY < lastY;
      lastY = window.scrollY;
      if (climbing && window.scrollY <= section.offsetTop) {
        target = shown = 1;
        paint(1);
        engage();
      }
    };
    const animate = () => {
      shown += (target - shown) * 0.18;
      paint(shown);
      frame = requestAnimationFrame(animate);
    };

    const onLoaded = () => {
      duration = video.duration || 0;
      video.pause();
      video.currentTime = 0;
      setReady(true);
      if (reducedMotion) {
        target = shown = 1;
        paint(1);
      }
    };

    const onMetadata = () => {
      duration = video.duration || 0;
      video.pause();
      video.currentTime = 0;
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("loadedmetadata", onMetadata);
    video.load();
    if (!reducedMotion) {
      if (window.scrollY <= section.offsetTop + 1) engage();
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("scroll", onScroll, { passive: true });
      frame = requestAnimationFrame(animate);
    }

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("loadedmetadata", onMetadata);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      release();
    };
  }, [holdDistance, scrubDistance]);

  return (
    <section ref={sectionRef} id="home" className="relative h-[100dvh] w-full overflow-hidden bg-[#05070d]">
      <img src={posterSrc} alt="" aria-hidden className="absolute inset-0 z-0 h-full w-full object-cover" />
      <video ref={videoRef} src={videoSrc} poster={posterSrc} muted playsInline preload="auto" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease" }} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,.4),transparent_35%,rgba(5,7,13,.6))]" />
      <h1 ref={titleRef} className="absolute inset-0 flex items-center justify-center px-6 text-center text-[clamp(3rem,12vw,10rem)] font-extrabold leading-none tracking-[-0.06em] text-white [text-shadow:0_4px_30px_rgba(0,0,0,.55)]">{title}</h1>
      <p ref={taglineRef} className="absolute left-1/2 top-1/2 w-full px-8 text-center text-[clamp(1.25rem,3.4vw,2.5rem)] font-bold leading-tight text-white opacity-0 [text-shadow:0_4px_24px_rgba(0,0,0,.6)]" style={{ transform: "translate(-50%, 5rem)" }}>{tagline}</p>
      <img ref={logoRef} src="/assets/ecell-logo.png" alt="ECELL" className="absolute left-1/2 top-1/2 h-auto w-52 brightness-0 invert opacity-0 sm:w-64" style={{ transform: "translate(-50%, -50%)", transition: "opacity 0.2s ease, transform 0.2s ease" }} />
      <p ref={finalLineRef} className="absolute left-1/2 top-1/2 w-full px-8 text-center text-[clamp(1rem,2vw,1.5rem)] font-semibold uppercase tracking-[0.12em] text-white opacity-0 [text-shadow:0_4px_24px_rgba(0,0,0,.6)]" style={{ transform: "translate(-50%, calc(-50% + 5rem))" }}>{finalLine}</p>
      <div ref={hintRef} className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold tracking-[.3em] text-white/75"><span>SCROLL</span><span className="animate-bounce text-lg">↓</span></div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/15"><div ref={barRef} className="h-full w-full origin-left bg-white/90" style={{ transform: "scaleX(0)" }} /></div>
    </section>
  );
}
