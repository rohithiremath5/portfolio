export default function SectionHeading({ number, label, title, text }) {
  return <div className="section-heading"><div><p className="eyebrow"><span>{number}</span> {label}</p><h2>{title}</h2></div>{text && <p className="section-intro">{text}</p>}</div>;
}
