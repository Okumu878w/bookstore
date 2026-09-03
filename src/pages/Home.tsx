import Nav from '../components/Nav'
import Hero from '../components/Hero'
import TheBook from '../components/TheBook'
import Themes from '../components/Themes'
import AboutAuthor from '../components/AboutAuthor'
import GetYourCopy from '../components/GetYourCopy'
import Services from '../components/Services'
import Articles from '../components/Articles'
import ContactUs from '../components/ContactUs'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Nav />
      <main>
        <Hero />
        <TheBook />
        <Themes />
        <AboutAuthor />
        <GetYourCopy />
        <Services />
        <Articles />
        <ContactUs />
      </main>
      <Footer />
    </div>
  )
}