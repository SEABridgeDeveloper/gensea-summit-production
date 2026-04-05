'use client'

import { useEffect } from 'react'

export default function GlobalEffects() {
  useEffect(() => {
    // --- Cursor Spotlight ---
    const cursorGlow = document.getElementById('cursor-glow')
    let mouseX = -600, mouseY = -600
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    document.addEventListener('mousemove', onMouseMove)
    let cursorRaf: number
    ;(function updateCursor() {
      if (cursorGlow) {
        cursorGlow.style.left = mouseX + 'px'
        cursorGlow.style.top = mouseY + 'px'
      }
      cursorRaf = requestAnimationFrame(updateCursor)
    })()

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress')
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (progressBar && h > 0) {
        progressBar.style.width = (window.pageYOffset / h * 100) + '%'
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // --- Hero Logo Reveal ---
    const heroLogo = document.getElementById('hero-logo')
    let heroRevealTimeout: ReturnType<typeof setTimeout>
    if (heroLogo) {
      heroRevealTimeout = setTimeout(() => {
        heroLogo.classList.remove('loading')
        heroLogo.classList.add('revealed')
      }, 300)
    }

    // --- Hero Parallax ---
    const heroSection = document.querySelector('.hero') as HTMLElement | null
    let rafTick = false
    const onScrollParallax = () => {
      if (!rafTick) {
        requestAnimationFrame(() => {
          const y = window.pageYOffset
          if (heroSection && heroLogo) {
            const hH = heroSection.offsetHeight
            if (y < hH) {
              const p = y / hH
              heroLogo.style.transform = 'translateY(' + (y * 0.4) + 'px) scale(' + (1 - p * 0.1) + ')'
              heroLogo.style.opacity = String(Math.max(1 - p * 2, 0))
            }
          }
          rafTick = false
        })
        rafTick = true
      }
    }
    window.addEventListener('scroll', onScrollParallax, { passive: true })

    // --- Tagline Char-by-Char Split ---
    const taglineH1 = document.getElementById('tagline-text')
    if (taglineH1) {
      const originalText = taglineH1.textContent || ''
      const chaosStart = originalText.indexOf('Chaos')
      taglineH1.innerHTML = ''
      originalText.split('').forEach((ch, i) => {
        const span = document.createElement('span')
        span.className = 'char' + (chaosStart >= 0 && i >= chaosStart ? ' char-accent' : '')
        span.textContent = ch === ' ' ? '\u00A0' : ch
        span.style.transitionDelay = (i * 0.035) + 's'
        taglineH1.appendChild(span)
      })
    }

    // --- Intersection Observer: Reveal ---
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            revealObs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el))

    // --- Intersection Observer: Counter Animation ---
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            if (el.dataset.done) return
            el.dataset.done = '1'
            const target = +(el.dataset.target || '0')
            const dur = 2500
            const t0 = performance.now()
            ;(function tick(now: number) {
              const p = Math.min((now - t0) / dur, 1)
              const ease = 1 - Math.pow(1 - p, 4)
              el.textContent = String(Math.round(target * ease))
              if (p < 1) requestAnimationFrame(tick)
            })(t0)
            counterObs.unobserve(el)
          }
        })
      },
      { threshold: 0.4 }
    )
    document.querySelectorAll('.stat-number').forEach((el) => counterObs.observe(el))

    // --- Magnetic Submit Button ---
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null
    const onBtnMove = (e: MouseEvent) => {
      if (!submitBtn || submitBtn.disabled) return
      const r = submitBtn.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      submitBtn.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.25) + 'px)'
    }
    const onBtnLeave = () => {
      if (submitBtn && !submitBtn.disabled) submitBtn.style.transform = ''
    }
    if (submitBtn) {
      submitBtn.addEventListener('mousemove', onBtnMove)
      submitBtn.addEventListener('mouseleave', onBtnLeave)
    }

    // --- Cleanup ---
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScrollParallax)
      cancelAnimationFrame(cursorRaf)
      clearTimeout(heroRevealTimeout)
      revealObs.disconnect()
      counterObs.disconnect()
      if (submitBtn) {
        submitBtn.removeEventListener('mousemove', onBtnMove)
        submitBtn.removeEventListener('mouseleave', onBtnLeave)
      }
    }
  }, [])

  return (
    <>
      <div className="scroll-progress" id="scroll-progress" />
      <div className="cursor-glow" id="cursor-glow" />
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="noise-overlay" aria-hidden="true" />
    </>
  )
}
