"use client"

import { m, useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Trophy, Calendar } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { Stagger, StaggerItem } from "@/components/motion"
import { motionConfig } from "@/lib/motion/config"

// Hook para animar números
function useCountUp(end: number, duration: number = 2, startWhen: boolean = true) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!startWhen) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, startWhen])

  return count
}

function StatCard({ icon: Icon, value, label, delay }: { icon: any, value: number, label: string, delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const count = useCountUp(value, 2.5, isInView)

  return (
    <StaggerItem direction="up">
      <m.div
        ref={ref}
        whileHover={{ y: -8, scale: 1.05 }}
        transition={motionConfig.easing.spring}
      >
        <Card className="p-3 lg:p-8 border-2 border-accent/30 hover:border-accent transition-all duration-300 hover:shadow-2xl hover:shadow-accent/50 bg-zinc-900 shadow-lg shadow-accent/20">
          <div className="flex flex-col items-center text-center">
            <m.div
              className="w-8 h-8 lg:w-16 lg:h-16 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mb-2 lg:mb-6"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Icon className="w-4 h-4 lg:w-8 lg:h-8 text-accent" />
            </m.div>

            <m.div
              className="text-2xl lg:text-5xl font-bold text-accent mb-1 lg:mb-3"
              initial={{ scale: 1 }}
              animate={isInView ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.5 }}
            >
              +{count}
            </m.div>

            <div className="text-[0.6rem] lg:text-sm font-mono text-white tracking-wider uppercase leading-tight">
              {label}
            </div>
          </div>
        </Card>
      </m.div>
    </StaggerItem>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <Stagger staggerDelay={motionConfig.stagger.slow} className="grid grid-cols-3 gap-4 lg:gap-8 max-w-7xl mx-auto">
          <StatCard icon={Calendar} value={15} label="Años Experiencia" delay={0} />
          <StatCard icon={Users} value={100} label="Alumnos Activos" delay={0.15} />
          <StatCard icon={Trophy} value={15} label="Campeones Formados" delay={0.3} />
        </Stagger>
      </div>
    </section>
  )
}
