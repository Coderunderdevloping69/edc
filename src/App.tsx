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
  { date: "2024", title: "Hackawar", type: "Hackathon", image: "/assets/events/hackawar.jpeg", caption: "Build fast, solve boldly, and turn ideas into prototypes." },
  { date: "2024", title: "Prompt & Prototype", type: "Workshop", image: "/assets/events/prompt-and-prototype.jpeg", caption: "Turn a sharp prompt into a prototype worth testing." },
  { date: "2024", title: "IPL Auction", type: "Simulation", image: "/assets/events/ipl-auction.mp4", video: "/assets/events/ipl-auction.mp4", caption: "Strategy, teamwork, and high-stakes decisions." },
  { date: "2024", title: "Red Bull Basement", type: "Innovation", image: "/assets/events/redbull-basement.jpeg", caption: "A live stage for bold ideas and ambitious builders." },
  { date: "2024", title: "Goal for a Cause", type: "Social impact", image: "/assets/events/goal-for-a-cause.jpeg", caption: "Ideas and action coming together for a meaningful cause." },
  { date: "2024", title: "Orientation", type: "Community", image: "/assets/events/orientation.jpeg", caption: "Welcoming new builders into the EDC community." },
  { date: "2024", title: "Tuff Session", type: "Session", image: "/assets/events/tuff-session.jpeg", caption: "A focused session for learning, sharing, and building together." },
  { date: "2024", title: "Paytm", type: "Founder session", image: "/assets/events/paytm.jpeg", caption: "A room full of builders, questions, and entrepreneurial energy." },
];

const team = [
  { name: "Priya Gariya", role: "President · EM, Operations, PR & SP", image: "/assets/team/member-02.jpeg", linkedin: "https://www.linkedin.com/in/priya-gariya-76350a281/" },
  { name: "Siddharth Priyatam", role: "President · Upstarters & Finance", image: "/assets/team/president-02.jpg", linkedin: "https://www.linkedin.com/in/siddharth-priyatam-462632337/" },
  { name: "Saksham Jain", role: "Vice President · Social Media & Marketing", image: "/assets/team/member-04.jpeg", linkedin: "https://www.linkedin.com/in/saksham-jain-ab042327b/" },
  { name: "Hardik Bansal", role: "Head of Documentation", image: "/assets/team/member-06.jpeg", linkedin: "https://www.linkedin.com/in/hardikbansal06/" },
  { name: "Shashwath Prabhu", role: "Head of Design", image: "/assets/team/member-03.jpeg", linkedin: "https://www.linkedin.com/in/shashwath-prabhu-1b144827a" },
  { name: "Shivesh Tiwari", role: "Head of IT", image: "/assets/team/member-05.jpeg", linkedin: "https://www.linkedin.com/in/shivtiw/" },
  { name: "Rohit Jagri", role: "Head of Corporate & Publicity", image: "/assets/team/member-01.jpeg", linkedin: "https://www.linkedin.com/in/rohithjagri/" },
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
  return <footer className="border-t border-cream/20 px-5 py-8 sm:px-8 md:px-12"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><img src="/assets/ecell-logo.png" alt="ECELL" className="h-auto w-40 brightness-0 invert" /><p className="eyebrow mt-4 text-cream/50">EDC · Ideas start here.</p></div><div className="flex items-center gap-5 text-cream/60"><Link to="/">Home</Link><Link to="/events">Events</Link><Link to="/team">Team</Link><a href="https://www.instagram.com/ecell_ramaiah/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a><a href="https://www.linkedin.com/company/ecell-rit/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a></div></div><p className="eyebrow mt-12 text-cream/30">© 2024 EDC</p></footer>;
}

