import "./polaroid-line-carousel.css";

export type PolaroidSlide = {
  image: string;
  title: string;
  caption?: string;
};

type PolaroidLineCarouselProps = {
  slides: PolaroidSlide[];
  className?: string;
};

export default function PolaroidLineCarousel({ slides, className = "" }: PolaroidLineCarouselProps) {
  const loopedSlides = [...slides, ...slides];

  return (
    <div className={`polaroid-marquee ${className}`} aria-label="Past events">
      <div className="polaroid-marquee__track">
        {loopedSlides.map((slide, index) => (
          <article className="polaroid-marquee__card" key={`${slide.title}-${index}`}>
            <div className="polaroid-marquee__photo">
              <img src={slide.image} alt={slide.title} loading="lazy" draggable={false} />
            </div>
            <p className="polaroid-marquee__title">{slide.title}</p>
            {slide.caption && <p className="polaroid-marquee__caption">{slide.caption}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
