"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { m } from "framer-motion"
import { ArrowRight, CalendarDays, Clock, MapPin, MessageCircle, Ticket, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal, Stagger, StaggerItem } from "@/components/motion"
import { motionConfig } from "@/lib/motion/config"

const ticketMessage =
  "Hola Soro Boxing Club, quiero entradas anticipadas para la velada Boxeo Santa Maria del Cami del 3 de octubre."
const ticketHref = `https://wa.me/34669102905?text=${encodeURIComponent(ticketMessage)}`

function PosterFallback() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(56,189,248,0.38),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(249,115,22,0.5),transparent_30%),linear-gradient(145deg,#06131f_0%,#060606_48%,#3b1308_100%)]">
      <div className="absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent)]" />
      <div className="absolute left-6 right-6 top-8 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/85">Camp Municipal</p>
        <p className="mt-1 font-mono text-sm font-bold uppercase tracking-[0.18em] text-accent">
          D'Esports Antoni Gelabert
        </p>
      </div>
      <div className="absolute inset-x-5 top-[28%] border-y border-accent/50 bg-black/50 py-5 text-center shadow-[0_0_70px_rgba(251,191,36,0.32)] backdrop-blur-sm">
        <p className="text-6xl font-black uppercase leading-none text-accent sm:text-7xl">Boxeo</p>
        <p className="mt-2 font-mono text-lg font-bold uppercase tracking-wide text-white">
          Santa Maria del Cami
        </p>
      </div>
      <div className="absolute bottom-10 left-6 right-6 text-center">
        <p className="font-mono text-3xl font-black uppercase text-white">3 de octubre de 2026</p>
        <p className="mt-4 font-mono text-sm font-bold uppercase tracking-wide text-white/90">
          16h schoolboy y junior · 18h joven y elite
        </p>
        <p className="mt-5 font-mono text-lg font-black uppercase text-accent">Anticipada 15€ · Taquilla 20€</p>
      </div>
    </div>
  )
}

function EventPoster() {
  const [posterReady, setPosterReady] = useState(true)

  return (
    <m.div
      className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[24px] border border-accent/35 bg-black shadow-[0_35px_100px_rgba(251,191,36,0.25)]"
      initial={{ rotate: -1.5 }}
      whileHover={{ rotate: 0, scale: 1.015 }}
      transition={motionConfig.easing.spring}
    >
      <PosterFallback />
      {posterReady && (
        <Image
          src="/cartel_velada.jpeg"
          alt="Cartel de la primera velada de boxeo de Soro Boxing Club en Santa Maria del Camí"
          fill
          sizes="(min-width: 1024px) 520px, 92vw"
          className="object-cover"
          priority
          onError={() => setPosterReady(false)}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.18)_38%,transparent_46%)] opacity-60" />
    </m.div>
  )
}

const highlights = [
  { icon: MapPin, label: "En casa", value: "Santa Maria del Camí" },
  { icon: Clock, label: "Sesiones", value: "16h base · 18h joven y elite" },
  { icon: Ticket, label: "Entradas", value: "15€ anticipada · 20€ taquilla" },
]

export function EventSection() {
  return (
    <section id="velada" className="relative overflow-hidden bg-black py-24 text-white lg:py-32">
      <div className="absolute inset-0 opacity-70">
        <Image src="/ring2.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black via-black/85 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#030303_0%,rgba(3,3,3,0.82)_40%,rgba(3,3,3,0.54)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal direction="down" delay={0.1}>
              <div className="inline-flex items-center gap-3 rounded-full border border-accent/40 bg-accent/15 px-5 py-2 backdrop-blur-md">
                <Trophy className="h-4 w-4 text-accent" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  Primera velada del club
                </span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.18}>
              <h2 className="mt-8 text-4xl font-black uppercase leading-[0.95] tracking-normal md:text-6xl lg:text-7xl">
                Boxeo en <span className="text-accent">Santa Maria</span>
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.28}>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/86 md:text-xl">
                El 3 de octubre hacemos historia: Soro Boxing Club organiza su primera velada en nuestro pueblo, en el Camp
                Municipal d'Esports Antoni Gelabert. Una tarde para llenar la grada, apoyar a la cantera y vivir el boxeo de cerca.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.36}>
              <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
                <div className="border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/60">Fecha</p>
                  <p className="mt-2 text-2xl font-black text-white">03 OCT</p>
                </div>
                <div className="border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/60">Desde</p>
                  <p className="mt-2 text-2xl font-black text-accent">16H</p>
                </div>
                <div className="border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/60">Ant.</p>
                  <p className="mt-2 text-2xl font-black text-accent">15€</p>
                </div>
              </div>
            </Reveal>

            <Stagger
              staggerDelay={motionConfig.stagger.fast}
              className="mt-8 grid max-w-3xl gap-3 md:grid-cols-3"
            >
              {highlights.map((item) => (
                <StaggerItem key={item.label} direction="up">
                  <div className="h-full border border-white/12 bg-black/35 p-5 backdrop-blur-md">
                    <item.icon className="h-6 w-6 text-accent" />
                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-white/55">{item.label}</p>
                    <p className="mt-2 text-sm font-bold leading-snug text-white">{item.value}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal direction="up" delay={0.5}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 px-8 py-7 text-base font-black uppercase tracking-wide text-black shadow-[0_18px_55px_rgba(251,191,36,0.38)] hover:from-amber-400 hover:to-yellow-500"
                >
                  <a href={ticketHref} target="_blank" rel="noopener noreferrer">
                    Reservar entradas
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/30 bg-white/10 px-8 py-7 text-base font-black uppercase tracking-wide text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href="/contacto">
                    Probar una clase
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.58}>
              <p className="mt-5 flex max-w-2xl items-center gap-3 text-sm font-mono text-white/60">
                <CalendarDays className="h-5 w-5 shrink-0 text-accent" />
                Schoolboy y junior a las 16h. Categoría joven y elite a las 18h.
              </p>
            </Reveal>
          </div>

          <Reveal direction="scale" delay={0.24}>
            <EventPoster />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
