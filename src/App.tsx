import { ArrowUpRight, Instagram, Linkedin } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import AirlockHero from "@/components/ui/airlock-spaceship-hero";
import GhostFibers from "@/components/ui/ghost-fibers";
import PolaroidLineCarousel from "@/components/ui/polaroid-line-carousel";

const upcomingEvents = [
  { date: "08 NOV", title: "Startup Weekend", detail: "48 hours to build your idea" },
  { date: "22 NOV", title: "Founder Files", detail: "An evening with builders" },
  { date: "06 DEC", title: "Pitch Perfect", detail: "Present. Get feedback. Grow." },
];

const pastEvents = [
  { date: "18—20 OCT 2024", title: "E-Summit 2024", type: "Summit", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80", caption: "Three days of ideas, pitches, and ambitious builders." },
  { date: "07 SEP 2024", title: "Ideathon", type: "Competition", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1000&q=80", caption: "A room full of problems worth solving." },
  { date: "14 AUG 2024", title: "Design thinking lab", type: "Workshop", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80", caption: "From first questions to better possibilities." },
  { date: "2024", title: "Hackawar", type: "Hackathon", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80", caption: "Build fast, solve boldly, and turn ideas into prototypes." },
  { date: "2024", title: "Idearise", type: "Innovation", image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80", caption: "A space for ambitious ideas to take shape." },
  { date: "2024", title: "IPL Auction", type: "Simulation", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80", video: "/assets/events/ipl-auction.mp4", caption: "Strategy, teamwork, and high-stakes decisions." },
  { date: "2024", title: "Goal for a Cause", type: "Social impact", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80", video: "/assets/events/goal-for-a-cause.mp4", caption: "Ideas and action coming together for a meaningful cause." },
];

const team = [
  { name: "EDC Member 01", role: "Core team", image: "/assets/team/member-01.jpeg" },
  { name: "EDC Member 02", role: "Core team", image: "/assets/team/member-02.jpeg" },
  { name: "EDC Member 03", role: "Core team", image: "/assets/team/member-03.jpeg" },
  { name: "EDC Member 04", role: "Core team", image: "/assets/team/member-04.jpeg" },
  { name: "EDC Member 05", role: "Core team", image: "/assets/team/member-05.jpeg" },
  { name: "EDC Member 06", role: "Core team", image: "/assets/team/member-06.jpeg" },
];

function Header() {
  const links = [["Home", "/"], ["Events", "/events"], ["Team", "/team"], ["Resources", "/resources"], ["Contact", "/contact"]];
  return <header className="fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-7 md:px-12">
    <Link to="/" aria-label="ECELL home"><img src="/assets/ecell-logo.png" alt="ECELL" className="h-auto w-32 brightness-0 invert sm:w-40" /></Link>
    <nav aria-label="Main navigation" className="rounded-full border border-white/30 bg-black/35 px-3 py-2 backdrop-blur-md sm:px-5 sm:py-3">
      <div className="flex items-center gap-3 sm:gap-5 md:gap-8">{links.map(([label, href]) => <Link key={href} to={href} className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/80 transition-colors hover:text-white sm:text-xs">{label}</Link>)}</div>
    </nav>
  </header>;
}

function Footer() {
  return <footer className="border-t border-cream/20 px-5 py-8 sm:px-8 md:px-12"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><img src="/assets/ecell-logo.png" alt="ECELL" className="h-auto w-40 brightness-0 invert" /><p className="eyebrow mt-4 text-cream/50">EDC · Ideas start here.</p></div><div className="flex items-center gap-5 text-cream/60"><Link to="/">Home</Link><Link to="/events">Events</Link><Link to="/team">Team</Link><Instagram size={18} /><Linkedin size={18} /></div></div><p className="eyebrow mt-12 text-cream/30">© 2024 EDC</p></footer>;
}

function PageIntro({ number, eyebrow, title, children }: { number: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return <section className="page-intro px-5 pb-20 pt-40 sm:px-8 md:px-12 md:pb-28"><p className="eyebrow page-intro__eyebrow text-cream/50">{number} / {eyebrow}</p><h1 className="page-intro__title mt-8 max-w-5xl text-6xl leading-[0.88] tracking-[-0.08em] text-cream sm:text-8xl md:text-[10rem]">{title}</h1>{children}<span className="page-intro__orb" aria-hidden="true" /></section>;
}

function EventsPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const stopBeforeEnd = () => {
      if (video.duration && video.currentTime >= video.duration - 3) {
        video.pause();
        video.currentTime = 0;
        void video.play();
      }
    };

    video.addEventListener("timeupdate", stopBeforeEnd);
    return () => video.removeEventListener("timeupdate", stopBeforeEnd);
  }, []);

  return <><section className="relative isolate min-h-[82vh] overflow-hidden bg-ink px-5 pb-24 pt-40 sm:px-8 md:px-12 md:pb-32"><video ref={videoRef} autoPlay muted loop playsInline src="/assets/events-background.mp4" className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale" /><div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/90" /><div className="relative z-10 max-w-2xl"><p className="eyebrow text-cream/60">01 / Learn by doing</p><h1 className="mt-5 max-w-xl text-4xl leading-[0.9] tracking-[-0.07em] text-cream sm:text-6xl md:text-7xl">Events that turn ideas into momentum.</h1></div></section><section className="dots-pattern bg-white px-5 py-20 text-ink sm:px-8 md:px-12 md:py-28"><h2 className="mb-8 text-4xl tracking-[-0.07em]">Upcoming events</h2><div className="divide-y divide-ink/25 border-t border-ink/25">{upcomingEvents.map((event) => <article key={event.title} className="grid grid-cols-12 items-center gap-4 py-6"><p className="eyebrow col-span-3 sm:col-span-2">{event.date}</p><h3 className="col-span-7 text-2xl tracking-[-0.05em] sm:col-span-5 sm:text-4xl">{event.title}</h3><p className="col-span-12 text-sm text-ink/60 sm:col-span-4">{event.detail}</p><ArrowUpRight className="col-span-1 justify-self-end" /></article>)}</div><h2 className="mb-8 mt-24 text-4xl tracking-[-0.07em]">Past events</h2><div className="grid gap-10 md:grid-cols-3">{pastEvents.map((event) => <article key={event.title} className="group"><div className="mb-4 aspect-[4/5] overflow-hidden">{event.video ? <video src={event.video} autoPlay muted loop playsInline preload="metadata" aria-label={event.title} className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /> : <img src={event.image} alt={event.title} className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />}</div><div className="flex justify-between border-b border-ink/30 pb-3 text-sm"><span>{event.title}</span><span className="eyebrow">{event.type}</span></div><p className="eyebrow mt-3 text-ink/60">{event.date}</p></article>)}</div></section></>;
}

function TeamPage() {
  return <><PageIntro number="02" eyebrow="People behind EDC" title="The people making it happen." /><section className="page-section px-5 pb-28 sm:px-8 md:px-12"><div className="page-stats mb-16 grid grid-cols-3 border-y border-cream/20 py-5"><div><strong>06</strong><span>Core members</span></div><div><strong>05</strong><span>Working teams</span></div><div><strong>∞</strong><span>Big ideas</span></div></div><p className="page-section__lead mb-12 max-w-xl text-lg text-cream/65">A team of doers, dreamers, and problem-solvers building the ecosystem we wished we had.</p><div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">{team.map((member, index) => <article key={member.name} className="team-card" style={{ "--card-delay": `${index * 90}ms` } as React.CSSProperties}><div className="team-card__image aspect-square overflow-hidden bg-cream/10"><img src={member.image} alt={member.name} className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 hover:grayscale-0" /></div><div className="flex items-center justify-between border-b border-cream/20 pb-3 pt-4"><h3 className="text-xl text-cream">{member.name}</h3><ArrowUpRight size={18} className="team-card__arrow text-cream/50" /></div><p className="eyebrow mt-2 text-cream/50">{member.role}</p></article>)}</div><div className="collective-line mt-20 border-t border-cream/20 pt-6"><p className="eyebrow text-cream/50">Our wider collective</p><p className="mt-4 text-3xl tracking-[-0.05em] text-cream">Marketing · Design · Finance · Partnerships · Community</p></div></section></>;
}

function ResourcesPage() {
  const resources = ["How to find your first customer", "A founder’s guide to asking better questions", "5 books that changed how we build", "A practical guide to your first pitch", "What to do when the idea is still rough"];
  return <><PageIntro number="03" eyebrow="Keep exploring" title="A library for the next big idea." /><section className="dots-pattern resources-panel bg-white px-5 py-20 text-ink sm:px-8 md:px-12 md:py-28"><div className="mb-12 flex items-end justify-between border-b border-ink/20 pb-5"><p className="max-w-md text-lg text-ink/60">Notes, tools, and questions for the people building their first thing.</p><span className="eyebrow text-ink/50">05 / Field notes</span></div>{resources.map((title, index) => <a href="#contact" key={title} className="resource-row group flex items-center justify-between border-b border-ink/20 py-7"><div><p className="eyebrow mb-3 text-ink/50">0{index + 1} / Journal</p><h2 className="text-2xl tracking-[-0.05em] sm:text-4xl">{title}</h2></div><ArrowUpRight className="resource-row__arrow transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>)}</section></>;
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`New idea from ${data.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nUSN: ${data.get("usn")}\nPhone: ${data.get("phone")}\n\nIdea:\n${data.get("idea")}`,
    );
    window.location.href = `mailto:edc@college.edu?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return <><PageIntro number="04" eyebrow="Have an idea?" title="Start something meaningful." /><section className="dots-pattern bg-white px-5 py-20 text-ink sm:px-8 md:px-12 md:py-28"><div className="grid grid-cols-12 gap-12"><div className="col-span-12 md:col-span-4"><p className="eyebrow text-ink/50">Tell us your idea</p><p className="mt-6 max-w-sm text-lg leading-tight text-ink/65">Have something worth building? Give us the first version. We&apos;ll help you take it further.</p><a href="mailto:edc@college.edu" className="mt-10 inline-flex items-center gap-2 border-b border-ink pb-2 text-lg">edc@college.edu <ArrowUpRight size={18} /></a></div><form onSubmit={handleSubmit} className="col-span-12 md:col-span-7 md:col-start-6"><div className="grid gap-8 sm:grid-cols-2"><label className="flex flex-col gap-2"><span className="eyebrow text-ink/50">Your name</span><input required name="name" type="text" placeholder="Enter your name" className="border-b border-ink/30 bg-transparent px-0 py-3 text-lg outline-none placeholder:text-ink/30 focus:border-ink" /></label><label className="flex flex-col gap-2"><span className="eyebrow text-ink/50">USN</span><input required name="usn" type="text" placeholder="Enter your USN" className="border-b border-ink/30 bg-transparent px-0 py-3 text-lg uppercase outline-none placeholder:text-ink/30 focus:border-ink" /></label></div><label className="mt-8 flex flex-col gap-2"><span className="eyebrow text-ink/50">Phone number</span><input required name="phone" type="tel" inputMode="tel" pattern="[0-9+() -]{7,}" placeholder="Enter your phone number" className="border-b border-ink/30 bg-transparent px-0 py-3 text-lg outline-none placeholder:text-ink/30 focus:border-ink" /></label><label className="mt-8 flex flex-col gap-2"><span className="eyebrow text-ink/50">Your idea</span><textarea required name="idea" rows={5} placeholder="Tell us what you want to create..." className="resize-y border-b border-ink/30 bg-transparent px-0 py-3 text-lg outline-none placeholder:text-ink/30 focus:border-ink" /></label><div className="mt-10 flex flex-wrap items-center gap-5"><button type="submit" className="inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-transform hover:scale-[1.03]">Send your idea <ArrowUpRight size={18} /></button>{submitted && <p className="text-sm text-ink/60">Your email app should open with the message ready to send.</p>}</div></form></div></section></>;
}

function HomePage() {
  const faqs = [
    ["Who can join EDC?", "Every student with curiosity, energy, or an idea is welcome. You do not need a company or a business background to get started."],
    ["Do I need a startup idea?", "Not at all. Our events and workshops are designed to help you find, test, and shape the right problem to solve."],
    ["How can I collaborate with EDC?", "Reach out through our contact page. We are open to mentors, partners, speakers, and student-led collaborations."],
  ];

  return <>
    <AirlockHero title="ESB-319" tagline="SOMETHING IS HAPPENING" finalLine="Ideas that move beyond the ordinary." />

    <section id="vision" className="px-5 py-24 sm:px-8 md:px-12 md:py-36">
      <div className="grid grid-cols-12 gap-8">
        <p className="eyebrow col-span-12 text-cream/50 md:col-span-3">01 / Vision & mission</p>
        <h2 className="col-span-12 max-w-5xl text-4xl leading-[0.95] tracking-[-0.06em] text-cream sm:text-6xl md:col-span-9 md:text-8xl">We turn <span className="text-white">curiosity</span> into ventures that shape tomorrow.</h2>
      </div>
      <p className="mt-20 max-w-xl border-t border-cream/20 pt-6 text-lg leading-tight text-cream/70">EDC is the launchpad for student entrepreneurs. We connect people to mentors, resources, and a community that makes ambitious ideas feel possible.</p>
    </section>

    <section id="what-we-do" className="dots-pattern bg-white px-5 py-20 text-ink sm:px-8 md:px-12 md:py-28">
      <div className="grid grid-cols-12 gap-8">
        <p className="eyebrow col-span-12 text-ink/50 md:col-span-3">02 / What we do</p>
        <div className="col-span-12 md:col-span-9">
          <h2 className="max-w-4xl text-5xl leading-[0.9] tracking-[-0.07em] sm:text-7xl">A launchpad for people who refuse to wait.</h2>
          <div className="mt-16 grid gap-8 border-t border-ink/20 pt-6 sm:grid-cols-3">
            {["Build", "Connect", "Launch"].map((item, index) => <article key={item}><p className="eyebrow text-ink/50">0{index + 1}</p><h3 className="mt-8 text-3xl tracking-[-0.06em]">{item}</h3><p className="mt-4 text-sm leading-relaxed text-ink/65">{["Turn observations into ideas and ideas into experiments.", "Meet mentors, founders, collaborators, and your next co-founder.", "Take your work from a first pitch to a real-world opportunity."][index]}</p></article>)}
          </div>
        </div>
      </div>
    </section>

    <section id="past-events" className="px-5 py-24 sm:px-8 md:px-12 md:py-32">
      <div className="mb-12 flex items-end justify-between border-b border-cream/20 pb-5"><h2 className="text-5xl tracking-[-0.07em] text-cream sm:text-7xl">Past events</h2><span className="eyebrow text-cream/50">03 / The archive</span></div>
      <PolaroidLineCarousel slides={pastEvents} className="mt-4" />
    </section>

    <section id="faqs" className="dots-pattern bg-white px-5 py-20 text-ink sm:px-8 md:px-12 md:py-28">
      <div className="grid grid-cols-12 gap-8"><p className="eyebrow col-span-12 text-ink/50 md:col-span-3">04 / FAQs</p><div className="col-span-12 md:col-span-9"><h2 className="mb-12 text-5xl tracking-[-0.07em] sm:text-7xl">Questions, answered.</h2>{faqs.map(([question, answer]) => <details key={question} className="group border-t border-ink/20 py-6"><summary className="flex cursor-pointer list-none items-center justify-between text-xl tracking-[-0.04em] sm:text-2xl">{question}<span className="text-2xl transition-transform group-open:rotate-45">+</span></summary><p className="max-w-xl pt-4 text-sm leading-relaxed text-ink/65">{answer}</p></details>)}</div></div>
    </section>

    <section id="cta" className="px-5 py-24 sm:px-8 md:px-12 md:py-36">
      <div className="grid grid-cols-12 gap-8"><p className="eyebrow col-span-12 text-cream/50 md:col-span-3">05 / Have an idea?</p><div className="col-span-12 md:col-span-9"><h2 className="max-w-5xl text-5xl leading-[0.9] tracking-[-0.07em] text-cream sm:text-7xl md:text-9xl">Make it <span className="text-white">real.</span></h2><Link to="/contact" className="mt-12 inline-flex items-center gap-2 border-b border-white pb-2 text-lg text-white">Tell us about it <ArrowUpRight size={18} /></Link></div></div>
    </section>

    <section id="contact" className="dots-pattern bg-white px-5 py-20 text-ink sm:px-8 md:px-12 md:py-28">
      <div className="grid grid-cols-12 gap-8"><p className="eyebrow col-span-12 text-ink/50 md:col-span-3">06 / Contact</p><div className="col-span-12 md:col-span-9"><h2 className="max-w-4xl text-5xl leading-[0.9] tracking-[-0.07em] sm:text-7xl">Let&apos;s build the next chapter together.</h2><a href="mailto:edc@college.edu" className="mt-12 inline-flex items-center gap-2 border-b border-ink pb-2 text-lg">edc@college.edu <ArrowUpRight size={18} /></a></div></div>
    </section>
  </>;
}

function App() {
  return <BrowserRouter><div className="site-fibers" aria-hidden="true"><GhostFibers glowColor="#063bef" lineColor="#9bb8ff" secondaryColor="#1431c0" layers={3} twist={1.2} waves={1.2} threads={72} fiberStyle="dots" depthOfField={0.85} hoverEffect="focus" intro mouseInteraction dpr={2} brightness={1.4} glow={1.1} /></div><Header /><main className="site-content overflow-hidden"><Routes><Route path="/" element={<HomePage />} /><Route path="/events" element={<EventsPage />} /><Route path="/team" element={<TeamPage />} /><Route path="/resources" element={<ResourcesPage />} /><Route path="/contact" element={<ContactPage />} /></Routes><Footer /></main></BrowserRouter>;
}

export default App;
