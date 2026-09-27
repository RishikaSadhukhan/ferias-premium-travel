import { JourneyDialog } from './components/journey/JourneyDialog'
import { SiteNav } from './components/nav/SiteNav'
import { SkipLink } from './components/ui/SkipLink'
import { JourneyProvider } from './context/JourneyProvider'
import { MotionProvider } from './context/MotionProvider'
import { About } from './sections/About/About'
import { Contact } from './sections/Contact/Contact'
import { FinalCta } from './sections/FinalCta/FinalCta'
import { Footer } from './sections/Footer/Footer'
import { Hero } from './sections/Hero/Hero'
import { Intertitle } from './sections/Intertitle/Intertitle'
import { Reels } from './sections/Reels/Reels'
import { Scenes } from './sections/Scenes/Scenes'

/** The film, in running order. */
export default function App() {
  return (
    <MotionProvider>
      <JourneyProvider>
        <SkipLink />
        <SiteNav />
        <main>
          <Hero />
          <Intertitle />
          <Reels />
          <Scenes />
          <About />
          <Contact />
          <FinalCta />
        </main>
        <Footer />
        <JourneyDialog />
      </JourneyProvider>
    </MotionProvider>
  )
}
