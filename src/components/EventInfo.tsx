const stats = [
  { target: 300, label: 'Youth Innovators' },
  { target: 50, label: 'Ecosystem Partners' },
  { target: 15, label: 'Speakers' },
  { target: 20, label: 'Showcases' },
]

const themes = [
  { idx: '01', name: 'Wellness' },
  { idx: '02', name: 'Food' },
  { idx: '03', name: 'AI & Digital' },
  { idx: '04', name: 'Creative Economy' },
  { idx: '05', name: 'Education 5.0' },
]

export default function EventInfo() {
  return (
    <section className="event-info">
      {/* Date hero band */}
      <div className="event-hero reveal">
        <p className="event-overline">Event Details</p>
        <div className="event-date-block">
          <div className="event-date-big">16 &ndash; 18</div>
          <span className="event-month">July 2026</span>
        </div>
        <p className="event-location-big">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Khon Kaen, Thailand
        </p>
        <div className="event-badge">
          <span className="badge-dot" />
          Registration Opening Soon
        </div>
      </div>

      {/* Detail cards */}
      <div className="event-details-row reveal">
        <div className="event-detail-card">
          <p className="ed-label">Venue</p>
          <p className="ed-value">
            <strong>Regional Science Park NE1</strong> &amp; KICE International Convention and
            Exhibition Center
          </p>
        </div>
        <div className="event-detail-card">
          <p className="ed-label">Audience</p>
          <p className="ed-value">
            <strong>300+</strong> young leaders, builders &amp; changemakers across Southeast Asia
          </p>
        </div>
        <div className="event-detail-card">
          <p className="ed-label">In Conjunction With</p>
          <p className="ed-value">
            <strong>Isan Creative Festival 2026</strong> &amp; <strong>ICIS 2026</strong>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-section">
        <div className="stats-header reveal">
          <h2 className="stats-title">
            By the <span>Numbers</span>
          </h2>
          <p className="stats-subtitle">What we&rsquo;re building together in 2026</p>
        </div>
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={s.label} className={`stat-card reveal stagger-${i + 1}`}>
              <span className="stat-number" data-target={s.target}>
                0
              </span>
              <span className="stat-plus">+</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Themes */}
      <div className="themes-section">
        <div className="themes-header reveal">
          <h2 className="themes-title">Key Themes</h2>
        </div>
        <div className="themes-grid reveal">
          {themes.map((t) => (
            <div key={t.idx} className="theme-cell">
              <span className="theme-idx">{t.idx}</span>
              <span className="theme-name">{t.name}</span>
              <div className="theme-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
