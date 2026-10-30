import { useEffect, useRef, useState } from "react";

export type PolaroidSlide = {
  image: string;
  title: string;
  caption?: string;
  alt?: string;
};

type PolaroidLineCarouselProps = {
  slides: PolaroidSlide[];
  className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function PolaroidLineCarousel({ slides, className = "" }: PolaroidLineCarouselProps) {
  const [active, setActive] = useState(0);
  const [offset, setOffset] = useState(0);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    setOffset(active);
  }, [active]);

  if (!slides.length) return null;

  const select = (index: number) => {
    const next = clamp(index, 0, slides.length - 1);
    setActive(next);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const distance = event.clientX - startX.current;
    startX.current = null;
    if (Math.abs(distance) > 40) select(active + (distance < 0 ? 1 : -1));
  };

  return (
    <div
      className={`polaroid-carousel ${className}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { startX.current = null; }}
      role="region"
      aria-label="Past events gallery"
    >
      <style>{`
        .polaroid-carousel { position: relative; min-height: 34rem; overflow: hidden; color: #161513; background: #e9e4dc; user-select: none; touch-action: pan-y; }
        .polaroid-carousel::before { content: ""; position: absolute; left: 0; right: 0; top: 19%; height: 2px; background: rgba(91, 77, 61, .38); transform: rotate(-1deg); }
        .polaroid-track { position: absolute; inset: 0; }
        .polaroid-card { position: absolute; top: 22%; left: 50%; width: min(68vw, 18rem); padding: .7rem .7rem 0; background: #fbfaf7; box-shadow: 0 1px 2px rgba(0,0,0,.15), 0 20px 34px -18px rgba(0,0,0,.55); transform-origin: 50% 0; transition: transform .6s cubic-bezier(.2,.8,.2,1), opacity .45s ease, filter .45s ease; }
        .polaroid-card[data-active="false"] { filter: saturate(.55) brightness(.92); opacity: .7; }
        .polaroid-photo { aspect-ratio: 1 / 1.08; overflow: hidden; background: #d9d5cc; }
        .polaroid-photo img { width: 100%; height: 100%; display: block; object-fit: cover; }
        .polaroid-title { height: 4.2rem; display: flex; align-items: center; justify-content: center; padding: 0 .4rem; overflow: hidden; text-align: center; font: italic 400 1rem/1.1 Georgia, serif; }
        .polaroid-peg { position: absolute; left: 50%; top: -1.05rem; width: .65rem; height: 1.6rem; border-radius: .15rem; background: linear-gradient(90deg, #b8915f, #e3c9a1 45%, #a67d4c); transform: translateX(-50%); }
        .polaroid-meta { position: absolute; left: 1.25rem; right: 1.25rem; bottom: 1.25rem; display: flex; align-items: end; justify-content: space-between; gap: 1rem; }
        .polaroid-caption { max-width: 22rem; font-size: .8rem; line-height: 1.35; color: rgba(22,21,19,.62); }
        .polaroid-count { font: .75rem/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .12em; white-space: nowrap; color: rgba(22,21,19,.62); }
        .polaroid-controls { position: absolute; right: 1.25rem; top: 1.25rem; display: flex; gap: .5rem; }
        .polaroid-button { width: 2.4rem; height: 2.4rem; border: 1px solid rgba(22,21,19,.25); border-radius: 999px; background: transparent; color: inherit; cursor: pointer; }
        .polaroid-button:hover { background: #161513; color: #e9e4dc; }
        @media (min-width: 768px) { .polaroid-carousel { min-height: 42rem; } .polaroid-card { width: min(28vw, 20rem); } }
      `}</style>
      <div className="polaroid-track">
        {slides.map((slide, index) => {
          const distance = index - offset;
          const rotation = distance * 5;
          const x = distance * 72;
          return (
            <article
              key={slide.title}
              className="polaroid-card"
              data-active={index === active}
              style={{
                transform: `translateX(calc(-50% + ${x}vw)) rotate(${rotation}deg) scale(${index === active ? 1 : .86})`,
                zIndex: slides.length - Math.abs(distance),
              }}
              aria-hidden={index === active ? undefined : true}
            >
              <span className="polaroid-peg" />
              <div className="polaroid-photo"><img src={slide.image} alt={slide.alt ?? slide.title} draggable={false} /></div>
              <div className="polaroid-title">{slide.title}</div>
            </article>
          );
        })}
      </div>
      <div className="polaroid-controls">
        <button type="button" className="polaroid-button" aria-label="Previous event" onClick={() => select(active - 1)}>←</button>
        <button type="button" className="polaroid-button" aria-label="Next event" onClick={() => select(active + 1)}>→</button>
      </div>
      <div className="polaroid-meta">
        <p className="polaroid-caption">{slides[active].caption}</p>
        <span className="polaroid-count">{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