function PageIntro({ number, eyebrow, title, children, showOrb = true, className = "" }: { number: string; eyebrow: string; title: string; children?: React.ReactNode; showOrb?: boolean; className?: string }) {
  return <section className={`page-intro px-5 pb-20 pt-40 sm:px-8 md:px-12 md:pb-28 ${className}`}><p className="eyebrow page-intro__eyebrow text-cream/50">{number} / {eyebrow}</p><h1 className="page-intro__title mt-8 max-w-5xl text-6xl leading-[0.88] tracking-[-0.08em] text-cream sm:text-8xl md:text-[10rem]">{title}</h1>{children}{showOrb && <span className="page-intro__orb" aria-hidden="true" />}</section>;
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

  return <><section className="relative isolate min-h-[82vh] overflow-hidden bg-ink px-5 pb-24 pt-40 sm:px-8 md:px-12 md:pb-32"><video ref={videoRef} autoPlay muted loop playsInline src="/assets/events-background.mp4" className="absolute inset-0 h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/90" /><div className="relative z-10 max-w-2xl"><p className="eyebrow text-cream/60">01 / Learn by doing</p><h1 className="mt-5 max-w-xl text-4xl leading-[0.9] tracking-[-0.07em] text-cream sm:text-6xl md:text-7xl">Events that turn ideas into momentum.</h1></div></section><section className="dots-pattern bg-white px-5 py-20 text-ink sm:px-8 md:px-12 md:py-28"><h2 className="mb-8 text-4xl tracking-[-0.07em]">Upcoming events</h2><div className="divide-y divide-ink/25 border-t border-ink/25">{upcomingEvents.map((event) => <article key={event.title} className="grid grid-cols-12 items-center gap-4 py-6"><p className="eyebrow col-span-3 sm:col-span-2">{event.date}</p><h3 className="col-span-7 text-2xl tracking-[-0.05em] sm:col-span-5 sm:text-4xl">{event.title}</h3><p className="col-span-12 text-sm text-ink/60 sm:col-span-4">{event.detail}</p><ArrowUpRight className="col-span-1 justify-self-end" /></article>)}</div><h2 className="mb-8 mt-24 text-4xl tracking-[-0.07em]">Past events</h2><div className="grid gap-10 md:grid-cols-3">{pastEvents.map((event) => <article key={event.title} className="group"><div className="mb-4 aspect-[4/5] overflow-hidden">{event.video ? <video src={event.video} autoPlay muted loop playsInline preload="metadata" aria-label={event.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}</div><div className="flex justify-between border-b border-ink/30 pb-3 text-sm"><span>{event.title}</span><span className="eyebrow">{event.type}</span></div><p className="eyebrow mt-3 text-ink/60">{event.date}</p></article>)}</div></section></>;
}

function TeamPage() {
  const hierarchy = team;
  const hierarchyRef = useRef<HTMLDivElement>(null);
  const [hierarchyVisible, setHierarchyVisible] = useState(false);
  useEffect(() => {
    const element = hierarchyRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHierarchyVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div className="team-page"><video autoPlay muted loop playsInline preload="metadata" src="/assets/team/team-background.mp4" className="team-page__video" aria-hidden="true" /><div className="team-page__overlay" aria-hidden="true" /><div className="team-page__content"><PageIntro number="02" eyebrow="People behind EDC" title="The people making it happen." showOrb={false}><div className="team-map" aria-label="EDC leadership structure"><span className="team-map__line" /><span className="team-map__label">EDC / 2026</span><strong>One idea.</strong><strong>Many hands.</strong><small>Scroll to meet the team ↓</small></div></PageIntro><section className="page-section px-5 pb-28 sm:px-8 md:px-12"><div className="page-stats mb-16 grid grid-cols-3 border-y border-cream/20 py-5"><div><strong>07</strong><span>Core members</span></div><div><strong>05</strong><span>Working teams</span></div><div><strong>∞</strong><span>Big ideas</span></div></div><p className="page-section__lead mb-16 max-w-xl text-lg text-cream/65">A team of doers, dreamers, and problem-solvers building the ecosystem we wished we had.</p><div ref={hierarchyRef} className={`team-hierarchy${hierarchyVisible ? " team-hierarchy--visible" : ""}`}>{hierarchy.map((member, index) => <article key={member.name} className="team-level" style={{ "--card-delay": `${index * 120}ms` } as React.CSSProperties}><span className="team-level__number">0{index + 1}</span><div className="team-card__image aspect-square overflow-hidden bg-cream/10"><img src={member.image} alt={member.name} className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div><div className="team-level__copy"><p className="eyebrow text-lime">{member.role}</p><h3 className="mt-3 text-2xl text-cream sm:text-4xl">{member.linkedin ? <a href={member.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-lime">{member.name}</a> : member.name}</h3><p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/55">{index === 0 ? "Setting the direction and keeping the bigger picture in view." : index === 1 ? "Turning direction into momentum and keeping the team moving." : "Helping ideas become real through focused, collaborative work."}</p></div><ArrowUpRight size={22} className="team-card__arrow text-cream/50" /></article>)}</div><div className="collective-line mt-20 border-t border-cream/20 pt-6"><p className="eyebrow text-cream/50">Our wider collective</p><p className="mt-4 text-3xl tracking-[-0.05em] text-cream">Marketing · Design · Finance · Partnerships · Community  </p></div></section></div></div>;
}

function ResourcesPage() {
  const resources = [
    ["How to find your first customer", "Start with a real problem.\nChoose one clear audience.\nSpeak to people before building.\nLet evidence guide the next version."],
    ["A founder’s guide to asking better questions", "Begin with curiosity.\nAsk about real experiences.\nListen without defending your idea.\nTurn strong answers into experiments."],
    ["Building your first prototype", "Define one learning goal.\nKeep the scope deliberately small.\nTest with real users.\nImprove what creates confusion."],
    ["A practical guide to your first pitch", "Open with the problem.\nShow your insight and evidence.\nExplain the next step.\nImprove the pitch after every room."],
    ["What to do when the idea is still rough", "Write the idea in one sentence.\nMark assumptions clearly.\nRun a small experiment.\nLet clarity emerge through practice."],
    ["How to choose a co-founder", "Start with shared motivation.\nCompare working styles and strengths.\nTest collaboration on a small project.\nBuild trust before the company."],
    ["The basics of market research", "Define a focused customer group.\nMap alternatives and unmet needs.\nTalk to users and operators.\nUpdate the research as you learn."],
    ["What makes a strong team culture", "Make the mission understandable.\nGive people clear ownership.\nMake feedback safe and useful.\nLet culture show up in behaviour."],
    ["How to tell your startup story", "Begin with a human problem.\nShare the insight and first proof.\nKeep the language concrete.\nEnd with a clear opportunity."],
    ["How to build a useful network", "Begin by being helpful.\nAsk thoughtful questions.\nFollow up with something relevant.\nLet trust grow gradually."],
  ];
  return <><PageIntro number="03" eyebrow="Keep exploring" title="A library for the next big idea." showOrb={false} /><section className="dots-pattern resources-panel bg-white px-5 py-20 text-ink sm:px-8 md:px-12 md:py-28"><div className="mb-12 flex items-end justify-between border-b border-ink/20 pb-5"><p className="max-w-md text-lg text-ink/60">Notes, tools, and questions for the people building their first thing.</p><span className="eyebrow text-ink/50">05 / Field notes</span></div><div className="border-t border-ink/20"><p className="eyebrow pt-6 text-ink/50">More from EDC</p>{resources.map(([title, description], index) => <a href="#contact" key={title} className="resource-row group flex items-center justify-between gap-8 border-b border-ink/20 py-7"><div><p className="eyebrow mb-3 text-ink/50">0{index + 1} / Journal</p><h2 className="text-2xl tracking-[-0.05em] sm:text-4xl">{title}</h2><p className="mt-3 max-w-2xl whitespace-pre-line text-base leading-relaxed text-ink/60">{description}</p></div><ArrowUpRight className="resource-row__arrow shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>)}</div></section></>;
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submission = {
      name: String(data.get("name") ?? ""),
      usn: String(data.get("usn") ?? ""),
      phone: String(data.get("phone") ?? ""),
      idea: String(data.get("idea") ?? ""),
    };
    setSubmitError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "Contact submission could not be saved.");
      }
    } catch (error) {
      console.error("Could not save contact submission:", error);
      setSubmitted(false);
      setSubmitError(error instanceof Error ? error.message : "Contact submission could not be saved.");
      return;
    }
    const subject = encodeURIComponent(`New idea from ${data.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nUSN: ${data.get("usn")}\nPhone: ${data.get("phone")}\n\nIdea:\n${data.get("idea")}`,
    );
    window.location.href = `mailto:admin@ecellramaiah.in?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return <div className="contact-page"><div className="contact-page__fibers" aria-hidden="true"><GhostFibers glowColor="#063bef" lineColor="#9bb8ff" secondaryColor="#1431c0" layers={3} twist={1.2} waves={1.2} threads={72} fiberStyle="dots" depthOfField={0.85} hoverEffect="focus" intro dpr={2} brightness={1.4} glow={1.1} particles={0.5} /></div><div className="contact-page__content"><PageIntro number="04" eyebrow="Have an idea?" title="Start something meaningful." showOrb={false} className="contact-page-intro" /><section className="dots-pattern bg-white px-5 py-20 text-ink sm:px-8 md:px-12 md:py-28"><div className="grid grid-cols-12 gap-12"><div className="col-span-12 md:col-span-4"><p className="eyebrow text-ink/50">Tell us your idea</p><p className="mt-6 max-w-sm text-lg leading-tight text-ink/65">Have something worth building? Give us the first version. We&apos;ll help you take it further.</p><a href="mailto:admin@ecellramaiah.in" className="mt-10 inline-flex items-center gap-2 border-b border-ink pb-2 text-lg">admin@ecellramaiah.in <ArrowUpRight size={18} /></a></div><form onSubmit={handleSubmit} className="col-span-12 md:col-span-7 md:col-start-6"><div className="grid gap-8 sm:grid-cols-2"><label className="flex flex-col gap-2"><span className="eyebrow text-ink/50">Your name</span><input required name="name" type="text" placeholder="Enter your name" className="border-b border-ink/30 bg-transparent px-0 py-3 text-lg outline-none placeholder:text-ink/30 focus:border-ink" /></label><label className="flex flex-col gap-2"><span className="eyebrow text-ink/50">USN</span><input required name="usn" type="text" placeholder="Enter your USN" className="border-b border-ink/30 bg-transparent px-0 py-3 text-lg uppercase outline-none placeholder:text-ink/30 focus:border-ink" /></label></div><label className="mt-8 flex flex-col gap-2"><span className="eyebrow text-ink/50">Phone number</span><input required name="phone" type="tel" inputMode="tel" pattern="[0-9+() -]{7,}" placeholder="Enter your phone number" className="border-b border-ink/30 bg-transparent px-0 py-3 text-lg outline-none placeholder:text-ink/30 focus:border-ink" /></label><label className="mt-8 flex flex-col gap-2"><span className="eyebrow text-ink/50">Your idea</span><textarea required name="idea" rows={5} placeholder="Tell us what you want to create..." className="resize-y border-b border-ink/30 bg-transparent px-0 py-3 text-lg outline-none placeholder:text-ink/30 focus:border-ink" /></label><div className="mt-10 flex flex-wrap items-center gap-5"><button type="submit" className="inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-transform hover:scale-[1.03]">Send your idea <ArrowUpRight size={18} /></button>{submitted && <p className="text-sm text-ink/60">Your submission was saved and your email app should open.</p>}{submitError && <p className="text-sm text-red-600">{submitError}</p>}</div></form></div></section></div></div>;
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
      <div className="grid grid-cols-12 gap-8"><p className="eyebrow col-span-12 text-ink/50 md:col-span-3">06 / Contact</p><div className="col-span-12 md:col-span-9"><h2 className="max-w-4xl text-5xl leading-[0.9] tracking-[-0.07em] sm:text-7xl">Let&apos;s build the next chapter together.</h2><a href="mailto:admin@ecellramaiah.in" className="mt-12 inline-flex items-center gap-2 border-b border-ink pb-2 text-lg">admin@ecellramaiah.in <ArrowUpRight size={18} /></a></div></div>
    </section>
  </>;
}

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return <BrowserRouter><div className={`site-fibers${isMobile ? " site-fibers--mobile" : ""}`} aria-hidden="true"><GhostFibers glowColor="#063bef" lineColor="#9bb8ff" secondaryColor="#1431c0" layers={3} twist={1.2} waves={1.2} threads={72} fiberStyle="dots" depthOfField={0.85} hoverEffect="focus" intro mouseInteraction dpr={2} brightness={1.4} glow={1.1} particles={0.5} /></div><Header /><main className="site-content overflow-hidden"><Routes><Route path="/" element={<HomePage />} /><Route path="/events" element={<EventsPage />} /><Route path="/team" element={<TeamPage />} /><Route path="/resources" element={<ResourcesPage />} /><Route path="/contact" element={<ContactPage />} /></Routes><Footer /></main></BrowserRouter>;
}

export default App;
