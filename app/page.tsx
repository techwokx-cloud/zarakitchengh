import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import MenuCategories from '@/components/MenuCategories'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Menu Categories -- expands inline when a category icon is clicked */}
      <MenuCategories />

      {/* Footer */}
      <Footer />
    </main>
  )
}
