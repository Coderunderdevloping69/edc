import { motion } from "framer-motion";

type GalaxyStat = {
  label: string;
  value: string;
  detail: string;
  angle: number;
};

const galaxyStats: GalaxyStat[] = [
  { label: "Active startups", value: "07", detail: "building now", angle: -72 },
  { label: "Since lifetime", value: "15", detail: "ventures launched", angle: -18 },
  { label: "Team members", value: "07", detail: "one star per builder", angle: 36 },
  { label: "Ideas in orbit", value: "∞", detail: "always moving forward", angle: 92 },
];

const teamStars = ["Priya", "Siddharth", "Saksham", "Rohit", "Member 03", "Shivesh", "Hardik"];

export default function Stats16() {
  return (
    <section className="stats-16" aria-labelledby="stats-16-title">
      <div className="stats-16__header">
        <p className="eyebrow text-cream/50">05 / The EDC galaxy</p>
        <h2 id="stats-16-title">Every idea finds its orbit.</h2>
        <p>One team, many directions, and a growing constellation of things worth building.</p>
      </div>
      <div className="stats-16__galaxy" aria-label="EDC startup and team statistics">
        <div className="stats-16__core">
          <span className="stats-16__core-glow" />
          <strong>EDC</strong>
          <small>ideas in motion</small>
        </div>
        {galaxyStats.map((stat, index) => (
          <motion.article
            key={stat.label}
            className="stats-16__stat"
            style={{ "--angle": `${stat.angle}deg`, "--counter-angle": `${-stat.angle}deg`, "--delay": `${index * 0.12}s` } as React.CSSProperties}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: index * 0.12 }}
          >
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.detail}</small>
          </motion.article>
        ))}
        <div className="stats-16__stars" aria-label="EDC team members">
          {teamStars.map((star, index) => (
            <span key={star} className="stats-16__star" style={{ "--star-delay": `${index * 0.18}s`, "--star-angle": `${index * 52 - 20}deg`, "--star-counter-angle": `${20 - index * 52}deg` } as React.CSSProperties}>
              <i />
              <em>{star}</em>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
