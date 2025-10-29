import { Hero } from '@/components/Hero'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { Categories } from '@/components/Categories'
import { Newsletter } from '@/components/Newsletter'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Categories />
      <Newsletter />
      <Footer />
    </main>
  )
}
