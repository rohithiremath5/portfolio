export default function SectionHeading({ id, number, label, title, text }) {
  return <div className="section-heading"><div><p className="eyebrow"><span>{number}</span> {label}</p><h2 id={id}>{title}</h2></div>{text && <p className="section-intro">{text}</p>}</div>;
}
