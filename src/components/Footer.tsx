export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/sb_logo.svg"
            alt="SEA Bridge"
            style={{ height: 36, width: 'auto' }}
          />
          <span className="footer-divider">|</span>
          <span className="footer-summit">GEN SEA SUMMIT 2026</span>
        </div>
        <p className="footer-hosted">Co-hosted by KKU APDS &amp; SEA Bridge</p>
        <a href="mailto:team@seabridge.space" className="footer-email">
          team@seabridge.space
        </a>
        <p className="footer-copyright">
          Copyright &copy; 2026 SEA Bridge. Confidential &amp; Proprietary.
        </p>
      </div>
    </footer>
  )
}
