"use client"

import { m } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Trophy, Target, Flame } from "lucide-react"
import { Stagger, StaggerItem, Reveal } from "@/components/motion"
import { motionConfig } from "@/lib/motion/config"

const fights = [
    {
        icon: Trophy,
        title: "Preparación Profesional",
        description: "Entrenamiento intensivo para competidores que buscan destacar en el ring.",
    },
    {
        icon: Target,
        title: "Estrategia de Combate",
        description: "Análisis táctico y técnicas avanzadas para dominar cualquier enfrentamiento.",
    },
    {
        icon: Flame,
        title: "Condición Física Extrema",
        description: "Programas de acondicionamiento diseñados para atletas de alto rendimiento.",
    },
]

export function FightsSection() {
    return (
        <section className="py-24 lg:py-32 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-20">
                    <Reveal direction="down" delay={0.1}>
                        <div className="inline-block px-6 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
                            <span className="text-accent font-mono text-xs tracking-[0.2em] uppercase font-medium">
                                Combates
                            </span>
                        </div>
                    </Reveal>

                    <Reveal direction="up" delay={0.2}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            PREPARACIÓN PARA <span className="text-accent">COMBATES</span>
                        </h2>
                    </Reveal>

                    <Reveal direction="up" delay={0.3}>
                        <p className="text-base md:text-lg text-muted-foreground font-mono max-w-3xl mx-auto leading-relaxed">
                            Entrena como un profesional y lleva tu técnica al siguiente nivel
                        </p>
                    </Reveal>
                </div>

                <Stagger staggerDelay={motionConfig.stagger.normal} className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {fights.map((fight, index) => (
                        <StaggerItem key={index} direction="up">
                            <m.div
                                whileHover={{ y: -10, scale: 1.02 }}
                                transition={motionConfig.easing.spring}
                                className="h-full"
                            >
                                <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-2 hover:border-accent bg-card h-full">
                                    <m.div
                                        className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6"
                                        whileHover={{ rotate: 360, scale: 1.15 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                    >
                                        <fight.icon className="w-8 h-8 text-accent" />
                                    </m.div>
                                    <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-accent transition-colors">
                                        {fight.title}
                                    </h3>
                                    <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                                        {fight.description}
                                    </p>
                                </Card>
                            </m.div>
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    )
}
