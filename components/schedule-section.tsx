"use client"

import { m } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Clock, Calendar } from "lucide-react"
import { Stagger, StaggerItem, Reveal } from "@/components/motion"
import { motionConfig } from "@/lib/motion/config"

const schedule = [
    {
        day: "Lunes - Miércoles - Viernes",
        times: ["07:00 - 09:00", "18:00 - 21:00"],
        type: "Boxeo y Pesas",
    },
    {
        day: "Martes - Jueves",
        times: ["07:00 - 09:00", "18:00 - 21:00"],
        type: "Solo Pesas",
    },
    {
        day: "Sábados",
        times: ["09:00 - 13:00"],
        type: "Sesión Abierta",
    },
]

export function ScheduleSection() {
    return (
        <section className="py-24 lg:py-32 bg-black">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-20">
                    <Reveal direction="down" delay={0.1}>
                        <div className="inline-block px-6 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
                            <span className="text-accent font-mono text-xs tracking-[0.2em] uppercase font-medium">
                                Horarios
                            </span>
                        </div>
                    </Reveal>

                    <Reveal direction="up" delay={0.2}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            NUESTROS <span className="text-accent">HORARIOS</span>
                        </h2>
                    </Reveal>

                    <Reveal direction="up" delay={0.3}>
                        <p className="text-base md:text-lg text-gray-400 font-mono max-w-3xl mx-auto leading-relaxed">
                            Encuentra el horario que mejor se adapte a tu rutina
                        </p>
                    </Reveal>
                </div>

                <Stagger staggerDelay={motionConfig.stagger.normal} className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {schedule.map((item, index) => (
                        <StaggerItem key={index} direction="up">
                            <m.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                transition={motionConfig.easing.spring}
                                className="h-full"
                            >
                                <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-2 hover:border-accent bg-zinc-900 h-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <m.div
                                            className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center"
                                            whileHover={{ rotate: 360, scale: 1.15 }}
                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                        >
                                            <Calendar className="w-6 h-6 text-accent" />
                                        </m.div>
                                        <h3 className="text-lg font-bold text-white">
                                            {item.day}
                                        </h3>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        {item.times.map((time, i) => (
                                            <div key={i} className="flex items-center gap-2 text-gray-400">
                                                <Clock className="w-4 h-4 text-accent" />
                                                <span className="font-mono text-sm">{time}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-accent/20">
                                        <span className="text-accent font-mono text-xs tracking-wider uppercase">
                                            {item.type}
                                        </span>
                                    </div>
                                </Card>
                            </m.div>
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    )
}
