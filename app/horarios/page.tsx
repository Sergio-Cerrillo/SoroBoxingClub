import { Navigation } from "@/components/navigation"
import { ScheduleSection } from "@/components/schedule-section"
import { Footer } from "@/components/footer"

export default function HorariosPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <ScheduleSection />
      </div>
      <Footer />
    </main>
  )
}
