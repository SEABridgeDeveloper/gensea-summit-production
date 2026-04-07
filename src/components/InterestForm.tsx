'use client'

import { useState, type FormEvent } from 'react'

const interestOptions = [
  { value: 'Talent Recruitment', label: 'Talent Recruitment' },
  { value: 'Brand Exposure', label: 'Brand Exposure' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'Showcase', label: 'Showcase Products / Services' },
  { value: 'Networking', label: 'Networking & Community' },
  { value: 'Speaking', label: 'Speaking Opportunity' },
  { value: 'Other', label: 'Other' },
]

export default function InterestForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      name: (formData.get('name') as string).trim(),
      organization: (formData.get('organization') as string).trim(),
      position: (formData.get('position') as string).trim(),
      phone: (formData.get('phone') as string).trim(),
      email: (formData.get('email') as string).trim(),
      interest: formData.get('interest') as string,
      details: (formData.get('details') as string).trim(),
    }

    setSubmitting(true)
    setError(false)

try {
  // console.log("Pass -1")

await fetch('/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...data, source: 'website' }),
})

  // console.log("Pass 0 - Request sent")
  setSubmitted(true)      // ✅ show success screen
  setSubmitting(false)    // ✅ re-enable button
  
} catch {
  setError(true)
  setSubmitting(false)
  setTimeout(() => setError(false), 4000)
}
  }

  return (
    <section className="form-section" id="register">
      <div className="container">
        <div className="form-header reveal">
          <h2>Express Your Interest</h2>
          <p>Join us in shaping the future of Southeast Asia&rsquo;s next generation of leaders.</p>
        </div>

        {submitted ? (
          <div className="form-success">
            <div className="success-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Thank you for your interest!</h3>
            <p>Our team will reach out to you shortly at the email you provided.</p>
          </div>
        ) : (
          <div className="glass-form-wrapper reveal">
            <form className="glass-form" onSubmit={handleSubmit}>
              <p className="form-section-label">Contact Information</p>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="f-name">Full Name</label>
                  <input
                    type="text"
                    id="f-name"
                    name="name"
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="f-org">Organization</label>
                  <input
                    type="text"
                    id="f-org"
                    name="organization"
                    required
                    placeholder="Company or institution"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="f-email">Email</label>
                  <input
                    type="email"
                    id="f-email"
                    name="email"
                    required
                    placeholder="you@example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="f-phone">Phone</label>
                  <input
                    type="tel"
                    id="f-phone"
                    name="phone"
                    required
                    placeholder="+66 xxx xxx xxxx"
                  />
                </div>
              </div>

              <p className="form-section-label">Engagement Details</p>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="f-position">
                    Position / Role
                    <span className="label-optional">Optional</span>
                  </label>
                  <input
                    type="text"
                    id="f-position"
                    name="position"
                    placeholder="Your current role"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="f-interest">Primary Interest</label>
                  <select id="f-interest" name="interest" required defaultValue="">
                    <option value="" disabled>
                      Select your primary interest
                    </option>
                    {interestOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group full-width" style={{ marginBottom: 0 }}>
                <label htmlFor="f-details">
                  Additional Details
                  <span className="label-optional">Optional</span>
                </label>
                <textarea
                  id="f-details"
                  name="details"
                  rows={4}
                  placeholder="Tell us more about your goals and how we can collaborate..."
                />
              </div>
              <button
                type="submit"
                className="submit-btn"
                id="submit-btn"
                disabled={submitting}
              >
                {error ? (
                  'Error — Try again'
                ) : submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    Submit Interest
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
