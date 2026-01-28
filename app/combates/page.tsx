import { Navigation } from "@/components/navigation"
import { FightsSection } from "@/components/fights-section"
import { Footer } from "@/components/footer"

export default function CombatesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <FightsSection />
      </div>
      <Footer />
    </main>
  )
}
