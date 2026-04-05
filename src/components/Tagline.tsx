const sloganData = [
  { idx: '01', word: 'Summit', desc: 'Where leaders converge' },
  { idx: '02', word: 'Region', desc: 'Southeast Asia united' },
  { idx: '03', word: 'Future', desc: 'Shaping what comes next' },
  { idx: '04', word: 'Generation', desc: 'The builders of tomorrow' },
]

export default function Tagline() {
  return (
    <section className="tagline">
      <div className="container">
        <div className="tagline-rule reveal" />
        <h1 className="reveal" id="tagline-text">
          Building Amidst Chaos
        </h1>

        {/* Gradient connector line */}
        <div className="slogan-connector reveal" />

        <div className="slogan">
          {sloganData.map((item, i) => (
            <div key={item.idx} className={`slogan-line reveal stagger-${i + 1}`}>
              <span className="slogan-watermark">{item.idx}</span>
              <div className="slogan-content">
                <span className="slogan-one">One</span>
                <span className="slogan-word">{item.word}</span>
                <span className="slogan-desc">{item.desc}</span>
              </div>
              <span className="slogan-dot" />
            </div>
          ))}
        </div>

        {/* Co-Host Showcase */}
        <div className="cohost-showcase reveal">
          <p className="cohost-overline">2026 Co-Hosts</p>
          <h2 className="cohost-heading">
            Powered by <span>Partnership</span>
          </h2>
          <p className="cohost-sub">
            This year&rsquo;s summit is proudly co-hosted by two leading organizations
            driving innovation across Southeast Asia.
          </p>
          <div className="cohost-card">
            <div className="cohost-card-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo/co-host.svg" alt="Co-host organizations" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
