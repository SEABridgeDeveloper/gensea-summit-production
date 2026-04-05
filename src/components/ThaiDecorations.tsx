const diamondPath = "M20 2Q13 13 2 20Q13 27 20 38Q27 27 38 20Q27 13 20 2Z"
const petalPath =
  "M20 1C15 8 15 15 20 20C25 15 25 8 20 1ZM39 20C32 15 25 15 20 20C25 25 32 25 39 20ZM20 39C25 32 25 25 20 20C15 25 15 32 20 39ZM1 20C8 25 15 25 20 20C15 15 8 15 1 20Z"
const leafPath = "M20 4C12 12 8 24 20 36C32 24 28 12 20 4Z"

export function ThaiDivider() {
  return (
    <div className="thai-divider" aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="#C5A355">
        <path d={diamondPath} />
        <rect
          x="17.5"
          y="17.5"
          width="5"
          height="5"
          rx="0.5"
          transform="rotate(45 20 20)"
        />
      </svg>
    </div>
  )
}

export default function ThaiDecorations() {
  return (
    <>
      {/* Subtle repeating Thai pattern background */}
      <div className="thai-pattern-bg" aria-hidden="true" />

      {/* Floating Thai flower decorations at viewport edges */}
      <div className="thai-float-wrap" aria-hidden="true">
        <svg className="thai-float td-1" viewBox="0 0 40 40" fill="#C5A355">
          <path d={diamondPath} />
          <rect x="17.5" y="17.5" width="5" height="5" rx="0.5" transform="rotate(45 20 20)" />
        </svg>
        <svg className="thai-float td-2" viewBox="0 0 40 40" fill="#C5A355">
          <path d={petalPath} />
          <circle cx="20" cy="20" r="2" />
        </svg>
        <svg className="thai-float td-3" viewBox="0 0 40 40" fill="#C5A355">
          <path d={leafPath} />
        </svg>
        <svg className="thai-float td-4" viewBox="0 0 40 40" fill="#C5A355">
          <path d={diamondPath} />
          <rect x="17.5" y="17.5" width="5" height="5" rx="0.5" transform="rotate(45 20 20)" />
        </svg>
        <svg className="thai-float td-5" viewBox="0 0 40 40" fill="#C5A355">
          <path d={petalPath} />
          <circle cx="20" cy="20" r="2" />
        </svg>
        <svg className="thai-float td-6" viewBox="0 0 40 40" fill="#C5A355">
          <path d={leafPath} />
        </svg>
        <svg className="thai-float td-7" viewBox="0 0 40 40" fill="#C5A355">
          <path d={diamondPath} />
          <rect x="17.5" y="17.5" width="5" height="5" rx="0.5" transform="rotate(45 20 20)" />
        </svg>
        <svg className="thai-float td-8" viewBox="0 0 40 40" fill="#C5A355">
          <path d={petalPath} />
          <circle cx="20" cy="20" r="2" />
        </svg>
      </div>
    </>
  )
}
