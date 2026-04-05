import GlobalEffects from '@/components/GlobalEffects'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Tagline from '@/components/Tagline'
import Partners from '@/components/Partners'
import EventInfo from '@/components/EventInfo'
import InterestForm from '@/components/InterestForm'
import Footer from '@/components/Footer'
import ThaiDecorations, { ThaiDivider } from '@/components/ThaiDecorations'

export default function Home() {
  return (
    <>
      <GlobalEffects />
      <ThaiDecorations />
      <Hero />
      <Marquee />
      <ThaiDivider />
      <Tagline />
      <ThaiDivider />
      <Partners />
      <ThaiDivider />
      <EventInfo />
      <ThaiDivider />
      <InterestForm />
      <Footer />
    </>
  )
}
