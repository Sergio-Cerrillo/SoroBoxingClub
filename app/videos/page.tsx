import { Navigation } from "@/components/navigation"
import { VideosSection } from "@/components/videos-section"
import { Footer } from "@/components/footer"

export default function VideosPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <VideosSection />
      </div>
      <Footer />
    </main>
  )
}
