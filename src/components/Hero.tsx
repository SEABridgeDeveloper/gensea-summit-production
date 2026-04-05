export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-logo loading" id="hero-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/logo.svg"
          alt="Gen SEA Summit 2026"
          style={{ width: 'clamp(280px,40vw,500px)', height: 'auto' }}
        />
      </div>
      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-chevron" />
      </div>
    </section>
  )
}
