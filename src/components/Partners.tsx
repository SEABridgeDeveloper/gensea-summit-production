const cohosts = [
  { src: '/logo/partners/cohost-01-seabridge.png', alt: 'SEA Bridge' },
  { src: '/logo/partners/cohost-02-chula.png', alt: 'Chulalongkorn University' },
  { src: '/logo/partners/cohost-03-sasin.png', alt: 'Sasin Center of Excellence' },
]

const ecoRow1 = [
  { src: '/logo/partners/eco-01-mhesi.png', alt: 'Ministry of Higher Education, Science, Research and Innovation' },
  { src: '/logo/partners/eco-02-nia.png', alt: 'NIA — National Innovation Agency' },
  { src: '/logo/partners/eco-03-set.png', alt: 'SET at APEC 2022 Thailand' },
  { src: '/logo/partners/eco-04-tsri.png', alt: 'TSRI' },
  { src: '/logo/partners/eco-05-nxpo.png', alt: 'NXPO' },
]

const ecoRow2 = [
  { src: '/logo/partners/eco-06-se-thailand.png', alt: 'Social Enterprise Thailand' },
  { src: '/logo/partners/eco-07-mahidol.png', alt: 'Mahidol University' },
  { src: '/logo/partners/eco-08-int.png', alt: 'INT — Power of Mahidol Innovation' },
  { src: '/logo/partners/eco-09-kku.png', alt: 'Khon Kaen University' },
  { src: '/logo/partners/eco-10-kkbs.png', alt: 'Khon Kaen Business School' },
]

const ecoRow3 = [
  { src: '/logo/partners/eco-11-thammasat.png', alt: 'Thammasat University' },
  { src: '/logo/partners/eco-12-citu.png', alt: 'College of Innovation, Thammasat University' },
  { src: '/logo/partners/eco-13-harbour.png', alt: 'Harbour.Space Institute of Technology @UTCC' },
  { src: '/logo/partners/eco-14-tcc.png', alt: 'Thai Chamber of Commerce & Board of Trade of Thailand' },
]

const clients = [
  { src: '/logo/partners/client-01-airasia.png', alt: 'AirAsia Academy' },
  { src: '/logo/partners/client-02-punpro.png', alt: 'ปันโปร' },
  { src: '/logo/partners/client-03-bridge.png', alt: 'The Bridge Expansion Series' },
  { src: '/logo/partners/client-04-senior.png', alt: 'The Senior Health Care' },
  { src: '/logo/partners/client-05-trumkin.png', alt: 'Trum Kin' },
  { src: '/logo/partners/client-06-yayee.png', alt: 'YAYEE' },
  { src: '/logo/partners/client-07-sopet.png', alt: 'SOPet' },
]

function PartnerCell({ src, alt, sponsor }: { src: string; alt: string; sponsor?: boolean }) {
  return (
    <div className={`partner-cell${sponsor ? ' card-sponsor' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
    </div>
  )
}

export default function Partners() {
  return (
    <section className="partners">
      <div className="container">
        <div className="reveal">
          <p className="partners-label">Gen SEA Summit 2024</p>
          <h2 className="partners-heading">
            Our <span>Track Record</span>
          </h2>
          <p className="partners-sub">
            Last year&rsquo;s summit was backed by an exceptional coalition of partners across
            government, academia, and industry.
          </p>
        </div>

        {/* Co-Hosts */}
        <div className="partners-tier reveal stagger-1">
          <p className="tier-label">Co-Hosts</p>
          <div className="partner-grid grid-3">
            {cohosts.map((p) => (
              <PartnerCell key={p.alt} {...p} />
            ))}
          </div>
        </div>

        {/* Ecosystem Supporters */}
        <div className="partners-tier reveal stagger-2">
          <p className="tier-label">Ecosystem Supporters</p>
          <div className="partner-grid grid-5">
            {ecoRow1.map((p) => (
              <PartnerCell key={p.alt} {...p} />
            ))}
          </div>
          <div className="partner-grid grid-5" style={{ marginTop: 'clamp(12px,2vw,20px)' }}>
            {ecoRow2.map((p) => (
              <PartnerCell key={p.alt} {...p} />
            ))}
          </div>
          <div className="partner-grid grid-4" style={{ marginTop: 'clamp(12px,2vw,20px)' }}>
            {ecoRow3.map((p) => (
              <PartnerCell key={p.alt} {...p} />
            ))}
          </div>
        </div>

        {/* Client Case Sponsors */}
        <div className="partners-tier reveal stagger-3">
          <p className="tier-label">Client Case Sponsors</p>
          <div className="partner-grid grid-7">
            {clients.map((p) => (
              <PartnerCell key={p.alt} {...p} sponsor />
            ))}
          </div>
        </div>

        <div className="partners-divider reveal stagger-5" />
      </div>
    </section>
  )
}
