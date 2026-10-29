import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

interface WordsPullUpProps {
  text: string;
  className?: string;
}

export const WordsPullUp = ({ text, className = "" }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {text.split(" ").map((word, index, words) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block"
          style={{ marginRight: index === words.length - 1 ? 0 : "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Events", href: "#events" },
  { label: "Team", href: "#team" },
  { label: "Resources", href: "#resources" },
];

export const EDCHero = () => (
  <section id="home" className="h-screen min-h-[650px] w-full">
    <div className="relative h-full w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
      />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/80" />
      <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-b-2xl bg-ink px-4 py-2 sm:gap-6 md:gap-10 md:rounded-b-3xl md:px-8 lg:gap-14">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="whitespace-nowrap text-[10px] text-cream/70 transition-colors hover:text-white sm:text-xs md:text-sm">
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      <div className="absolute left-5 top-6 z-10 text-cream sm:left-8 sm:top-8 md:left-12">
        <img src="/assets/ecell-logo.png" alt="ECELL" className="h-auto w-36 brightness-0 invert sm:w-44" />
        <p className="eyebrow mt-3 text-cream/60">EDC</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 sm:px-8 md:px-12 md:pb-10">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="eyebrow mb-4 text-cream/70">Build boldly / Grow together</p>
            <h1 className="font-display text-[25vw] font-medium leading-[0.8] tracking-[-0.1em] text-cream sm:text-[20vw] md:text-[17vw] lg:text-[15vw]">
              <WordsPullUp text="EDC" />
            </h1>
          </div>
          <div className="col-span-12 flex flex-col gap-5 pb-1 lg:col-span-4 lg:pb-3">
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="max-w-md text-sm leading-tight text-cream/75 sm:text-base">
              We are a student-led community turning ideas into action through mentorship, events, and the courage to start.
            </motion.p>
            <a href="#contact" className="group inline-flex w-fit items-center gap-3 rounded-full bg-white py-1 pl-5 pr-1 text-sm font-medium text-ink transition-all hover:gap-4 sm:text-base">
              Join the movement
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink transition-transform group-hover:scale-110 sm:h-10 sm:w-10"><ArrowRight className="h-4 w-4 text-cream" /></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
