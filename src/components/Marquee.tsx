const items = [
  'Building Amidst Chaos',
  'One Summit',
  'One Region',
  'One Future',
  'One Generation',
  'Khon Kaen 2026',
  'Southeast Asia',
  'Innovation',
]

export default function Marquee() {
  const allItems = [...items, ...items]

  return (
    <section className="marquee-section" aria-hidden="true">
      <div className="marquee-track">
        {allItems.map((text, i) => (
          <span key={i} className="marquee-item">
            {text}
            <span className="dot" />
          </span>
        ))}
      </div>
    </section>
  )
}
